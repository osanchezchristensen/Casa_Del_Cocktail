// How a recipe's amounts are written on screen. No React here.
import type { RecipeSource, Unit } from '../types.ts'

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
