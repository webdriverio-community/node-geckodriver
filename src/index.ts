import cp from 'node:child_process'
import logger from '@wdio/logger'

import { download as downloadDriver } from './install.js'
import { hasAccess, parseParams } from './utils.js'
import { DEFAULT_HOSTNAME } from './constants.js'
import type { GeckodriverParameters } from './types.js'

const log = logger('geckodriver')

export async function start (params: GeckodriverParameters) {
  const { cacheDir, customGeckoDriverPath, ...startArgs } = params
  let geckoDriverPath = process.env.GECKODRIVER_FILEPATH || customGeckoDriverPath
  if (!geckoDriverPath) {
    geckoDriverPath = await downloadDriver(params.geckoDriverVersion, cacheDir)
  }

  if (!(await hasAccess(geckoDriverPath))) {
    throw new Error('Failed to access Geckodriver, was it installed successfully?')
  }

  startArgs.host = startArgs.host || DEFAULT_HOSTNAME

  // By default, Geckodriver uses port 9222
  // User might pass a port for custom runs but they should modify them for each worker
  // For remaining use cases, to enable parallel instances we need to set the port to 0 (random)
  // Otherwise all instances try to connect to the default port and fail
  startArgs.websocketPort = startArgs.websocketPort ?? 0

  const args = parseParams(startArgs)
  log.info(`Starting Geckodriver at ${geckoDriverPath} with params: ${args.join(' ')}`)
  return cp.spawn(geckoDriverPath, args)
}

export const download = downloadDriver
export * from './types.js'
