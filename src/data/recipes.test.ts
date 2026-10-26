// Data check over every loaded recipe: the starter set plus any private book files.
// Rules only; book content never goes in tracked files.
import { expect, test } from 'vitest'
import type { Glass, Method, Unit } from '../types.ts'
import ingredients from './ingredients.json'
import { ALL_RECIPES } from './recipes.ts'

const ingredientIds = new Set(ingredients.map((i) => i.id))
// JSON loaded by import.meta.glob isn't type-checked, so these lists are checked here.
const GLASSES: Glass[] = ['coupe', 'rocks', 'highball', 'martini', 'collins', 'flute', 'mug', 'other']
const METHODS: Method[] = ['shaken', 'stirred', 'built', 'blended']
const UNITS: Unit[] = ['oz', 'ml', 'dash', 'barspoon', 'tsp', 'piece', 'top']

test('recipe ids are unique across the starter set and book files', () => {
  const ids = ALL_RECIPES.map((r) => r.id)
  expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
})

test('every recipe ingredient uses an id from ingredients.json', () => {
  for (const r of ALL_RECIPES) {
    for (const ri of r.ingredients) expect(ingredientIds, `${r.id}: ${ri.ingredientId}`).toContain(ri.ingredientId)
  }
})

test('every book recipe has a title, an author and a page', () => {
  for (const r of ALL_RECIPES) {
    if (r.source.type !== 'book') {
      expect(r.source, r.id).toEqual({ type: 'starter' })
      continue
    }
    expect(r.source.title, r.id).toBeTruthy()
    expect(r.source.author, r.id).toBeTruthy()
    expect(Number.isInteger(r.source.page) && r.source.page > 0, `${r.id}: page`).toBe(true)
  }
})

test('glass, method and units are allowed values', () => {
  for (const r of ALL_RECIPES) {
    expect(GLASSES, `${r.id}: glass`).toContain(r.glass)
    expect(METHODS, `${r.id}: method`).toContain(r.method)
    for (const ri of r.ingredients) {
      expect(UNITS, `${r.id}: ${ri.ingredientId} unit`).toContain(ri.unit)
      expect(ri.amount, `${r.id}: ${ri.ingredientId} amount`).toBeGreaterThan(0)
    }
  }
})

test('every recipe has at least one required ingredient and one step', () => {
  for (const r of ALL_RECIPES) {
    expect(r.ingredients.some((ri) => !ri.garnish && !ri.optional), r.id).toBe(true)
    expect(r.steps.length, r.id).toBeGreaterThan(0)
  }
})
