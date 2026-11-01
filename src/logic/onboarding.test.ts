import { expect, test } from 'vitest'
import { groupIngredients, PICK_GROUPS } from './onboarding.ts'
import { addableIngredients } from './search.ts'

test('every common pick exists, is addable and sits in its own group', () => {
  for (const group of PICK_GROUPS) {
    for (const ingredient of groupIngredients(group)) {
      expect(ingredient, group.label).toBeDefined()
      expect(group.categories).toContain(ingredient.category)
    }
  }
})

test('every addable ingredient is in exactly one group, so "More" never misses one', () => {
  const all = PICK_GROUPS.flatMap((g) => groupIngredients(g, true).map((i) => i.id))
  expect(all.sort()).toEqual(addableIngredients.map((i) => i.id).sort())
})

test('"More" keeps the common picks first, without repeats', () => {
  const spirits = groupIngredients(PICK_GROUPS[0], true).map((i) => i.id)
  expect(spirits.slice(0, 10)).toEqual(PICK_GROUPS[0].common)
  expect(new Set(spirits).size).toBe(spirits.length)
})
