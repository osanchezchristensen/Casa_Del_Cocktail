import { expect, test } from 'vitest'
import { INGREDIENT_CATEGORIES, type Ingredient } from '../types.ts'
import data from './ingredients.json'

const ingredients = data as Ingredient[]
const byId = new Map(ingredients.map((i) => [i.id, i]))

test('ids are unique, lowercase and dash-separated', () => {
  expect(byId.size).toBe(ingredients.length)
  for (const i of ingredients) expect(i.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
})

test('every category is a known category', () => {
  for (const i of ingredients) expect(INGREDIENT_CATEGORIES, i.id).toContain(i.category)
})

test('every parentId points to a real ingredient in the same category', () => {
  for (const i of ingredients) {
    if (i.parentId === null) continue
    expect(byId.get(i.parentId)?.category, i.id).toBe(i.category)
  }
})

test('the family tree is at most three levels deep (so it has no loops)', () => {
  for (const i of ingredients) {
    let depth = 1
    let current = i
    while (current.parentId && depth <= 3) {
      current = byId.get(current.parentId)!
      depth++
    }
    expect(depth, i.id).toBeLessThanOrEqual(3)
  }
})

test('noSwap only sits on ingredients that have a parent', () => {
  for (const i of ingredients) {
    if (i.noSwap) expect(i.parentId, i.id).not.toBeNull()
  }
})

test('only ice, water, sugar and salt are always on hand', () => {
  const basics = ingredients.filter((i) => i.alwaysOnHand).map((i) => i.id)
  expect(basics.sort()).toEqual(['ice', 'salt', 'sugar', 'water'])
})
