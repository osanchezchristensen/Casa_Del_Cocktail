import { expect, test } from 'vitest'
import { pickTonight } from './home.ts'

test('the seed picks an item, including at the edges', () => {
  const list = ['a', 'b', 'c']
  expect(pickTonight(list, 0)).toBe('a')
  expect(pickTonight(list, 0.5)).toBe('b')
  expect(pickTonight(list, 0.999999)).toBe('c')
})

test('an empty list has no pick', () => {
  expect(pickTonight([], 0.4)).toBeUndefined()
})
