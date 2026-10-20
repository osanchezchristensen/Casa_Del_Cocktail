// The app's saved data (PRD section 8), kept in localStorage by persist.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Bottle, Favorite, Level, PastBottle, Settings } from '../types.ts'

type State = {
  bottles: Bottle[]
  pastBottles: PastBottle[]
  favorites: Favorite[]
  settings: Settings
  /** Each pick becomes a new bottle at Full. A blank name is left off. */
  addBottles: (picks: { ingredientId: string; name?: string }[]) => void
  loadSampleCart: () => void
}

const newBottle = (ingredientId: string, level: Level, name?: string): Bottle => ({
  id: crypto.randomUUID(),
  ingredientId,
  name: name?.trim() || undefined,
  level,
  addedAt: new Date().toISOString(),
})

// Temporary: remove with the "Load sample cart" button at Milestone A.
const SAMPLE: [ingredientId: string, level: Level, name?: string][] = [
  ['blanco-tequila', 'full', 'Espolòn Blanco'],
  ['blanco-tequila', 'half', 'Jose Cuervo Especial Silver'],
  ['mezcal', 'low', 'Del Maguey Vida'],
  ['bourbon', 'full', 'Bulleit'],
  ['rye-whiskey', 'half'],
  ['london-dry-gin', 'full', 'Tanqueray'],
  ['white-rum', 'low'],
  ['campari', 'half'],
  ['sweet-vermouth', 'empty', 'Carpano Antica'],
  ['angostura-bitters', 'full'],
  ['lime-juice', 'full'],
  ['tonic-water', 'half'],
]

export const useStore = create<State>()(
  persist(
    (set) => ({
      bottles: [],
      pastBottles: [],
      favorites: [],
      settings: { allowSwaps: false },
      addBottles: (picks) =>
        set((s) => ({
          bottles: [...s.bottles, ...picks.map((p) => newBottle(p.ingredientId, 'full', p.name))],
        })),
      loadSampleCart: () =>
        set({ bottles: SAMPLE.map(([ingredientId, level, name]) => newBottle(ingredientId, level, name)) }),
    }),
    // Bump version (and add a migrate function) whenever the saved shape changes.
    { name: 'casa-del-cocktail', version: 1 },
  ),
)
