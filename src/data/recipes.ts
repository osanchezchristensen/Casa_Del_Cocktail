// Every recipe the app knows. Book recipes sit in the git-ignored src/data/private/ folder;
// the glob finds nothing when it is empty or missing, and the app works with just the starter set.
import type { Recipe } from '../types.ts'
import starter from './recipes-starter.json'

const book = Object.values(
  import.meta.glob<Recipe[]>('./private/recipes-book-*.json', { eager: true, import: 'default' }),
).flat()

export const ALL_RECIPES: Recipe[] = [...(starter as Recipe[]), ...book]
