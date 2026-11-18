import { afterEach, expect, test, vi } from 'vitest'
import { prefersReducedMotion } from './motion.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

function fakeDevice(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query === '(prefers-reduced-motion: reduce)',
  }))
}

test('reports reduce motion when the device has it on', () => {
  fakeDevice(true)
  expect(prefersReducedMotion()).toBe(true)
})

test('reports no reduce motion when the device has it off', () => {
  fakeDevice(false)
  expect(prefersReducedMotion()).toBe(false)
})

test('without a browser, reduce motion is off', () => {
  expect(prefersReducedMotion()).toBe(false)
})
