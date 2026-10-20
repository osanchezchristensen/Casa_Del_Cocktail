import { expect, test } from 'vitest'
import type { Bottle } from '../types.ts'
import { groupCart } from './cart.ts'

const bottle = (ingredientId: string, name?: string): Bottle => ({
  id: `${ingredientId}-${name ?? ''}`,
  ingredientId,
  name,
  level: 'full',
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
