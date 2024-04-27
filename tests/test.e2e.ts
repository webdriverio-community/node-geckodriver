import os from 'node:os'
import waitPort from 'wait-port'
import { remote } from 'webdriverio'
import { install, Browser } from '@puppeteer/browsers'

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
  console.log(browser.capabilities);

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
  await waitPort({ port })
  const firefox = await install({
    browser: Browser.FIREFOX,
    buildId: 'stable',
    cacheDir: os.tmpdir()
  })
  const browser = await remote({
    automationProtocol: 'webdriver',
    port, // must set port or wdio will automatically start geckodriver
    capabilities: {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        binary: firefox.executablePath,
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
