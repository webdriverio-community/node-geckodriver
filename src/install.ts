import type { Agent as HttpAgent } from 'node:http'
import type { Agent as HttpsAgent } from 'node:https'
import os from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import fsp, { writeFile } from 'node:fs/promises'
import zlib from 'node:zlib'

import logger from '@wdio/logger'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'
import { unpackTar } from 'modern-tar/fs'
import { BlobReader, BlobWriter, ZipReader, type FileEntry } from '@zip.js/zip.js'

import { BINARY_FILE, GECKODRIVER_CARGO_YAML } from './constants.js'
import { hasAccess, getDownloadUrl, retryFetch } from './utils.js'

const log = logger('geckodriver')

const fetchOpts: RequestInit & {
    agent?: HttpAgent | HttpsAgent | InstanceType<typeof HttpsProxyAgent> | InstanceType<typeof HttpProxyAgent>
} = {}
if (process.env.HTTPS_PROXY) {
    fetchOpts.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY)
} else if (process.env.HTTP_PROXY) {
    fetchOpts.agent = new HttpProxyAgent(process.env.HTTP_PROXY)
}

// Only allow characters that are safe as a filename segment.
// Rejects path separators (/ \) and any traversal sequences.
const SAFE_VERSION_RE = /^[a-zA-Z0-9._-]+$/

export function getBinaryFilename (version: string) {
    if (!SAFE_VERSION_RE.test(version)) {
        throw new Error(`Invalid geckodriver version string: ${JSON.stringify(version)}`)
    }
    return `geckodriver-${version}` + (os.platform() === 'win32' ? '.exe' : '')
}

export async function download (
    geckodriverVersion: string = process.env.GECKODRIVER_VERSION,
    cacheDir: string = process.env.GECKODRIVER_CACHE_DIR || os.tmpdir()
) {
    /**
     * If the version is already known, check the versioned cache path first.
     * This is the hot path: zero network requests when the binary is cached.
     */
    if (geckodriverVersion) {
        const cachedPath = path.resolve(cacheDir, getBinaryFilename(geckodriverVersion))
        if (await hasAccess(cachedPath)) {
            return cachedPath
        }
    }

    /**
     * Version is unknown — fetch the latest release from Cargo.toml, then
     * check the versioned cache before hitting the network for the binary.
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

        // the resolved latest may already be cached
        const cachedPath = path.resolve(cacheDir, getBinaryFilename(geckodriverVersion))
        if (await hasAccess(cachedPath)) {
            return cachedPath
        }
    }

    const binaryFilePath = path.resolve(cacheDir, getBinaryFilename(geckodriverVersion))
    const url = getDownloadUrl(geckodriverVersion)
    log.info(`Downloading Geckodriver from ${url}`)
    const res = await retryFetch(url, fetchOpts)

    if (res.status !== 200) {
        throw new Error(`Failed to download binary (statusCode ${res.status}): ${res.statusText}`)
    }

    await fsp.mkdir(cacheDir, { recursive: true })

    // Extract into a unique per-operation staging directory so concurrent
    // downloads (even of the same version, e.g. parallel test runners) never
    // share intermediate files. The binary is moved into its final versioned
    // location once extraction succeeds.
    const stagingDir = await fsp.mkdtemp(path.join(cacheDir, 'geckodriver-'))
    try {
        await (url.endsWith('.zip')
            ? downloadZip(res, stagingDir)
            : pipeline(res.body, zlib.createGunzip(), unpackTar(stagingDir)))

        // archives always extract the binary with the generic name; rename to the
        // versioned filename so future cache lookups resolve to the correct version
        try {
            await fsp.rename(path.resolve(stagingDir, BINARY_FILE), binaryFilePath)
        } catch (err) {
            // a concurrent download of the same version may have produced the
            // final binary already; on Windows rename throws EEXIST/EPERM in
            // that case. Treat it as success if the destination is accessible.
            const code = (err as NodeJS.ErrnoException)?.code
            if ((code === 'EEXIST' || code === 'EPERM') && await hasAccess(binaryFilePath)) {
                return binaryFilePath
            }
            throw err
        }
    } finally {
        await fsp.rm(stagingDir, { recursive: true, force: true }).catch(() => {})
    }

    await fsp.chmod(binaryFilePath, '755')
    return binaryFilePath
}

async function downloadZip(res: Awaited<ReturnType<typeof retryFetch>>, stagingDir: string) {
    const zipBlob = await res.blob()
    const zip = new ZipReader(new BlobReader(zipBlob))
    const resolvedStagingDir = path.resolve(stagingDir)
    for (const entry of await zip.getEntries()) {
        const unzippedFilePath = path.join(stagingDir, entry.filename)
        if (entry.directory) {
            continue
        }
        /**
         * guard against Zip Slip: a malicious archive could contain entries
         * with `../` or absolute paths that escape the staging directory
         */
        const resolvedPath = path.resolve(unzippedFilePath)
        if (resolvedPath !== resolvedStagingDir && !resolvedPath.startsWith(resolvedStagingDir + path.sep)) {
            throw new Error(`Zip entry "${entry.filename}" resolves outside the staging directory`)
        }
        const fileEntry = entry as FileEntry
        if (!await hasAccess(path.dirname(unzippedFilePath))) {
            await fsp.mkdir(path.dirname(unzippedFilePath), { recursive: true })
        }
        const content = await fileEntry.getData<Blob>(new BlobWriter())
        await writeFile(unzippedFilePath, content.stream())
    }
}

/**
 * download on install
 */
const installJsPath = path.join('dist', 'install.js')
if (
    process.argv[1] &&
    path.normalize(process.argv[1]).endsWith(path.sep + installJsPath) &&
    process.env.GECKODRIVER_AUTO_INSTALL
) {
    await download().then(
        () => log.info('Success!'),
        (err) => log.error(`Failed to install Geckodriver: ${err.stack}`)
    )
}
