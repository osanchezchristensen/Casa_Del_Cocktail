import { expect, test } from 'vitest'
import data from '../data/recipes-starter.json'
import type { Recipe } from '../types.ts'
import { splitFavorites } from './favorites.ts'

const recipes = data as Recipe[]
const fav = (recipeId: string, savedAt: string) => ({ recipeId, savedAt })
const ids = (list: { recipe: Recipe }[]) => list.map((m) => m.recipe.id)

test('favorites split into ready and missing, newest saved first', () => {
  const favorites = [
    fav('old-fashioned', '2026-10-01T00:00:00Z'),
    fav('negroni', '2026-10-02T00:00:00Z'),
    fav('manhattan', '2026-10-03T00:00:00Z'),
  ]
  const owned = new Set(['bourbon', 'angostura-bitters', 'sweet-vermouth'])
  const { ready, missing } = splitFavorites(favorites, recipes, owned)
  expect(ids(ready)).toEqual(['manhattan', 'old-fashioned'])
  expect(ids(missing)).toEqual(['negroni'])
  expect(missing[0].match.missing.length).toBeGreaterThan(0)
})

test('a favorite moves to ready when the cart changes', () => {
  const favorites = [fav('negroni', '2026-10-02T00:00:00Z')]
  const before = splitFavorites(favorites, recipes, new Set(['london-dry-gin', 'sweet-vermouth']))
  expect(ids(before.missing)).toEqual(['negroni'])
  const after = splitFavorites(favorites, recipes, new Set(['london-dry-gin', 'sweet-vermouth', 'campari']))
  expect(ids(after.ready)).toEqual(['negroni'])
})

test('a favorite with an unknown recipe id is skipped', () => {
  expect(splitFavorites([fav('gone', '2026-10-01T00:00:00Z')], recipes, new Set())).toEqual({ ready: [], missing: [] })
})
