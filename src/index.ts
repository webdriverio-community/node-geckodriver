import cp from 'node:child_process'

import { download as downloadDriver } from './install.js'
import { hasAccess, parseParams } from './utils.js'
import { DEFAULT_HOSTNAME } from './constants.js'
import type { GeckodriverParameters } from './types.js'

export async function start (params: GeckodriverParameters) {
  let geckoDriverPath = process.env.GECKODRIVER_FILEPATH || params.customGeckoDriverPath
  if (!geckoDriverPath) {
    geckoDriverPath = await downloadDriver(params.geckoDriverVersion, params.cacheDir)
  }

  if (!(await hasAccess(geckoDriverPath))) {
    throw new Error('Failed to access Geckodriver, was it installed successfully?')
  }

  if (!params.host) {
    params.host = DEFAULT_HOSTNAME
  }
  return cp.spawn(geckoDriverPath, parseParams(params))
}

export const download = downloadDriver
export * from './types.js'
