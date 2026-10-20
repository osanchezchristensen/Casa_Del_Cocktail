// How the Bar Cart groups bottles (PRD section 6). No React here.
import { INGREDIENT_CATEGORIES, type Bottle, type Ingredient, type IngredientCategory } from '../types.ts'
import data from '../data/ingredients.json'

const ingredientsById = new Map((data as Ingredient[]).map((i) => [i.id, i]))

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  spirit: 'Spirits',
  liqueur: 'Liqueurs',
  'fortified-wine': 'Vermouth & fortified wine',
  'wine-beer': 'Wine & beer',
  bitters: 'Bitters',
  syrup: 'Syrups',
  juice: 'Juices',
  mixer: 'Mixers',
  garnish: 'Garnishes',
  other: 'Other',
}

export type FamilyGroup = { familyId: string; name: string; bottles: Bottle[] }

/** families is filled only for Spirits; other sections list their bottles directly. */
export type CartSection = { category: IngredientCategory; bottles: Bottle[]; families: FamilyGroup[] }

export const ingredientName = (id: string) => ingredientsById.get(id)?.name ?? id

/** The top of an ingredient's family: blanco-tequila → tequila. */
function familyTop(id: string): string {
  let current = id
  while (ingredientsById.get(current)?.parentId) current = ingredientsById.get(current)!.parentId!
  return current
}

function groupByFamily(bottles: Bottle[]): FamilyGroup[] {
  const groups = new Map<string, Bottle[]>()
  for (const b of bottles) {
    const top = familyTop(b.ingredientId)
    groups.set(top, [...(groups.get(top) ?? []), b])
  }
  return [...groups]
    .map(([familyId, bottles]) => ({ familyId, name: ingredientName(familyId), bottles }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** Sections in category order, empty ones left out. Bottles sorted by type, then name. */
export function groupCart(bottles: Bottle[]): CartSection[] {
  const sorted = [...bottles].sort(
    (a, b) =>
      ingredientName(a.ingredientId).localeCompare(ingredientName(b.ingredientId)) ||
      (a.name ?? '').localeCompare(b.name ?? ''),
  )
  return INGREDIENT_CATEGORIES.map((category) => {
    // An unknown ingredient id lands in Other, so a bottle never disappears.
    const inSection = sorted.filter((b) => (ingredientsById.get(b.ingredientId)?.category ?? 'other') === category)
    return { category, bottles: inSection, families: category === 'spirit' ? groupByFamily(inSection) : [] }
  }).filter((s) => s.bottles.length > 0)
}
