import url from 'node:url'
import path from 'node:path'
import cp from 'node:child_process'

import { download } from './install.js'
import { hasAccess } from './utils.js'
import { BINARY_FILE } from './constants.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default async function run () {
  await download()
  const targetDir = path.resolve(__dirname, '..', '.bin')
  const binaryFilePath = path.resolve(targetDir, BINARY_FILE)

  if (!(await hasAccess(binaryFilePath))) {
    throw new Error('Failed to download Geckodriver')
  }

  const child = cp.spawn(binaryFilePath, process.argv.slice(2))
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.on('exit', process.exit)
  process.on('SIGTERM', function() {
    child.kill('SIGTERM')
    process.exit(1)
  })
}
