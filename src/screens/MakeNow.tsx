import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import AllowSwapsCard from '../components/AllowSwapsCard.tsx'
import CocktailCard from '../components/CocktailCard.tsx'
import HeaderBlob from '../components/HeaderBlob.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { makeableRecipes, ownedIngredientIds } from '../logic/matching.ts'
import { isNonAlcoholic, matchesSource, sourceFilters } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './MakeNow.module.css'

const FILTERS = sourceFilters(ALL_RECIPES)

function MakeNow() {
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const [source, setSource] = useState('all')
  const [noAlcohol, setNoAlcohol] = useState(false)

  const list = useMemo(
    () =>
      makeableRecipes(ALL_RECIPES, ownedIngredientIds(bottles), allowSwaps).filter((m) =>
        matchesSource(m.recipe, source) && (!noAlcohol || isNonAlcoholic(m.recipe)),
      ),
    [bottles, allowSwaps, source, noAlcohol],
  )

  return (
    <>
      <HeaderBlob variant="make" />
      <h1 className={styles.title}>
        {list.length === 0
          ? 'Nothing quite yet.'
          : `You can make ${list.length} ${noAlcohol ? 'drink' : 'cocktail'}${list.length === 1 ? '' : 's'} tonight.`}
      </h1>

      <AllowSwapsCard />

      <div className={styles.filters} role="group" aria-label="Filter recipes">
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
        {/* An on/off switch that works on top of the source buttons, so it gets its own look. */}
        <button
          type="button"
          className={`${styles.filter} ${styles.noAlcohol}`}
          aria-pressed={noAlcohol}
          onClick={() => setNoAlcohol(!noAlcohol)}
        >
          {noAlcohol && <Check size={16} aria-hidden />}
          Non-alcoholic
        </button>
      </div>

      {list.length === 0 && (
        <p className={styles.empty}>
          {noAlcohol ? (
            <>
              No mocktails you can make right now. A few juices, syrups or sodas on your{' '}
              <Link to="/cart">Bar Cart</Link> go a long way.
            </>
          ) : source === 'all' ? (
            <>
              But you're close. See what one more bottle would open up on <Link to="/unlock">Unlock</Link>, or add a
              few on your <Link to="/cart">Bar Cart</Link>.
            </>
          ) : (
            `Nothing from this source right now. Try another one${allowSwaps ? '' : ', or switch on Allow swaps'}.`
          )}
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
