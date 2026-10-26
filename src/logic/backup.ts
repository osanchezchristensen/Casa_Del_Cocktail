// Export and import of the saved data (PRD section 8, "Export file"). No React here.
import type { Bottle, Favorite, PastBottle, Settings } from '../types.ts'

/** Keep in step with the store's persist version in src/store/useStore.ts. */
export const BACKUP_VERSION = 1

export type BackupData = { bottles: Bottle[]; pastBottles: PastBottle[]; favorites: Favorite[]; settings: Settings }
export type Backup = BackupData & { app: 'casa-del-cocktail'; version: number; exportedAt: string }

export function buildBackup(data: BackupData, now = new Date()): Backup {
  return {
    app: 'casa-del-cocktail',
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    bottles: data.bottles,
    pastBottles: data.pastBottles,
    favorites: data.favorites,
    settings: data.settings,
  }
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === 'string'
const LEVELS: unknown[] = ['full', 'half', 'low', 'empty']

const isBottle = (v: unknown): v is Obj =>
  isObj(v) &&
  isStr(v.id) &&
  isStr(v.ingredientId) &&
  (v.name === undefined || isStr(v.name)) &&
  LEVELS.includes(v.level) &&
  isStr(v.addedAt)
const isPastBottle = (v: unknown): v is Obj => isBottle(v) && isStr(v.finishedAt)
const isFavorite = (v: unknown): v is Obj => isObj(v) && isStr(v.recipeId) && isStr(v.savedAt)

// Only known fields are copied, so anything extra in the file never reaches the store.
const toBottle = (b: Obj) =>
  ({ id: b.id, ingredientId: b.ingredientId, name: b.name, level: b.level, addedAt: b.addedAt }) as Bottle

/** Checks a backup file before it touches any data. Returns null if it isn't a valid Casa backup. */
export function parseBackup(text: string): BackupData | null {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return null
  }
  if (!isObj(raw) || raw.app !== 'casa-del-cocktail') return null
  if (typeof raw.version !== 'number' || raw.version < 1 || raw.version > BACKUP_VERSION) return null

  const { bottles, pastBottles, favorites, settings } = raw
  if (!Array.isArray(bottles) || !bottles.every(isBottle)) return null
  if (!Array.isArray(pastBottles) || !pastBottles.every(isPastBottle)) return null
  if (!Array.isArray(favorites) || !favorites.every(isFavorite)) return null
  if (!isObj(settings) || typeof settings.allowSwaps !== 'boolean') return null

  return {
    bottles: bottles.map(toBottle),
    pastBottles: pastBottles.map((b) => ({ ...toBottle(b), finishedAt: b.finishedAt as string })),
    favorites: favorites.map((f) => ({ recipeId: f.recipeId as string, savedAt: f.savedAt as string })),
    settings: { allowSwaps: settings.allowSwaps },
  }
}
