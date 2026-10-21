// How the Bar Cart groups bottles (PRD section 6). No React here.
import { INGREDIENT_CATEGORIES, type Bottle, type Ingredient, type IngredientCategory, type Level } from '../types.ts'
import data from '../data/ingredients.json'
import { normalize } from './search.ts'

const ingredientsById = new Map((data as Ingredient[]).map((i) => [i.id, i]))

// An unknown ingredient id counts as Other, so a bottle never disappears.
const categoryOf = (b: Bottle) => ingredientsById.get(b.ingredientId)?.category ?? 'other'

/** The filter buttons on the Bar Cart. Running low sits next to All so it's easy to find. */
export const CART_FILTERS = ['all', 'low', 'spirit', 'liqueur', 'bitters', 'mixer'] as const
export type CartFilter = (typeof CART_FILTERS)[number]
export const FILTER_LABELS: Record<CartFilter, string> = {
  all: 'All',
  spirit: 'Spirits',
  liqueur: 'Liqueurs',
  low: 'Running low',
  bitters: 'Bitters',
  mixer: 'Mixers',
}

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

export const LEVEL_LABELS: Record<Level, string> = { full: 'Full', half: 'Half', low: 'Low', empty: 'Empty' }

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
    const inSection = sorted.filter((b) => categoryOf(b) === category)
    return { category, bottles: inSection, families: category === 'spirit' ? groupByFamily(inSection) : [] }
  }).filter((s) => s.bottles.length > 0)
}

/**
 * Bar Cart search and filter. The query matches the bottle name, its type or its family
 * ("whiskey" finds bourbon), ignoring accents. "Running low" keeps only Low bottles.
 */
export function filterBottles(bottles: Bottle[], query: string, filter: CartFilter): Bottle[] {
  const q = normalize(query.trim())
  return bottles.filter((b) => {
    if (filter === 'low' ? b.level !== 'low' : filter !== 'all' && categoryOf(b) !== filter) return false
    if (!q) return true
    const texts = [b.name ?? '', ingredientName(b.ingredientId), ingredientName(familyTop(b.ingredientId))]
    return texts.some((text) => normalize(text).includes(q))
  })
}
