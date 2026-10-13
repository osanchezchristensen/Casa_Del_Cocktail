import { expect, test } from 'vitest'
import type { Recipe } from '../types.ts'
import ingredients from './ingredients.json'
import data from './recipes-starter.json'

const recipes = data as Recipe[]
const ingredientIds = new Set(ingredients.map((i) => i.id))

test('recipe ids are unique', () => {
  expect(new Set(recipes.map((r) => r.id)).size).toBe(recipes.length)
})

test('every recipe ingredient uses an id from ingredients.json', () => {
  for (const r of recipes) {
    for (const ri of r.ingredients) {
      expect(ingredientIds, `${r.id}: ${ri.ingredientId}`).toContain(ri.ingredientId)
    }
  }
})

test('every starter recipe has the starter source', () => {
  for (const r of recipes) expect(r.source, r.id).toEqual({ type: 'starter' })
})

test('every recipe has at least one required ingredient and one step', () => {
  for (const r of recipes) {
    expect(r.ingredients.some((ri) => !ri.garnish && !ri.optional), r.id).toBe(true)
    expect(r.steps.length, r.id).toBeGreaterThan(0)
  }
})
