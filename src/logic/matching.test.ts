import { describe, expect, test } from 'vitest'
import type { Recipe } from '../types.ts'
import data from '../data/recipes-starter.json'
import { canMake, missingIngredients, ownedIngredientIds } from './matching.ts'

const recipes = data as Recipe[]
const recipe = (id: string) => recipes.find((r) => r.id === id)!
const own = (...ids: string[]) => new Set(ids)

describe('roadmap examples', () => {
  test('bourbon, sweet vermouth, Angostura → Manhattan: yes (garnish ignored)', () => {
    expect(canMake(recipe('manhattan'), own('bourbon', 'sweet-vermouth', 'angostura-bitters'))).toBe(true)
  })

  test('dark rum, lime, syrup → Daiquiri (needs white rum): no', () => {
    const owned = own('dark-rum', 'lime-juice', 'simple-syrup')
    expect(missingIngredients(recipe('daiquiri'), owned)).toEqual(['white-rum'])
  })

  test('Campari is Empty → Negroni: no', () => {
    const owned = ownedIngredientIds([
      { ingredientId: 'london-dry-gin', level: 'full' },
      { ingredientId: 'sweet-vermouth', level: 'half' },
      { ingredientId: 'campari', level: 'empty' },
    ])
    expect(missingIngredients(recipe('negroni'), owned)).toEqual(['campari'])
  })
})

describe('edge cases', () => {
  test('mint in a Mojito is required (garnish is decided by the recipe flag)', () => {
    const owned = own('white-rum', 'lime-juice', 'simple-syrup', 'soda-water')
    expect(missingIngredients(recipe('mojito'), owned)).toEqual(['mint'])
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
    expect(missingIngredients(recipe('daiquiri'), own('rum', 'lime-juice', 'simple-syrup'))).toEqual(['white-rum'])
  })

  test('rum never covers gin', () => {
    expect(canMake(recipe('gin-and-tonic'), own('white-rum', 'tonic-water'))).toBe(false)
  })

  test('coconut rum is not in the rum family', () => {
    expect(canMake(recipe('dark-n-stormy'), own('coconut-rum', 'ginger-beer'))).toBe(false)
  })

  test('an empty cart makes nothing', () => {
    expect(recipes.filter((r) => canMake(r, own()))).toEqual([])
  })
})
