import url from 'node:url'
import path from 'node:path'
import cp from 'node:child_process'

import { download as downloadDriver } from './install.js'
import { hasAccess, parseParams } from './utils.js'
import { BINARY_FILE } from './constants.js'
import type { GeckodriverParameters } from 'types.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export async function start (params: GeckodriverParameters) {
  const customGeckoDriverPath = process.env.GECKODRIVER_FILEPATH || params.customGeckoDriverPath
  if (!customGeckoDriverPath) {
    await downloadDriver(params.geckoDriverVersion)
  }
  const targetDir = path.resolve(__dirname, '..', '.bin')
  const binaryFilePath = customGeckoDriverPath || path.resolve(targetDir, BINARY_FILE)

  if (!(await hasAccess(binaryFilePath))) {
    throw new Error('Failed to access Geckodriver, was it installed successfully?')
  }

  return cp.spawn(binaryFilePath, parseParams(params))
}

export const download = downloadDriver
export * from './types.js'
