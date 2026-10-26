import { useMemo, useState } from 'react'
import CocktailCard from '../components/CocktailCard.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { makeableRecipes, ownedIngredientIds } from '../logic/matching.ts'
import { matchesSource, sourceFilters } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './MakeNow.module.css'

const FILTERS = sourceFilters(ALL_RECIPES)

function MakeNow() {
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const setAllowSwaps = useStore((s) => s.setAllowSwaps)
  const [source, setSource] = useState('all')

  const list = useMemo(
    () =>
      makeableRecipes(ALL_RECIPES, ownedIngredientIds(bottles), allowSwaps).filter((m) =>
        matchesSource(m.recipe, source),
      ),
    [bottles, allowSwaps, source],
  )

  return (
    <>
      <h1 className={styles.title}>
        {list.length === 0
          ? 'Nothing quite yet.'
          : `You can make ${list.length} ${list.length === 1 ? 'cocktail' : 'cocktails'} tonight.`}
      </h1>

      <div className={styles.swaps}>
        <div className={styles.swapsText}>
          <span className={styles.swapsLabel}>Allow swaps</span>
          <span className={styles.swapsHint}>Lets a close cousin stand in, like aged rum for white rum.</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={allowSwaps}
          aria-label="Allow swaps"
          className={styles.switch}
          onClick={() => setAllowSwaps(!allowSwaps)}
        >
          <span className={styles.knob} aria-hidden />
        </button>
        <span className={styles.switchWord} aria-hidden>
          {allowSwaps ? 'On' : 'Off'}
        </span>
      </div>

      {FILTERS.length > 0 && (
        <div className={styles.filters} role="group" aria-label="Recipe source">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={styles.filter}
              aria-pressed={source === f.key}
              onClick={() => setSource(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 && (
        <p className={styles.empty}>
          {source === 'all'
            ? 'But you might be close. Add a bottle or two on the Bar Cart, or see what one more would open up on Unlock.'
            : 'Nothing from this source right now. Try another one, or switch on Allow swaps.'}
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
