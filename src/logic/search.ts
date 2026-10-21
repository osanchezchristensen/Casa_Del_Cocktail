// Ingredient search for the Add items sheet. No React here.
import type { Ingredient } from '../types.ts'
import data from '../data/ingredients.json'

// Ice, water, sugar and salt are always on hand, so there's no need to add them.
export const addableIngredients = (data as Ingredient[]).filter((i) => !i.alwaysOnHand)

/** Lowercase with accents removed, so "Añejo" and "anejo" match. */
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** Matches the query anywhere in a name or alias. Names starting with it come first. Max 20. */
export function searchIngredients(query: string): Ingredient[] {
  const q = normalize(query.trim())
  if (!q) return []
  const startsWith = (i: Ingredient) => (normalize(i.name).startsWith(q) ? 0 : 1)
  return addableIngredients
    .filter((i) => [i.name, ...i.aliases].some((text) => normalize(text).includes(q)))
    .sort((a, b) => startsWith(a) - startsWith(b) || a.name.localeCompare(b.name))
    .slice(0, 20)
}
