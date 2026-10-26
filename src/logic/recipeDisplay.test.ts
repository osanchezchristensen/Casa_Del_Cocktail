import { expect, test } from 'vitest'
import { formatAmount } from './recipeDisplay.ts'

test('amounts use fractions and the right unit words', () => {
  expect(formatAmount(2, 'oz')).toBe('2 oz')
  expect(formatAmount(0.75, 'oz')).toBe('¾ oz')
  expect(formatAmount(1.5, 'oz')).toBe('1½ oz')
  expect(formatAmount(0.25, 'oz')).toBe('¼ oz')
  expect(formatAmount(1, 'dash')).toBe('1 dash')
  expect(formatAmount(2, 'dash')).toBe('2 dashes')
  expect(formatAmount(1, 'barspoon')).toBe('1 barspoon')
  expect(formatAmount(1, 'tsp')).toBe('1 tsp')
  expect(formatAmount(8, 'piece')).toBe('8')
  expect(formatAmount(4, 'top')).toBe('Top')
})
