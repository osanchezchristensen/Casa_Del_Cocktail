import { describe, expect, test } from 'vitest'
import type { Recipe } from '../types.ts'
import data from '../data/recipes-starter.json'
import { canMake, matchRecipe, ownedIngredientIds, unlockSuggestions } from './matching.ts'

const recipes = data as Recipe[]
const recipe = (id: string) => recipes.find((r) => r.id === id)!
const own = (...ids: string[]) => new Set(ids)
const missing = (id: string, owned: Set<string>, allowSwaps = false) =>
  matchRecipe(recipe(id), owned, allowSwaps).missing

/** A one-ingredient test recipe, for families no starter recipe uses. */
const needs = (ingredientId: string): Recipe => ({
  id: 'test',
  name: 'Test',
  ingredients: [{ ingredientId, amount: 2, unit: 'oz' }],
  steps: [],
  glass: 'rocks',
  method: 'stirred',
  tags: [],
  source: { type: 'starter' },
})

describe('roadmap examples', () => {
  test('bourbon, sweet vermouth, Angostura → Manhattan: yes (garnish ignored)', () => {
    expect(canMake(recipe('manhattan'), own('bourbon', 'sweet-vermouth', 'angostura-bitters'))).toBe(true)
  })

  test('dark rum, lime, syrup → Daiquiri (needs white rum): no', () => {
    expect(missing('daiquiri', own('dark-rum', 'lime-juice', 'simple-syrup'))).toEqual(['white-rum'])
  })

  test('Campari is Empty → Negroni: no', () => {
    const owned = ownedIngredientIds([
      { ingredientId: 'london-dry-gin', level: 'full' },
      { ingredientId: 'sweet-vermouth', level: 'half' },
      { ingredientId: 'campari', level: 'empty' },
    ])
    expect(missing('negroni', owned)).toEqual(['campari'])
  })
})

describe('edge cases', () => {
  test('mint in a Mojito is required (garnish is decided by the recipe flag)', () => {
    expect(missing('mojito', own('white-rum', 'lime-juice', 'simple-syrup', 'soda-water'))).toEqual(['mint'])
  })

  test('optional and always-on-hand ingredients are ignored', () => {
    // Martini: orange bitters optional. Old Fashioned: sugar always on hand.
    expect(canMake(recipe('martini'), own('gin', 'dry-vermouth'))).toBe(true)
    expect(canMake(recipe('old-fashioned'), own('rye-whiskey', 'angostura-bitters'))).toBe(true)
  })

  test('one Empty and one Half bottle of the same type still counts as owned', () => {
    const owned = ownedIngredientIds([
      { ingredientId: 'london-dry-gin', level: 'empty' },
      { ingredientId: 'london-dry-gin', level: 'half' },
      { ingredientId: 'tonic-water', level: 'low' },
    ])
    expect(canMake(recipe('gin-and-tonic'), owned)).toBe(true)
  })

  test('owning the general bottle does not cover a specific recipe', () => {
    expect(missing('daiquiri', own('rum', 'lime-juice', 'simple-syrup'))).toEqual(['white-rum'])
  })

  test('rum never covers gin', () => {
    expect(canMake(recipe('gin-and-tonic'), own('white-rum', 'tonic-water'))).toBe(false)
  })

  test('coconut rum is not in the rum family', () => {
    expect(canMake(recipe('dark-n-stormy'), own('coconut-rum', 'ginger-beer'))).toBe(false)
  })

  test('an empty cart makes nothing', () => {
    expect(recipes.filter((r) => canMake(r, own(), true))).toEqual([])
  })
})

