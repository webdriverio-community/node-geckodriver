import os from 'node:os'
import util from 'node:util'
import fs from 'node:fs/promises'

import decamelize from 'decamelize'

import { GECKODRIVER_DOWNLOAD_PATH } from './constants.js'
import type { GeckodriverParameters } from 'types.js'

export async function hasAccess(filePath: string) {
  return fs.access(filePath).then(() => true, () => false)
}

export function getDownloadUrl (version: string) {
  const platformIdentifier = os.platform() === 'win32'
    ? 'win'
    : os.platform() === 'darwin'
      ? 'macos'
      : 'linux'
  const arch = os.arch() === 'arm64'
    ? '-aarch64'
    : os.arch() === 'x64'
      ? '64'
      : '32'
  const ext = os.platform() === 'win32' ? '.zip' : '.tar.gz'
  return util.format(GECKODRIVER_DOWNLOAD_PATH, version, version, platformIdentifier, arch, ext)
}

const EXCLUDED_PARAMS = ['version', 'help']
export function parseParams (params: GeckodriverParameters) {
  return Object.entries(params)
    .filter(([key,]) => !EXCLUDED_PARAMS.includes(key))
    .map(([key, val]) => {
      if (typeof val === 'boolean' && !val) {
        return ''
      }
      const vals = Array.isArray(val) ? val : [val]
      return vals.map((v) => `--${decamelize(key, { separator: '-' })}${typeof v === 'boolean' ? '' : `=${v}`}`)
    })
    .flat()
    .filter(Boolean)
}
