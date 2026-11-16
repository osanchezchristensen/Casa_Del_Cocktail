// "Can I make it?" logic: PRD section 7, rules 1 to 8. No React here.
import type { Ingredient, Level, Recipe } from '../types.ts'
import data from '../data/ingredients.json'

const ingredientsById = new Map((data as Ingredient[]).map((i) => [i.id, i]))

export type Swap = { needed: string; used: string }

export type MatchResult = {
  status: 'perfect' | 'swap' | 'missing'
  swaps: Swap[]
  missing: string[]
}

/** Rule 6: an ingredient is owned if any of its bottles is not Empty. */
export function ownedIngredientIds(
  bottles: { ingredientId: string; level: Level }[],
): Set<string> {
  return new Set(bottles.filter((b) => b.level !== 'empty').map((b) => b.ingredientId))
}

/** True if id is ancestorId or sits anywhere below it in the family tree. */
function isUnder(id: string, ancestorId: string): boolean {
  for (let c: string | null | undefined = id; c; c = ingredientsById.get(c)?.parentId) {
    if (c === ancestorId) return true
  }
  return false
}

const isNoSwap = (id: string) => ingredientsById.get(id)?.noSwap === true

export function matchRecipe(recipe: Recipe, owned: Set<string>, allowSwaps = false): MatchResult {
  const ownedIds = [...owned]
  const swaps: Swap[] = []
  const missing: string[] = []

  for (const ri of recipe.ingredients) {
    const needed = ri.ingredientId
    // Rule 5: garnishes, optional ingredients and basics never count.
    if (ri.garnish || ri.optional || ingredientsById.get(needed)?.alwaysOnHand) continue

    // Rules 1 and 2: you own it, or something more specific below it.
    if (ownedIds.some((o) => isUnder(o, needed))) continue

    // Rules 3, 4 and 7: widen to the parent's family. A family's top has no parent,
    // so it never widens, and swaps can't cross families.
    const parent = ingredientsById.get(needed)?.parentId
    if (!parent) {
      missing.push(needed)
      continue
    }

    // Rule 4: the recipe says any of this family is fine. Counts as perfect, ignores noSwap.
    if (ri.anyOfFamily && ownedIds.some((o) => isUnder(o, parent))) continue

    // Rules 3 and 8: a sibling fills in, unless either side is noSwap.
    const used =
      allowSwaps && !isNoSwap(needed)
        ? ownedIds.find((o) => isUnder(o, parent) && !isNoSwap(o))
        : undefined
    if (used) swaps.push({ needed, used })
    else missing.push(needed)
  }

  const status = missing.length > 0 ? 'missing' : swaps.length > 0 ? 'swap' : 'perfect'
  return { status, swaps, missing }
}

export function canMake(recipe: Recipe, owned: Set<string>, allowSwaps = false): boolean {
  return matchRecipe(recipe, owned, allowSwaps).status !== 'missing'
}

export type RowStatus = 'have' | 'swap' | 'missing'

/**
 * One status per recipe ingredient, in order, for the recipe page. Garnishes and optional
 * rows never block a recipe, but still show whether you own them; basics count as had.
 */
export function ingredientStatuses(recipe: Recipe, owned: Set<string>, allowSwaps = false): RowStatus[] {
  const { swaps, missing } = matchRecipe(recipe, owned, allowSwaps)
  return recipe.ingredients.map((ri) => {
    const id = ri.ingredientId
    if (ri.garnish || ri.optional) return [...owned].some((o) => isUnder(o, id)) ? 'have' : 'missing'
    if (ingredientsById.get(id)?.alwaysOnHand) return 'have'
    if (missing.includes(id)) return 'missing'
    return swaps.some((s) => s.needed === id) ? 'swap' : 'have'
  })
}

export type MakeableRecipe = { recipe: Recipe; match: MatchResult }

/** Recipes you can make now: Ready ones first, then swaps, each group A to Z. */
export function makeableRecipes(recipes: Recipe[], owned: Set<string>, allowSwaps = false): MakeableRecipe[] {
  return recipes
    .map((recipe) => ({ recipe, match: matchRecipe(recipe, owned, allowSwaps) }))
    .filter((m) => m.match.status !== 'missing')
    .sort(
      (a, b) =>
        Number(a.match.status === 'swap') - Number(b.match.status === 'swap') ||
        a.recipe.name.localeCompare(b.recipe.name),
    )
}

/** The first three ingredient ids worth showing on a card (rule 5's ingredients left out). */
export function mainIngredients(recipe: Recipe): string[] {
  return recipe.ingredients
    .filter((ri) => !ri.garnish && !ri.optional && !ingredientsById.get(ri.ingredientId)?.alwaysOnHand)
    .slice(0, 3)
    .map((ri) => ri.ingredientId)
}

export type UnlockSuggestion = { ingredientId: string; recipes: Recipe[] }

// The ingredient's line up to its family's top: "london-dry-gin" gives ["london-dry-gin", "gin"].
function lineage(id: string): string[] {
  const line = [id]
  for (let c = ingredientsById.get(id)?.parentId; c; c = ingredientsById.get(c)?.parentId) line.push(c)
  return line
}

/**
 * Unlock (PRD section 7, "Unlock calculation"): try every ingredient you don't own and count
 * the recipes it would make makeable. Most first. On a tie: fewer swaps, then by family, and within
 * a family the more general ingredient, then id. A suggestion is hidden when one kept above it
 * already unlocks all its recipes. Top 10.
 */
export function unlockSuggestions(
  owned: Set<string>,
  recipes: Recipe[],
  allowSwaps = false,
): UnlockSuggestion[] {
  const notYet = recipes.filter((r) => !canMake(r, owned, allowSwaps))
  const ranked = [...ingredientsById.values()]
    .filter((i) => !owned.has(i.id) && !i.alwaysOnHand)
    .map((i) => {
      const withIt = new Set(owned).add(i.id)
      const unlocked = notYet.map((r) => ({ r, match: matchRecipe(r, withIt, allowSwaps) })).filter((u) => u.match.status !== 'missing')
      const line = lineage(i.id)
      return {
        ingredientId: i.id,
        recipes: unlocked.map((u) => u.r),
        // Buying what the recipe names beats buying a stand-in: Nonino over "any amaro".
        // Only swaps where this bottle is the stand-in; swaps the recipe needs anyway don't count.
        swaps: unlocked.reduce((n, u) => n + u.match.swaps.filter((s) => s.used === i.id).length, 0),
        family: line[line.length - 1],
        depth: line.length - 1,
      }
    })
    .filter((s) => s.recipes.length > 0)
    .sort(
      (a, b) =>
        b.recipes.length - a.recipes.length ||
        a.swaps - b.swaps ||
        a.family.localeCompare(b.family) ||
        a.depth - b.depth ||
        a.ingredientId.localeCompare(b.ingredientId),
    )

  const kept: UnlockSuggestion[] = []
  for (const s of ranked) {
    if (kept.length === 10) break
    if (!kept.some((k) => s.recipes.every((r) => k.recipes.includes(r)))) {
      kept.push({ ingredientId: s.ingredientId, recipes: s.recipes })
    }
  }
  return kept
}
