import { describe, expect, test } from 'vitest'
import type { Bottle, Level } from '../types.ts'
import { countLow, filterBottles, groupCart, levelSummary, type CartFilter } from './cart.ts'

const bottle = (ingredientId: string, name?: string, level: Level = 'full'): Bottle => ({
  id: `${ingredientId}-${name ?? ''}`,
  ingredientId,
  name,
  level,
  addedAt: '2026-10-20T00:00:00.000Z',
})

const cart = [
  bottle('lime-juice'),
  bottle('blanco-tequila', 'Jose Cuervo Especial Silver'),
  bottle('mezcal', 'Del Maguey Vida'),
  bottle('blanco-tequila', 'Espolòn Blanco'),
  bottle('bourbon', 'Bulleit'),
  bottle('campari'),
]

test('levelSummary counts low and empty bottles, and is blank when none', () => {
  expect(levelSummary([bottle('campari', 'a', 'low'), bottle('campari', 'b', 'empty'), bottle('bourbon')])).toBe(
    '1 low · 1 empty',
  )
  expect(levelSummary([bottle('bourbon', 'a', 'low')])).toBe('1 low')
  expect(levelSummary([bottle('bourbon')])).toBe('')
  expect(countLow([bottle('bourbon', 'a', 'low'), bottle('bourbon', 'b', 'half')])).toBe(1)
})

test('sections follow category order and skip empty ones', () => {
  expect(groupCart(cart).map((s) => s.category)).toEqual(['spirit', 'liqueur', 'juice'])
})

test('spirits are grouped by family, tequila and mezcal apart', () => {
  const spirits = groupCart(cart)[0]
  expect(spirits.families.map((f) => f.name)).toEqual(['Mezcal', 'Tequila', 'Whiskey'])
})

test('two bottles of the same type both show, sorted by name', () => {
  const tequila = groupCart(cart)[0].families.find((f) => f.familyId === 'tequila')!
  expect(tequila.bottles.map((b) => b.name)).toEqual(['Espolòn Blanco', 'Jose Cuervo Especial Silver'])
})

test('only Spirits has families', () => {
  expect(groupCart(cart)[1].families).toEqual([])
})

test('a bottle with an unknown ingredient id lands in Other', () => {
  expect(groupCart([bottle('agave-spirit')]).map((s) => s.category)).toEqual(['other'])
})

describe('filterBottles', () => {
  const shelf = [
    bottle('bourbon', 'Bulleit', 'low'),
    bottle('rye-whiskey'),
    bottle('blanco-tequila', 'Espolòn Blanco'),
    bottle('campari', undefined, 'low'),
    bottle('angostura-bitters'),
    bottle('tonic-water'),
  ]
  const names = (query: string, filter: CartFilter = 'all') =>
    filterBottles(shelf, query, filter).map((b) => b.name ?? b.ingredientId)

  test('matches the bottle name, ignoring capitals', () => {
    expect(names('BULL')).toEqual(['Bulleit'])
  })

  test('matches the type, ignoring accents', () => {
    expect(names('espolon')).toEqual(['Espolòn Blanco'])
    expect(names('blanco')).toEqual(['Espolòn Blanco'])
    expect(names('campari')).toEqual(['campari'])
  })

  test('matches the family: "whiskey" finds bourbon and rye', () => {
    expect(names('whiskey')).toEqual(['Bulleit', 'rye-whiskey'])
  })

  test('Running low keeps only Low bottles', () => {
    expect(names('', 'low')).toEqual(['Bulleit', 'campari'])
  })

  test('category filters, and filter plus search together', () => {
    expect(names('', 'spirit')).toEqual(['Bulleit', 'rye-whiskey', 'Espolòn Blanco'])
    expect(names('', 'bitters')).toEqual(['angostura-bitters'])
    expect(names('', 'mixer')).toEqual(['tonic-water'])
    expect(names('whiskey', 'low')).toEqual(['Bulleit'])
  })

  test('an empty search with All keeps everything', () => {
    expect(names('  ')).toHaveLength(shelf.length)
  })
})
