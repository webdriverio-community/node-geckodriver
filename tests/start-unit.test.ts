
import cp from 'node:child_process'
import { vi, test, expect } from 'vitest'
import { type GeckodriverParameters, start } from '../src/index.ts'
import { download } from '../src/install.js'

test('start', async () => {
    vi.mock('../src/install.js', () =>  {
        return {
            download: vi.fn().mockResolvedValue('foo')
        }
    })

    vi.mock('../src/utils.js', async (original) =>  {
        const actual: any = await original()
        return {
            hasAccess: vi.fn().mockResolvedValue(true),
            parseParams: actual.parseParams
        }
    })

    vi.mock('node:child_process', () => ({
        default: {
            spawn: vi.fn(),
        }
    }))

    const args: GeckodriverParameters  = {
        spawnOpts: {
            env: {
                MOZ_HEADLESS_WIDTH: '720'
            }
        }
    }

    await start(args)
    expect(cp.spawn).toHaveBeenCalledWith('foo', ['--host=0.0.0.0', '--websocket-port=0'], {
        env: {
            MOZ_HEADLESS_WIDTH: '720'
        }
    })
})

test('start does not forward geckoDriverVersion as a Geckodriver CLI argument', async () => {
    vi.mocked(cp.spawn).mockClear()
    vi.mocked(download).mockClear()

    const args: GeckodriverParameters = {
        geckoDriverVersion: '0.36.0'
    }

    await start(args)

    // the version is used to download the correct driver binary...
    expect(download).toHaveBeenCalledWith('0.36.0', undefined)

    // ...but must not be passed to the Geckodriver executable (it rejects
    // unknown args, e.g. "unexpected argument '--gecko-driver-version' found")
    const spawnArgs = vi.mocked(cp.spawn).mock.calls[0][1] as string[]
    expect(spawnArgs).not.toContain('--gecko-driver-version=0.36.0')
    expect(spawnArgs.some((arg) => arg.startsWith('--gecko-driver-version'))).toBe(false)
})