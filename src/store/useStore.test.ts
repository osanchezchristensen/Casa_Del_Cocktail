import { beforeEach, expect, test } from 'vitest'
import { buildBackup, parseBackup } from '../logic/backup.ts'
import { useStore } from './useStore.ts'

const store = () => useStore.getState()

beforeEach(() => {
  useStore.setState({ bottles: [], pastBottles: [] })
  store().addBottles([{ ingredientId: 'bourbon', name: 'Bulleit' }, { ingredientId: 'campari' }])
})

const bulleit = () => store().bottles.find((b) => b.name === 'Bulleit')!

test('Allow swaps can be switched on and off', () => {
  store().setAllowSwaps(true)
  expect(store().settings.allowSwaps).toBe(true)
  store().setAllowSwaps(false)
  expect(store().settings.allowSwaps).toBe(false)
})

test('toggling a favorite saves it once, and again removes it', () => {
  useStore.setState({ favorites: [] })
  store().toggleFavorite('daiquiri')
  expect(store().favorites).toHaveLength(1)
  expect(store().favorites[0].recipeId).toBe('daiquiri')
  expect(store().favorites[0].savedAt).toBeTruthy()
  store().toggleFavorite('daiquiri')
  expect(store().favorites).toEqual([])
})

test('restoring a backup replaces bottles, past bottles, favorites and settings', () => {
  const bottle = { id: 'r1', ingredientId: 'gin', level: 'half', addedAt: '2026-10-01T00:00:00.000Z' } as const
  store().restoreBackup({
    bottles: [bottle],
    pastBottles: [],
    favorites: [{ recipeId: 'negroni', savedAt: '2026-10-02T00:00:00.000Z' }],
    settings: { allowSwaps: true },
  })
  expect(store().bottles).toEqual([bottle])
  expect(store().pastBottles).toEqual([])
  expect(store().favorites.map((f) => f.recipeId)).toEqual(['negroni'])
  expect(store().settings.allowSwaps).toBe(true)
})

test('export, wipe, import: everything comes back (PRD v1 check)', () => {
  store().removeBottle(bulleit().id)
  store().toggleFavorite('negroni')
  store().setAllowSwaps(true)
  const { bottles, pastBottles, favorites, settings } = store()
  const before = { bottles, pastBottles, favorites, settings }
  const file = JSON.stringify(buildBackup(before))

  useStore.setState({ bottles: [], pastBottles: [], favorites: [], settings: { allowSwaps: false } })
  store().restoreBackup(parseBackup(file)!)

  const { bottles: b, pastBottles: p, favorites: f, settings: s } = store()
  expect({ bottles: b, pastBottles: p, favorites: f, settings: s }).toEqual(before)
})

test('new bottles start at Full', () => {
  expect(store().bottles.map((b) => b.level)).toEqual(['full', 'full'])
})

test('changing the level only touches that bottle', () => {
  store().updateBottle(bulleit().id, { level: 'low' })
  expect(store().bottles.map((b) => b.level)).toEqual(['low', 'full'])
  expect(bulleit().name).toBe('Bulleit')
})

test('a blank name is dropped; leaving name out keeps it', () => {
  const id = bulleit().id
  store().updateBottle(id, { level: 'half' })
  expect(store().bottles[0].name).toBe('Bulleit')
  store().updateBottle(id, { name: '   ' })
  expect(store().bottles[0].name).toBeUndefined()
})

test('removing moves the bottle to past bottles with a finishedAt date', () => {
  const { id } = bulleit()
  store().removeBottle(id)
  expect(store().bottles.map((b) => b.ingredientId)).toEqual(['campari'])
  expect(store().pastBottles).toHaveLength(1)
  expect(store().pastBottles[0]).toMatchObject({ id, name: 'Bulleit' })
  expect(store().pastBottles[0].finishedAt).toBeTruthy()
})

test('undo puts the bottle back as it was, without finishedAt', () => {
  const before = bulleit()
  store().updateBottle(before.id, { level: 'low' })
  store().removeBottle(before.id)
  store().undoRemove(before.id)
  expect(store().pastBottles).toEqual([])
  expect(bulleit()).toEqual({ ...before, level: 'low' })
})
