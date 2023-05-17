import waitPort from 'wait-port'
import { remote } from 'webdriverio'

import { start } from '../dist/index.js'

const port = 4444
const cp = await start({ port })

try {
  await waitPort({ port: 4444 })
  const browser = await remote({
    automationProtocol: 'webdriver',
    capabilities: {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless']
      }
    }
  })
  await browser.url('https://webdriver.io')
  await browser.deleteSession()
} catch (err) {
  console.error(err)
  process.exit(1)
} finally {
  cp.kill()
}
