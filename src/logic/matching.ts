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

/**
 * Unlock (PRD section 7): ingredients ranked by how many recipes they're the only
 * missing required ingredient for. Top 10, ties sorted by id.
 * shortcut: credits the id the recipe names, so "gin" and "london-dry-gin" count apart;
 * see the PRD "Maybe" list for the smarter version.
 */
export function unlockSuggestions(
  owned: Set<string>,
  recipes: Recipe[],
  allowSwaps = false,
): UnlockSuggestion[] {
  const unlocks = new Map<string, Recipe[]>()
  for (const recipe of recipes) {
    const { missing } = matchRecipe(recipe, owned, allowSwaps)
    if (missing.length !== 1) continue
    unlocks.set(missing[0], [...(unlocks.get(missing[0]) ?? []), recipe])
  }
  return [...unlocks]
    .map(([ingredientId, recipes]) => ({ ingredientId, recipes }))
    .sort((a, b) => b.recipes.length - a.recipes.length || a.ingredientId.localeCompare(b.ingredientId))
    .slice(0, 10)
}
