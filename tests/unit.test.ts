import os from 'node:os'
import { vi, test, expect } from 'vitest'
import fetch from 'node-fetch'

import { getDownloadUrl, parseParams, retryFetch } from '../src/utils.js'

vi.mock('node:os', () => ({
  default: {
    arch: vi.fn(),
    platform: vi.fn()
  }
}))

vi.mock('node-fetch', () => ({
  default: vi.fn()
}))

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

test('parseParams', () => {
  expect(parseParams({ marionetteHost: 'foobar', allowOrigins: ['123', '321'] }))
    .toMatchSnapshot()
})

test('retryFetch', async () => {
  vi.mocked(fetch)
    .mockRejectedValueOnce(new Error('request failed'))
    .mockRejectedValueOnce(new Error('request failed'))
    .mockResolvedValue('foobar' as any)
  expect(await retryFetch('foo', { bar: 'baz' } as any)).toBe('foobar')
  expect(fetch).toHaveBeenCalledTimes(3)
  expect(fetch).toHaveBeenCalledWith('foo', { bar: 'baz' })
})
