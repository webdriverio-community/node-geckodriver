import os from 'node:os'
import path, { dirname, join } from 'node:path'
import util from 'node:util'
import stream from 'node:stream'
import { createWriteStream } from 'node:fs'
import fsp, { mkdir, readFile, rm } from 'node:fs/promises'
import zlib from 'node:zlib'

import logger from '@wdio/logger'
import tar from 'tar-fs'
import { type RequestInit } from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { HttpProxyAgent } from 'http-proxy-agent'

import { BINARY_FILE, GECKODRIVER_CARGO_YAML } from './constants.js'
import { hasAccess, getDownloadUrl, retryFetch } from './utils.js'
import JSZip from 'jszip'

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
    ? downloadZip(res.body, cacheDir)
    : streamPipeline(res.body, zlib.createGunzip(), tar.extract(cacheDir)))

  await fsp.chmod(binaryFilePath, '755')
  return binaryFilePath
}

async function downloadZip(body: NodeJS.ReadableStream, cacheDir: string) {
  const zipName = 'gecko.zip'
  let res: (value: void | PromiseLike<void>) => void, rej: (reason?: any) => void
  const downloaded = new Promise<void>((resolve, reject) => {
    res = resolve
    rej = reject
  })
  body.pipe(createWriteStream(join(cacheDir, zipName), { encoding: 'binary' }))
    .on('close', () => res())
    .on('error', error => rej(error))
  await downloaded
  const zipBinary = await readFile(join(cacheDir, zipName), { encoding: 'binary' })
  const zip = await new JSZip().loadAsync(zipBinary)
  for (const [filePath, file] of Object.entries(zip.files)) {
    if (file.dir) {
      continue
    }
    if (!await hasAccess(dirname(filePath))) {
      await mkdir(dirname(filePath), { recursive: true })
    }
    const written = new Promise<void>((resolve, reject) => {
      res = resolve
      rej = reject
    })
    file.nodeStream()
      .pipe(createWriteStream(join(cacheDir, filePath)))
      .on('close', () => res())
      .on('error', error => rej(error))
    await written
  }
  await rm(join(cacheDir, zipName))
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
