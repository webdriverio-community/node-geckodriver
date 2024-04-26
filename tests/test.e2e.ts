import waitPort from 'wait-port'
import { remote } from 'webdriverio'
import { locateFirefox } from 'locate-app'

import { download, start } from '../src/index.js'

// start geckodriver automatically
console.log('= start geckodriver automatically =')
try {
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
}

// start specific geckodriver
console.log('= start specific geckodriver =')

const binary = await download()

try {
  const browser = await remote({
    automationProtocol: 'webdriver',
    capabilities: {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless']
      },
      'wdio:geckodriverOptions': {
        binary
      }
    }
  })
  await browser.url('https://webdriver.io')
  await browser.deleteSession()
} catch (err) {
  console.error(err)
  process.exit(1)
}

// start geckodriver manually
console.log('= start geckodriver manually =')

const port = 4444
const cp = await start({ port })

try {
  const firefoxPath = await locateFirefox()
  await waitPort({ port })
  const browser = await remote({
    automationProtocol: 'webdriver',
    port, // must set port or wdio will automatically start geckodriver
    capabilities: {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless'],
        binary: firefoxPath
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
