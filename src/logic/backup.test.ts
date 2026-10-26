import { describe, expect, test } from 'vitest'
import { buildBackup, parseBackup, type BackupData } from './backup.ts'

const data: BackupData = {
  bottles: [
    { id: 'b1', ingredientId: 'bourbon', name: 'Bulleit', level: 'half', addedAt: '2026-10-20T00:00:00.000Z' },
    { id: 'b2', ingredientId: 'campari', level: 'low', addedAt: '2026-10-21T00:00:00.000Z' },
  ],
  pastBottles: [
    {
      id: 'b0',
      ingredientId: 'white-rum',
      level: 'empty',
      addedAt: '2026-10-01T00:00:00.000Z',
      finishedAt: '2026-10-19T00:00:00.000Z',
    },
  ],
  favorites: [{ recipeId: 'negroni', savedAt: '2026-10-22T00:00:00.000Z' }],
  settings: { allowSwaps: true },
}

const fileFor = (changes: object) => JSON.stringify({ ...buildBackup(data), ...changes })

test('export then import gives back exactly what went in', () => {
  const text = JSON.stringify(buildBackup(data, new Date('2026-10-25T12:00:00Z')))
  expect(parseBackup(text)).toEqual(data)
})

test('the export has the app name, version and date', () => {
  const backup = buildBackup(data, new Date('2026-10-25T12:00:00Z'))
  expect(backup).toMatchObject({ app: 'casa-del-cocktail', version: 1, exportedAt: '2026-10-25T12:00:00.000Z' })
})

test('extra fields in the file are dropped', () => {
  const bottles = [{ ...data.bottles[0], sneaky: 'x' }]
  expect(parseBackup(fileFor({ bottles }))?.bottles[0]).not.toHaveProperty('sneaky')
})

describe('invalid files are rejected', () => {
  test.each([
    ['broken JSON', '{ not json'],
    ['another app', fileFor({ app: 'other-app' })],
    ['a newer version', fileFor({ version: 2 })],
    ['no version', fileFor({ version: undefined })],
    ['bottles missing', fileFor({ bottles: undefined })],
    ['a bad level', fileFor({ bottles: [{ ...data.bottles[0], level: 'half-ish' }] })],
    ['a bottle without an id', fileFor({ bottles: [{ ...data.bottles[0], id: undefined }] })],
    ['a past bottle without finishedAt', fileFor({ pastBottles: [data.bottles[0]] })],
    ['a bad favorite', fileFor({ favorites: [{ recipeId: 3 }] })],
    ['settings missing', fileFor({ settings: undefined })],
    ['a plain list', '[]'],
  ])('%s', (_, text) => {
    expect(parseBackup(text)).toBeNull()
  })
})
