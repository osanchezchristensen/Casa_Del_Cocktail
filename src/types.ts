// Data shapes from docs/prd.md section 8.

// Written as a list (not only a type) so screens and tests can loop over it.
export const INGREDIENT_CATEGORIES = [
  'spirit',
  'liqueur',
  'fortified-wine',
  'wine-beer',
  'bitters',
  'syrup',
  'juice',
  'mixer',
  'garnish',
  'other',
] as const

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number]

export type Ingredient = {
  id: string
  name: string
  category: IngredientCategory
  /** Family tree. null at the top of a family (rum, gin, whiskey). */
  parentId: string | null
  aliases: string[]
  alcoholic: boolean
  /** true only for ice, water, sugar and salt. Ignored when matching. */
  alwaysOnHand: boolean
  /** true = never swaps in or out, even with "Allow swaps" on (rule 8). */
  noSwap?: boolean
}

export type Unit = 'oz' | 'ml' | 'dash' | 'barspoon' | 'tsp' | 'piece' | 'top'

export type RecipeIngredient = {
  ingredientId: string
  amount: number
  unit: Unit
  // The three flags below can be left out; missing means false.
  optional?: boolean
  garnish?: boolean
  /** Matching rule 4: any member of this ingredient's family is fine. */
  anyOfFamily?: boolean
}

export type Glass =
  | 'coupe'
  | 'rocks'
  | 'highball'
  | 'martini'
  | 'collins'
  | 'flute'
  | 'mug'
  | 'other'

export type Method = 'shaken' | 'stirred' | 'built' | 'blended'

export type RecipeSource =
  | { type: 'starter' }
  | { type: 'book'; title: string; author: string; page: number }

export type Recipe = {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  steps: string[]
  glass: Glass
  method: Method
  tags: string[]
  source: RecipeSource
}

export type Level = 'full' | 'half' | 'low' | 'empty'

/** One bottle on the cart. Several bottles can share an ingredientId. */
export type Bottle = {
  id: string
  ingredientId: string
  /** Optional bottle name or brand, for example "Jose Cuervo Especial Silver". */
  name?: string
  level: Level
  /** ISO date string, for example "2026-10-13T18:30:00.000Z". */
  addedAt: string
}

/** A removed bottle, kept for a future history feature. */
export type PastBottle = Bottle & {
  /** ISO date string. */
  finishedAt: string
}

export type Favorite = {
  recipeId: string
  /** ISO date string. */
  savedAt: string
}

export type Settings = {
  allowSwaps: boolean
}
