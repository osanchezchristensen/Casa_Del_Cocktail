// The app's saved data (PRD section 8), kept in localStorage by persist.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Bottle, Favorite, Level, PastBottle, Settings } from '../types.ts'

type State = {
  bottles: Bottle[]
  pastBottles: PastBottle[]
  favorites: Favorite[]
  settings: Settings
  loadSampleCart: () => void
}

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
      loadSampleCart: () =>
        set({
          bottles: SAMPLE.map(([ingredientId, level, name]) => ({
            id: crypto.randomUUID(),
            ingredientId,
            name,
            level,
            addedAt: new Date().toISOString(),
          })),
        }),
    }),
    // Bump version (and add a migrate function) whenever the saved shape changes.
    { name: 'casa-del-cocktail', version: 1 },
  ),
)
