import { expect, test } from 'vitest'
import { searchIngredients } from './search.ts'

const ids = (query: string) => searchIngredients(query).map((i) => i.id)

test('"camp" finds Campari first', () => {
  expect(ids('camp')[0]).toBe('campari')
})

test('search ignores accents and capitals', () => {
  expect(ids('cachaca')).toContain('cachaca')
  expect(ids('anejo')).toContain('anejo-tequila')
  expect(ids('CAMPARI')).toContain('campari')
})

test('aliases match too', () => {
  expect(ids('malibu')).toContain('coconut-rum')
})

test('names starting with the query come before names containing it', () => {
  // "Gin" starts with "gin"; "Sloe gin" only contains it.
  const result = ids('gin')
  expect(result.indexOf('gin')).toBeLessThan(result.indexOf('sloe-gin'))
})

test('always-on-hand basics are not offered', () => {
  expect(ids('ice')).not.toContain('ice')
  expect(ids('salt')).not.toContain('salt')
})

test('an empty search returns nothing, and results stop at 20', () => {
  expect(ids('   ')).toEqual([])
  expect(ids('e').length).toBeLessThanOrEqual(20)
})
