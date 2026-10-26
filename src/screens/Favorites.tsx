import { Check, X } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import FavoriteButton from '../components/FavoriteButton.tsx'
import GlassIcon from '../components/GlassIcon.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { ingredientName } from '../logic/cart.ts'
import { splitFavorites } from '../logic/favorites.ts'
import { ownedIngredientIds, type MakeableRecipe } from '../logic/matching.ts'
import { sourceLabel } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './Favorites.module.css'

function Row({ recipe, match }: MakeableRecipe) {
  const ready = match.status !== 'missing'
  return (
    <li className={ready ? styles.row : `${styles.row} ${styles.muted}`}>
      <Link to={`/make/${recipe.id}`} className={styles.link}>
        <span className={styles.glass}>
          <GlassIcon glass={recipe.glass} size={24} />
        </span>
        <span className={styles.text}>
          <span className={styles.name}>{recipe.name}</span>
          {ready ? (
            <span className={styles.sub}>{sourceLabel(recipe.source)}</span>
          ) : (
            <span className={`${styles.sub} ${styles.needs}`}>
              <X size={13} strokeWidth={2.8} aria-hidden />
              Needs {match.missing.map((id) => ingredientName(id).toLowerCase()).join(', ')}
            </span>
          )}
        </span>
      </Link>
      <FavoriteButton recipeId={recipe.id} className={styles.heart} />
    </li>
  )
}

function Favorites() {
  const favorites = useStore((s) => s.favorites)
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const { ready, missing } = useMemo(
    () => splitFavorites(favorites, ALL_RECIPES, ownedIngredientIds(bottles), allowSwaps),
    [favorites, bottles, allowSwaps],
  )
  const total = ready.length + missing.length

  return (
    <>
      <h1 className={styles.title}>Favorites</h1>
      {total === 0 ? (
        <p className={styles.empty}>No favorites yet. Tap the heart on any recipe to save it here.</p>
      ) : (
        <p className={styles.count}>
          {total} saved {total === 1 ? 'cocktail' : 'cocktails'}
        </p>
      )}

      {ready.length > 0 && (
        <>
          <h2 className={`${styles.section} ${styles.readyHead}`}>
            <Check size={16} strokeWidth={2.6} aria-hidden />
            Ready to make · {ready.length}
          </h2>
          <ul className={styles.list}>
            {ready.map((m) => (
              <Row key={m.recipe.id} {...m} />
            ))}
          </ul>
        </>
      )}

      {missing.length > 0 && (
        <>
          <h2 className={styles.section}>Missing something · {missing.length}</h2>
          <ul className={styles.list}>
            {missing.map((m) => (
              <Row key={m.recipe.id} {...m} />
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default Favorites
