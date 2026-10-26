// How a recipe's amounts are written on screen. No React here.
import type { Recipe, RecipeSource, Unit } from '../types.ts'

/** Up to three names in full; longer lists show two and "and N more". */
export function summarizeNames(names: string[]): string {
  if (names.length <= 3) return names.join(', ')
  return `${names.slice(0, 2).join(', ')}, and ${names.length - 2} more`
}

const sourceKey =(s: RecipeSource) => (s.type === 'starter' ? 'starter' : `book:${s.title}`)

/**
 * The Make Now source buttons: All, Starter set, then one per book. Empty when there are
 * no book recipes, because "Starter set" would then be the same as "All".
 */
export function sourceFilters(recipes: Recipe[]): { key: string; label: string }[] {
  const books = [...new Set(recipes.flatMap((r) => (r.source.type === 'book' ? [r.source.title] : [])))]
  if (books.length === 0) return []
  return [
    { key: 'all', label: 'All' },
    { key: 'starter', label: 'Starter set' },
    ...books.map((title) => ({ key: `book:${title}`, label: title })),
  ]
}

export const matchesSource = (recipe: Recipe, key: string) => key === 'all' || sourceKey(recipe.source) === key

export const sourceLabel = (s: RecipeSource) =>
  s.type === 'starter' ? 'Casa starter set' : `From ${s.title}, p. ${s.page}`

// "Dark rum" reads better mid-sentence as "dark rum".
export const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

const FRACTIONS: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' }

function numberText(n: number): string {
  const whole = Math.floor(n)
  const fraction = FRACTIONS[n - whole]
  if (n === whole) return String(whole)
  if (!fraction) return String(n)
  return (whole ? String(whole) : '') + fraction
}

/** 0.75 oz → "¾ oz", 2 dash → "2 dashes", 1 piece → "1", top → "Top". */
export function formatAmount(amount: number, unit: Unit): string {
  if (unit === 'top') return 'Top'
  const n = numberText(amount)
  if (unit === 'piece') return n
  const plural = amount > 1
  const word = unit === 'dash' ? (plural ? 'dashes' : 'dash') : unit === 'barspoon' && plural ? 'barspoons' : unit
  return `${n} ${word}`
}
