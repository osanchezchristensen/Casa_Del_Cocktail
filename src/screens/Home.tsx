import { ArrowRight, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import GlassIcon from '../components/GlassIcon.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { ingredientName } from '../logic/cart.ts'
import { splitFavorites } from '../logic/favorites.ts'
import { pickTonight } from '../logic/home.ts'
import { makeableRecipes, ownedIngredientIds } from '../logic/matching.ts'
import { summarizeNames } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './Home.module.css'

function Home() {
  const bottles = useStore((s) => s.bottles)
  const favorites = useStore((s) => s.favorites)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  // Picked once per visit, so the pick doesn't change while the page updates.
  const [seed] = useState(Math.random)

  const owned = useMemo(() => ownedIngredientIds(bottles), [bottles])
  const makeable = useMemo(() => makeableRecipes(ALL_RECIPES, owned, allowSwaps), [owned, allowSwaps])
  const readyFavorites = useMemo(
    () => splitFavorites(favorites, ALL_RECIPES, owned, allowSwaps).ready.length,
    [favorites, owned, allowSwaps],
  )
  const low = bottles.filter((b) => b.level === 'low')
  const pick = pickTonight(makeable, seed)?.recipe

  return (
    <div className={styles.screen}>
      <div className={styles.blobClip} aria-hidden>
        <div className={styles.blob} />
      </div>

      <div className={styles.top}>
        <span className={styles.brand}>Casa Del Cocktail</span>
        <Link to="/settings" className={styles.gear} aria-label="Settings">
          <Settings size={20} aria-hidden />
        </Link>
      </div>

      {bottles.length === 0 ? (
        <>
          <h1 className={styles.greeting}>Welcome to Casa.</h1>
          <p className={styles.firstOpen}>
            Let's see what's on your bar cart. <Link to="/cart">Add your first bottles</Link>
          </p>
        </>
      ) : (
        <h1 className={styles.greeting}>
          Welcome back
          <br />
          to Casa.
        </h1>
      )}

      <Link to="/make" className={styles.count}>
        <span className={styles.countText}>
          <span className={styles.countSmall}>You can make</span>
          <span className={styles.countBig}>{makeable.length}</span>
          <span className={styles.countSmall}>{makeable.length === 1 ? 'cocktail' : 'cocktails'} tonight</span>
        </span>
        <span className={styles.arrow}>
          <ArrowRight size={22} aria-hidden />
        </span>
      </Link>

      <div className={styles.grid}>
        <Link to="/cart" className={styles.small}>
          <span className={`${styles.number} ${styles.rust}`}>{low.length}</span>
          <span className={styles.smallText}>{low.length === 1 ? 'bottle' : 'bottles'} running low</span>
          <span className={styles.detail}>
            {low.length === 0 ? 'All stocked up' : summarizeNames(low.map((b) => b.name ?? ingredientName(b.ingredientId)))}
          </span>
        </Link>
        <Link to="/favorites" className={styles.small}>
          <span className={`${styles.number} ${styles.avocado}`}>{readyFavorites}</span>
          <span className={styles.smallText}>{readyFavorites === 1 ? 'favorite' : 'favorites'} ready to make</span>
          <span className={styles.detail}>{favorites.length === 0 ? 'Save one with the heart' : 'See your list'}</span>
        </Link>
      </div>

      {pick && (
        <div className={styles.pick}>
          <span className={styles.pickBlob}>
            <GlassIcon glass={pick.glass} size={30} />
          </span>
          <div className={styles.pickText}>
            <span className={styles.pickLabel}>TONIGHT'S PICK</span>
            <span className={styles.pickName}>{pick.name}</span>
            <Link to={`/make/${pick.id}`}>See the recipe</Link>
          </div>
        </div>
      )}

      <p className={styles.note}>Made for enjoying, not overdoing. Please drink responsibly.</p>
    </div>
  )
}

export default Home
