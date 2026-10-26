import { beforeEach, expect, test } from 'vitest'
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
