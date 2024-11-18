import os from 'node:os'
import path from 'node:path'
import util from 'node:util'
import stream from 'node:stream'
import fsp, { writeFile } from 'node:fs/promises'
import zlib from 'node:zlib'

import logger from '@wdio/logger'
import tar from 'tar-fs'
import { type RequestInit } from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'

import { BINARY_FILE, GECKODRIVER_CARGO_YAML } from './constants.js'
import { hasAccess, getDownloadUrl, retryFetch } from './utils.js'

import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'

const log = logger('geckodriver')
const streamPipeline = util.promisify(stream.pipeline)

const fetchOpts: RequestInit = {}
if (process.env.HTTPS_PROXY) {
    fetchOpts.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY)
} else if (process.env.HTTP_PROXY) {
    fetchOpts.agent = new HttpProxyAgent(process.env.HTTP_PROXY)
}

export async function download (
    geckodriverVersion: string = process.env.GECKODRIVER_VERSION,
    cacheDir: string = process.env.GECKODRIVER_CACHE_DIR || os.tmpdir()
) {
    const binaryFilePath = path.resolve(cacheDir, BINARY_FILE)
    if (await hasAccess(binaryFilePath)) {
        return binaryFilePath
    }

    /**
   * get latest version of Geckodriver
   */
    if (!geckodriverVersion) {
        const res = await retryFetch(GECKODRIVER_CARGO_YAML, fetchOpts)
        const toml = await res.text()
        const version = toml.split('\n').find((l) => l.startsWith('version = '))
        if (!version) {
            throw new Error(`Couldn't find version property in Cargo.toml file: ${JSON.stringify(toml)}`)
        }
        geckodriverVersion = version.split(' = ').pop().slice(1, -1)
        log.info(`Detected Geckodriver v${geckodriverVersion} to be latest`)
    }

    const url = getDownloadUrl(geckodriverVersion)
    log.info(`Downloading Geckodriver from ${url}`)
    const res = await retryFetch(url, fetchOpts)

    if (res.status !== 200) {
        throw new Error(`Failed to download binary (statusCode ${res.status}): ${res.statusText}`)
    }

    await fsp.mkdir(cacheDir, { recursive: true })
    await (url.endsWith('.zip')
        ? downloadZip(res, cacheDir)
        : streamPipeline(res.body, zlib.createGunzip(), tar.extract(cacheDir)))

    await fsp.chmod(binaryFilePath, '755')
    return binaryFilePath
}

async function downloadZip(res: Awaited<ReturnType<typeof retryFetch>>, cacheDir: string) {
    const zipBlob = await res.blob()
    const zip = new ZipReader(new BlobReader(zipBlob))
    for (const entry of await zip.getEntries()) {
        const unzippedFilePath = path.join(cacheDir, entry.filename)
        if (entry.directory) {
            continue
        }
        if (!await hasAccess(path.dirname(unzippedFilePath))) {
            await fsp.mkdir(path.dirname(unzippedFilePath), { recursive: true })
        }
        const content = await entry.getData<Blob>(new BlobWriter())
        await writeFile(unzippedFilePath, content.stream())
    }
}

/**
 * download on install
 */
if (process.argv[1] && process.argv[1].endsWith('/dist/install.js') && process.env.GECKODRIVER_AUTO_INSTALL) {
    await download().then(
        () => log.info('Success!'),
        (err) => log.error(`Failed to install Geckodriver: ${err.stack}`)
    )
}
