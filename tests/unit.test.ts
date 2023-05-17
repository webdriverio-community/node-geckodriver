import os from 'node:os'
import { vi, test, expect } from 'vitest'

import { getDownloadUrl, parseParams } from '../src/utils.js'

vi.mock('node:os', () => ({
  default: {
    arch: vi.fn(),
    platform: vi.fn()
  }
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
  expect(parseParams({ baseUrl: 'foobar', silent: true, verbose: false, allowedIps: ['123', '321'] }))
    .toMatchSnapshot()
})
