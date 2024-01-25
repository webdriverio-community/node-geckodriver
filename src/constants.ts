import os from 'node:os'

export const GECKODRIVER_RELEASES = 'https://api.github.com/repos/mozilla/geckodriver/releases/latest'
export const BASE_CDN_URL = process.env.GECKODRIVER_CDNURL || process.env.npm_config_geckodriver_cdnurl || 'https://github.com/mozilla/geckodriver/releases/download'
// e.g. https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-macos-aarch64.tar.gz
export const GECKODRIVER_DOWNLOAD_PATH = `${BASE_CDN_URL}/v%s/geckodriver-v%s-%s%s%s`
export const DEFAULT_HOSTNAME = '0.0.0.0'
export const BINARY_FILE = 'geckodriver' + (os.platform() === 'win32' ? '.exe' : '')
