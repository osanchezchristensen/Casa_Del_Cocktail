import type { Level } from '../types.ts'

/** A small demo cart with every level, for visitors who want to see results without adding bottles. */
export const SAMPLE_CART: { ingredientId: string; level: Level; name?: string }[] = [
  { ingredientId: 'blanco-tequila', level: 'full', name: 'Espolòn Blanco' },
  { ingredientId: 'mezcal', level: 'low', name: 'Del Maguey Vida' },
  { ingredientId: 'bourbon', level: 'full', name: 'Bulleit' },
  { ingredientId: 'rye-whiskey', level: 'half' },
  { ingredientId: 'london-dry-gin', level: 'full', name: 'Tanqueray' },
  { ingredientId: 'white-rum', level: 'low' },
  { ingredientId: 'campari', level: 'half' },
  { ingredientId: 'sweet-vermouth', level: 'empty', name: 'Carpano Antica' },
  { ingredientId: 'angostura-bitters', level: 'full' },
  { ingredientId: 'lime-juice', level: 'full' },
  { ingredientId: 'tonic-water', level: 'half' },
  { ingredientId: 'triple-sec', level: 'full', name: 'Cointreau' },
  { ingredientId: 'lemon-juice', level: 'full' },
  { ingredientId: 'simple-syrup', level: 'half' },
  { ingredientId: 'honey-syrup', level: 'full' },
  { ingredientId: 'soda-water', level: 'full' },
  { ingredientId: 'mint', level: 'full' },
]
