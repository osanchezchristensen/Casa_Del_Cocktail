import { expect, test } from 'vitest'
import type { Recipe } from '../types.ts'
import { formatAmount, matchesSource, sourceFilters } from './recipeDisplay.ts'

const withSource = (source: Recipe['source']) => ({ id: 'x', name: 'X', ingredients: [], steps: [], glass: 'rocks', method: 'built', tags: [], source }) as Recipe
const starter = withSource({ type: 'starter' })
const book = withSource({ type: 'book', title: 'Test Book', author: 'A', page: 1 })

test('source buttons appear only when there is a book, one per book title', () => {
  expect(sourceFilters([starter, starter])).toEqual([])
  expect(sourceFilters([starter, book, book]).map((f) => f.label)).toEqual(['All', 'Starter set', 'Test Book'])
})

test('a source filter keeps only that source; All keeps everything', () => {
  expect(matchesSource(starter, 'all')).toBe(true)
  expect(matchesSource(starter, 'starter')).toBe(true)
  expect(matchesSource(book, 'starter')).toBe(false)
  expect(matchesSource(book, 'book:Test Book')).toBe(true)
  expect(matchesSource(starter, 'book:Test Book')).toBe(false)
})

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
