
import cp from 'node:child_process'
import { vi, test, expect } from 'vitest'
import { type GeckodriverParameters, start } from '../src/index.ts'

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