import { ChevronDown, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import HeaderBlob from '../components/HeaderBlob.tsx'
import Starburst from '../components/Starburst.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { ingredientName } from '../logic/cart.ts'
import { mainIngredients, ownedIngredientIds, unlockSuggestions, type UnlockSuggestion } from '../logic/matching.ts'
import { summarizeNames } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './Unlock.module.css'

type CardProps = { suggestion: UnlockSuggestion; best: boolean; open: boolean; onToggle: () => void; onBought: () => void }

function UnlockCard({ suggestion, best, open, onToggle, onBought }: CardProps) {
  const [showAll, setShowAll] = useState(false)
  const recipes = [...suggestion.recipes].sort((a, b) => a.name.localeCompare(b.name))
  const count = recipes.length
  const name = ingredientName(suggestion.ingredientId)
  const shown = showAll ? recipes : recipes.slice(0, 3)

  return (
    <li className={open ? styles.open : styles.card}>
      {open && (
        <div className={styles.corner}>
          <Starburst count={count} size={76} />
        </div>
      )}
      <button type="button" className={styles.head} aria-expanded={open} onClick={onToggle}>
        {!open && <Starburst count={count} size={52} />}
        <span className={styles.headText}>
          {best && open && <span className={styles.label}>BEST NEXT BOTTLE</span>}
          <span className={open ? styles.titleBig : styles.title}>Add {name}</span>
          <span className={styles.sub}>
            {open
              ? `Unlocks ${count} ${count === 1 ? 'cocktail' : 'cocktails'}, including the ${recipes[0].name}.`
              : summarizeNames(recipes.map((r) => r.name))}
          </span>
        </span>
        {!open && <ChevronDown size={20} aria-hidden />}
      </button>

      {open && (
        <>
          <ul className={styles.recipes}>
            {shown.map((r) => (
              <li key={r.id}>
                <Link to={`/make/${r.id}`} className={styles.recipe}>
                  <span>{r.name}</span>
                  <span className={styles.ingredients}>{mainIngredients(r).map(ingredientName).join(' · ')}</span>
                </Link>
              </li>
            ))}
          </ul>
          {!showAll && recipes.length > 3 && (
            <button type="button" className={styles.more} onClick={() => setShowAll(true)}>
              + {recipes.length - 3} more
            </button>
          )}
          <button type="button" className={styles.bought} onClick={onBought}>
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            I bought it
          </button>
        </>
      )}
    </li>
  )
}

function Unlock() {
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const addBottles = useStore((s) => s.addBottles)
  const [openId, setOpenId] = useState<string>()
  const [added, setAdded] = useState<{ name: string; count: number }>()

  const list = useMemo(
    () => unlockSuggestions(ownedIngredientIds(bottles), ALL_RECIPES, allowSwaps),
    [bottles, allowSwaps],
  )
  // Until you tap a card, the best suggestion is the open one.
  const open = openId ?? list[0]?.ingredientId

  return (
    <>
      <HeaderBlob variant="unlock" />
      <h1 className={styles.title1}>One more bottle</h1>
      <p className={styles.intro}>Add one of these and new cocktails open up.</p>

      {added && (
        <p className={styles.added} role="status">
          Added {added.name} to your Bar Cart. That opens {added.count} {added.count === 1 ? 'cocktail' : 'cocktails'}.{' '}
          <Link to="/make">See what you can make</Link>
        </p>
      )}

      {list.length === 0 ? (
        <p className={styles.intro}>
          Nothing is one bottle away right now. Add a few more on your <Link to="/cart">Bar Cart</Link> and check
          back.
        </p>
      ) : (
        <ul className={styles.list}>
          {list.map((s, i) => (
            <UnlockCard
              key={s.ingredientId}
              suggestion={s}
              best={i === 0}
              open={open === s.ingredientId}
              onToggle={() => setOpenId(open === s.ingredientId ? '' : s.ingredientId)}
              onBought={() => {
                addBottles([{ ingredientId: s.ingredientId }])
                setAdded({ name: ingredientName(s.ingredientId), count: s.recipes.length })
                setOpenId(undefined)
              }}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default Unlock
