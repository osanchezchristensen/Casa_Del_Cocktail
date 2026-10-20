// "Can I make it?" logic: PRD section 7, rules 1, 2, 5 and 6. No React here.
import type { Ingredient, Level, Recipe } from '../types.ts'
import data from '../data/ingredients.json'

const ingredientsById = new Map((data as Ingredient[]).map((i) => [i.id, i]))

/** Rule 6: an ingredient is owned if any of its bottles is not Empty. */
export function ownedIngredientIds(
  bottles: { ingredientId: string; level: Level }[],
): Set<string> {
  return new Set(bottles.filter((b) => b.level !== 'empty').map((b) => b.ingredientId))
}

/** Every owned id plus all its ancestors: owning bourbon also covers "whiskey" (rule 1). */
function coveredIds(owned: Set<string>): Set<string> {
  const covered = new Set<string>()
  for (const id of owned) {
    let current: string | null | undefined = id
    while (current && !covered.has(current)) {
      covered.add(current)
      current = ingredientsById.get(current)?.parentId
    }
  }
  return covered
}

/** Required ingredient ids the recipe needs that you don't have. */
export function missingIngredients(recipe: Recipe, owned: Set<string>): string[] {
  const covered = coveredIds(owned)
  return recipe.ingredients
    .filter((ri) => !ri.garnish && !ri.optional) // rule 5
    .filter((ri) => !ingredientsById.get(ri.ingredientId)?.alwaysOnHand) // rule 5
    .filter((ri) => !covered.has(ri.ingredientId)) // rules 1 and 2
    .map((ri) => ri.ingredientId)
}

export function canMake(recipe: Recipe, owned: Set<string>): boolean {
  return missingIngredients(recipe, owned).length === 0
}
