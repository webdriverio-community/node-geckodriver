import os from 'node:os'

export const MOZ_CENTRAL_CARGO_TOML = 'https://hg.mozilla.org/mozilla-central/raw-file/tip/testing/geckodriver/Cargo.toml'
// e.g. https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-macos-aarch64.tar.gz
export const GECKODRIVER_DOWNLOAD_PATH = 'https://github.com/mozilla/geckodriver/releases/download/v%s/geckodriver-v%s-%s%s%s'

export const BINARY_FILE = 'geckodriver' + (os.platform() === 'win32' ? '.exe' : '')
