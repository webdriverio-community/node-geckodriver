import { test, expect } from 'vitest'

const { start, download } = require('../..')

test('should work in CJS context', () => {
  expect(typeof start).toBe('function')
  expect(typeof download).toBe('function')
})
