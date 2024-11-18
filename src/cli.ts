import cp from 'node:child_process'

import { download } from './install.js'
import { hasAccess } from './utils.js'

export default async function run () {
    const binaryFilePath = await download()
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
