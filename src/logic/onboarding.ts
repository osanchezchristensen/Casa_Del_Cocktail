// The tap-to-pick groups on onboarding screen 5 (PRD section 13). No React here.
import type { Ingredient, IngredientCategory } from '../types.ts'
import { addableIngredients } from './search.ts'

export type PickGroup = {
  label: string
  categories: IngredientCategory[]
  /** About 10 common picks, shown first. Specific types (London dry gin, not Gin) match the most recipes (rule 1). */
  common: string[]
}

// A few merged sections, as in the mockup, are quicker to scan than one per category.
export const PICK_GROUPS: PickGroup[] = [
  {
    label: 'Spirits',
    categories: ['spirit'],
    common: [
      'bourbon',
      'rye-whiskey',
      'scotch',
      'london-dry-gin',
      'vodka',
      'blanco-tequila',
      'mezcal',
      'white-rum',
      'aged-rum',
      'cognac',
    ],
  },
  {
    label: 'Liqueurs & vermouth',
    categories: ['liqueur', 'fortified-wine'],
    common: [
      'triple-sec',
      'campari',
      'sweet-vermouth',
      'dry-vermouth',
      'maraschino-liqueur',
      'aperol',
      'coffee-liqueur',
      'amaretto',
      'green-chartreuse',
      'elderflower-liqueur',
    ],
  },
  {
    label: 'Bitters',
    categories: ['bitters'],
    common: ['angostura-bitters', 'orange-bitters', 'peychauds-bitters'],
  },
  {
    label: 'Juices, syrups & mixers',
    categories: ['juice', 'syrup', 'mixer'],
    common: [
      'lime-juice',
      'lemon-juice',
      'simple-syrup',
      'orange-juice',
      'grenadine',
      'honey-syrup',
      'soda-water',
      'tonic-water',
      'ginger-beer',
      'cola',
    ],
  },
  {
    label: 'Wine, beer & more',
    categories: ['wine-beer', 'garnish', 'other'],
    common: [
      'prosecco',
      'champagne',
      'beer',
      'mint',
      'egg-white',
      'heavy-cream',
      'cocktail-cherry',
      'olive',
      'orange-peel',
      'lime-wedge',
    ],
  },
]

const byId = new Map(addableIngredients.map((i) => [i.id, i]))

/** The group's common ingredients in order, then (with showAll) the rest of its categories. */
export function groupIngredients(group: PickGroup, showAll = false): Ingredient[] {
  const common = group.common.map((id) => byId.get(id)!)
  if (!showAll) return common
  const rest = addableIngredients.filter((i) => group.categories.includes(i.category) && !group.common.includes(i.id))
  return [...common, ...rest]
}
