import os from 'node:os'
import { vi, test, expect, afterEach } from 'vitest'

import { getDownloadUrl, parseParams, retryFetch } from '../src/utils.js'

vi.mock('node:os', () => ({
    default: {
        arch: vi.fn(),
        platform: vi.fn(),
        tmpdir: vi.fn(() => '/tmp')
    }
}))

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status: 400,
    text: () => Promise.resolve('foobar'),
    json: () => Promise.resolve({ foo: 'bar' })
}))

afterEach(() => {
    vi.mocked(globalThis.fetch).mockReset()
})

test('getDownloadUrl', () => {
    vi.mocked(os.arch).mockReturnValue('arm')
    vi.mocked(os.platform).mockReturnValue('linux')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
    vi.mocked(os.arch).mockReturnValue('arm64')
    vi.mocked(os.platform).mockReturnValue('linux')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
    vi.mocked(os.arch).mockReturnValue('arm')
    vi.mocked(os.platform).mockReturnValue('win32')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
    vi.mocked(os.arch).mockReturnValue('arm64')
    vi.mocked(os.platform).mockReturnValue('win32')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
    vi.mocked(os.arch).mockReturnValue('x64')
    vi.mocked(os.platform).mockReturnValue('darwin')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
    vi.mocked(os.arch).mockReturnValue('arm64')
    vi.mocked(os.platform).mockReturnValue('darwin')
    expect(getDownloadUrl('0.33.0')).toMatchSnapshot()
})

test('download with proxy support', async () => {
    // Ensure hasAccess always returns false so download always calls fetch
    vi.mock('../src/utils.js', async () => {
        const actual = await vi.importActual('../src/utils.js')
        return {
            ...actual,
            hasAccess: vi.fn().mockResolvedValue(false)
        }
    })
    process.env.HTTPS_PROXY = 'https://proxy.com'
    vi.resetModules()
    const fetchSpy = vi.fn().mockResolvedValue({
        status: 400,
        text: () => Promise.resolve('foobar'),
        json: () => Promise.resolve({ foo: 'bar' })
    })
    vi.stubGlobal('fetch', fetchSpy)
    const { download } = await import('../src/install.js')
    await download('stable').catch(() => {})
    expect(fetchSpy).toBeCalledWith(
        expect.any(String),
        expect.objectContaining({
            agent: expect.any(Object)
        })
    )
})

test('parseParams', () => {
    expect(parseParams({ marionetteHost: 'foobar', allowOrigins: ['123', '321'] }))
        .toMatchSnapshot()
})

test('retryFetch', async () => {
    vi.mocked(globalThis.fetch)
        .mockRejectedValueOnce(new Error('request failed'))
        .mockRejectedValueOnce(new Error('request failed'))
        .mockResolvedValue('foobar' as any)
    expect(await retryFetch('foo', { bar: 'baz' } as any)).toBe('foobar')
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
    expect(globalThis.fetch).toHaveBeenCalledWith('foo', { bar: 'baz' })
})
