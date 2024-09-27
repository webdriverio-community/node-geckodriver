import cp from 'node:child_process'
import logger from '@wdio/logger'

import { download as downloadDriver } from './install.js'
import { hasAccess, parseParams } from './utils.js'
import { DEFAULT_HOSTNAME } from './constants.js'
import type { GeckodriverParameters } from './types.js'

const log = logger('geckodriver')

export async function start (params: GeckodriverParameters) {
  const { cacheDir, customGeckoDriverPath, spawnOpts, ...startArgs } = params
  let geckoDriverPath = (
    customGeckoDriverPath ||
    process.env.GECKODRIVER_PATH ||
    // deprecated
    process.env.GECKODRIVER_FILEPATH
  )
  if (!geckoDriverPath) {
    geckoDriverPath = await downloadDriver(params.geckoDriverVersion, cacheDir)
  }

  if (!(await hasAccess(geckoDriverPath))) {
    throw new Error('Failed to access Geckodriver, was it installed successfully?')
  }

  startArgs.host = startArgs.host || DEFAULT_HOSTNAME

  // By default, Geckodriver uses port 9222.
  // Users may specify a custom port for individual runs, but they need to modify it for each worker.
  // For other cases, to enable parallel instances, we need to set the port to 0 (random).
  // Otherwise, all instances will attempt to connect to the default port and fail.
  // If both --connect-existing and --websocket-port are used together, an error is thrown.
  // However, if --connect-existing is not used and --websocket-port is not specified, the websocketPort is set to 0.
  if (startArgs.connectExisting && startArgs.websocketPort) {
    throw new Error(
      'Cannot use --connect-existing and --websocket-port together'
    )
  } else if (!startArgs.connectExisting && !startArgs.websocketPort) {
    startArgs.websocketPort = 0
  }

  const args = parseParams(startArgs)
  log.info(`Starting Geckodriver at ${geckoDriverPath} with params: ${args.join(' ')}`)
  return cp.spawn(geckoDriverPath, args, spawnOpts)
}

export const download = downloadDriver
export * from './types.js'
