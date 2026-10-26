// Splits saved favorites by whether you can make them now. No React here.
import type { Favorite, Recipe } from '../types.ts'
import { matchRecipe, type MakeableRecipe } from './matching.ts'

/** Newest saved first. A favorite whose recipe no longer exists is left out. */
export function splitFavorites(
  favorites: Favorite[],
  recipes: Recipe[],
  owned: Set<string>,
  allowSwaps = false,
): { ready: MakeableRecipe[]; missing: MakeableRecipe[] } {
  const ready: MakeableRecipe[] = []
  const missing: MakeableRecipe[] = []
  for (const f of [...favorites].sort((a, b) => b.savedAt.localeCompare(a.savedAt))) {
    const recipe = recipes.find((r) => r.id === f.recipeId)
    if (!recipe) continue
    const match = matchRecipe(recipe, owned, allowSwaps)
    ;(match.status === 'missing' ? missing : ready).push({ recipe, match })
  }
  return { ready, missing }
}