describe('swaps (rules 3, 7, 8)', () => {
  const daiquiriCart = own('dark-rum', 'lime-juice', 'simple-syrup')

  test('dark rum for white rum works with swaps on', () => {
    expect(matchRecipe(recipe('daiquiri'), daiquiriCart, true)).toEqual({
      status: 'swap',
      swaps: [{ needed: 'white-rum', used: 'dark-rum' }],
      missing: [],
    })
  })

  test('swaps off: no swap', () => {
    expect(matchRecipe(recipe('daiquiri'), daiquiriCart).status).toBe('missing')
  })

  test('the exact bottle is still a perfect match with swaps on', () => {
    expect(matchRecipe(recipe('daiquiri'), own('white-rum', 'lime-juice', 'simple-syrup'), true)).toEqual({
      status: 'perfect',
      swaps: [],
      missing: [],
    })
  })

  test('rum never replaces gin', () => {
    expect(missing('gin-and-tonic', own('white-rum', 'tonic-water'), true)).toEqual(['gin'])
  })

  test('swaps reach deep families: blended scotch for Islay scotch', () => {
    expect(matchRecipe(needs('islay-scotch'), own('blended-scotch'), true).swaps).toEqual([
      { needed: 'islay-scotch', used: 'blended-scotch' },
    ])
  })

  test('mezcal does not fill blanco tequila (only tequilas are siblings)', () => {
    expect(matchRecipe(needs('blanco-tequila'), own('mezcal'), true).status).toBe('missing')
  })

  test('mezcal never replaces tequila (tequila is its own family)', () => {
    expect(missing('margarita', own('mezcal', 'triple-sec', 'lime-juice'), true)).toEqual(['tequila'])
  })

  test('noSwap: dry vermouth never replaces sweet vermouth', () => {
    expect(missing('manhattan', own('bourbon', 'dry-vermouth', 'angostura-bitters'), true)).toEqual([
      'sweet-vermouth',
    ])
  })

  test('noSwap: spiced rum never fills in for white rum', () => {
    expect(missing('daiquiri', own('spiced-rum', 'lime-juice', 'simple-syrup'), true)).toEqual(['white-rum'])
  })
})

describe('any of this family (rule 4)', () => {
  test('dry curaçao fills triple sec in a Margarita, as a perfect match, swaps off', () => {
    expect(matchRecipe(recipe('margarita'), own('blanco-tequila', 'dry-curacao', 'lime-juice'))).toEqual({
      status: 'perfect',
      swaps: [],
      missing: [],
    })
  })

  test('anyOfFamily still accepts a noSwap member (blue curaçao)', () => {
    expect(canMake(recipe('margarita'), own('blanco-tequila', 'blue-curacao', 'lime-juice'))).toBe(true)
  })

  test('anyOfFamily stays inside the family', () => {
    expect(missing('margarita', own('blanco-tequila', 'cherry-liqueur', 'lime-juice'))).toEqual(['triple-sec'])
  })
})

describe('unlock suggestions', () => {
  // Shows each suggestion as "ingredient: recipe ids" so failures are easy to read.
  const unlock = (owned: Set<string>, allowSwaps = false, list = recipes) =>
    unlockSuggestions(owned, list, allowSwaps).map((s) => `${s.ingredientId}: ${s.recipes.map((r) => r.id).join(', ')}`)

  const cart = own('white-rum', 'lime-juice', 'simple-syrup', 'mint', 'gin', 'lemon-juice', 'aperol', 'prosecco')

  test('soda water ranks first, unlocking Mojito, Tom Collins and Aperol Spritz', () => {
    expect(unlock(cart)[0]).toBe('soda-water: mojito, tom-collins, aperol-spritz')
  })

  test('never suggests owned ingredients or counts makeable recipes', () => {
    const results = unlockSuggestions(cart, recipes)
    for (const s of results) {
      expect(cart.has(s.ingredientId)).toBe(false)
      for (const r of s.recipes) expect(canMake(r, cart)).toBe(false)
    }
  })

  test('an Empty bottle can be suggested', () => {
    const owned = ownedIngredientIds([
      { ingredientId: 'gin', level: 'full' },
      { ingredientId: 'sweet-vermouth', level: 'full' },
      { ingredientId: 'campari', level: 'empty' },
    ])
    expect(unlock(owned)).toContain('campari: negroni')
  })

  test('respects allow swaps', () => {
    const rumCart = own('dark-rum', 'lime-juice', 'simple-syrup', 'mint')
    // Swaps off: white rum is the one thing the Daiquiri lacks.
    expect(unlock(rumCart)).toContain('white-rum: daiquiri')
    // Swaps on: the Daiquiri is already makeable, and the Mojito only lacks soda water.
    expect(unlock(rumCart, true)).toContain('soda-water: mojito')
    expect(unlock(rumCart, true).some((s) => s.startsWith('white-rum'))).toBe(false)
  })

  test('returns at most 10, ties sorted by id', () => {
    const ids = ['absinthe', 'aperol', 'bourbon', 'campari', 'cognac', 'gin', 'mezcal', 'mint', 'rum', 'tequila', 'vodka', 'white-rum']
    const result = unlock(own(), false, ids.map(needs))
    expect(result).toHaveLength(10)
    expect(result[0]).toBe('absinthe: test')
    expect(result[9]).toBe('tequila: test')
  })
})
