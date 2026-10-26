import { useMemo } from 'react'
import CocktailCard from '../components/CocktailCard.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { makeableRecipes, ownedIngredientIds } from '../logic/matching.ts'
import { useStore } from '../store/useStore.ts'
import styles from './MakeNow.module.css'

function MakeNow() {
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const list = useMemo(
    () => makeableRecipes(ALL_RECIPES, ownedIngredientIds(bottles), allowSwaps),
    [bottles, allowSwaps],
  )

  return (
    <>
      <h1 className={styles.title}>
        {list.length === 0
          ? 'Nothing quite yet.'
          : `You can make ${list.length} ${list.length === 1 ? 'cocktail' : 'cocktails'} tonight.`}
      </h1>
      {list.length === 0 && (
        <p>
          But you might be close. Add a bottle or two on the Bar Cart, or see what one more would open up on Unlock.
        </p>
      )}
      <ul className={styles.list}>
        {list.map((m) => (
          <CocktailCard key={m.recipe.id} {...m} />
        ))}
      </ul>
    </>
  )
}

export default MakeNow
