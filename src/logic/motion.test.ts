import { afterEach, describe, expect, test, vi } from 'vitest'
import { COUNT_DELAY, COUNT_DURATION, countAt, prefersReducedMotion } from './motion.ts'

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

describe('countAt (Count and burst)', () => {
  test('starts at 0 while the badge pops in', () => {
    expect(countAt(0, 6)).toBe(0)
    expect(countAt(COUNT_DELAY, 6)).toBe(0)
  })

  test('ends exactly on the target and stays there', () => {
    expect(countAt(COUNT_DELAY + COUNT_DURATION, 6)).toBe(6)
    expect(countAt(5000, 6)).toBe(6)
  })

  test('climbs without going past the target', () => {
    let last = 0
    for (let ms = 0; ms <= 1200; ms += 16) {
      const n = countAt(ms, 9)
      expect(n).toBeGreaterThanOrEqual(last)
      expect(n).toBeLessThanOrEqual(9)
      last = n
    }
  })
})
