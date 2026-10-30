// The app's saved data (PRD section 8), kept in localStorage by persist.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BackupData } from '../logic/backup.ts'
import type { Bottle, Favorite, Level, PastBottle, Settings } from '../types.ts'

type State = {
  bottles: Bottle[]
  pastBottles: PastBottle[]
  favorites: Favorite[]
  settings: Settings
  /** Each pick becomes a new bottle at Full. A blank name is left off. */
  addBottles: (picks: { ingredientId: string; name?: string }[]) => void
  /** Change a bottle's level and/or name. A blank name removes it. */
  updateBottle: (id: string, changes: { level?: Level; name?: string }) => void
  /** Moves the bottle to pastBottles with a finishedAt date; never deletes it. */
  removeBottle: (id: string) => void
  /** Moves a removed bottle back onto the cart, as it was. */
  undoRemove: (id: string) => void
  setAllowSwaps: (on: boolean) => void
  /** Saves the recipe as a favorite, or removes it if it already is one. */
  toggleFavorite: (recipeId: string) => void
  /** Replaces everything with a checked backup (see src/logic/backup.ts). */
  restoreBackup: (data: BackupData) => void
}

const newBottle = (ingredientId: string, level: Level, name?: string): Bottle => ({
  id: crypto.randomUUID(),
  ingredientId,
  name: name?.trim() || undefined,
  level,
  addedAt: new Date().toISOString(),
})

export const useStore = create<State>()(
  persist(
    (set) => ({
      bottles: [],
      pastBottles: [],
      favorites: [],
      settings: { allowSwaps: false },
      restoreBackup: ({ bottles, pastBottles, favorites, settings }) =>
        set({ bottles, pastBottles, favorites, settings }),
      toggleFavorite: (recipeId) =>
        set((s) => ({
          favorites: s.favorites.some((f) => f.recipeId === recipeId)
            ? s.favorites.filter((f) => f.recipeId !== recipeId)
            : [...s.favorites, { recipeId, savedAt: new Date().toISOString() }],
        })),
      setAllowSwaps: (on) => set((s) => ({ settings: { ...s.settings, allowSwaps: on } })),
      addBottles: (picks) =>
        set((s) => ({
          bottles: [...s.bottles, ...picks.map((p) => newBottle(p.ingredientId, 'full', p.name))],
        })),
      updateBottle: (id, changes) =>
        set((s) => ({
          bottles: s.bottles.map((b) =>
            b.id !== id
              ? b
              : {
                  ...b,
                  level: changes.level ?? b.level,
                  name: 'name' in changes ? changes.name?.trim() || undefined : b.name,
                },
          ),
        })),
      removeBottle: (id) =>
        set((s) => {
          const bottle = s.bottles.find((b) => b.id === id)
          if (!bottle) return {}
          return {
            bottles: s.bottles.filter((b) => b.id !== id),
            pastBottles: [...s.pastBottles, { ...bottle, finishedAt: new Date().toISOString() }],
          }
        }),
      undoRemove: (id) =>
        set((s) => {
          const past = s.pastBottles.find((b) => b.id === id)
          if (!past) return {}
          const { id: bottleId, ingredientId, name, level, addedAt } = past
          return {
            pastBottles: s.pastBottles.filter((b) => b.id !== id),
            bottles: [...s.bottles, { id: bottleId, ingredientId, name, level, addedAt }],
          }
        }),
    }),
    // Bump version (and add a migrate function) whenever the saved shape changes.
    { name: 'casa-del-cocktail', version: 1 },
  ),
)
