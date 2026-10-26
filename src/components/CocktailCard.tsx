import { ArrowLeftRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { ingredientName } from '../logic/cart.ts'
import { mainIngredients, type MakeableRecipe } from '../logic/matching.ts'
import { lowerFirst, sourceLabel } from '../logic/recipeDisplay.ts'
import FavoriteButton from './FavoriteButton.tsx'
import GlassIcon from './GlassIcon.tsx'
import styles from './CocktailCard.module.css'

function CocktailCard({ recipe, match }: MakeableRecipe) {
  const swapText = match.swaps
    .map((s) => `${lowerFirst(ingredientName(s.used))} for ${lowerFirst(ingredientName(s.needed))}`)
    .join(', ')

  return (
    <li className={styles.card}>
      <Link to={`/make/${recipe.id}`} className={styles.link}>
      <span className={styles.glass}>
        <GlassIcon glass={recipe.glass} />
      </span>
      <div className={styles.text}>
        <h2 className={styles.name}>{recipe.name}</h2>
        <span className={styles.ingredients}>{mainIngredients(recipe).map(ingredientName).join(' · ')}</span>
        {match.status === 'swap' ? (
          <span className={`${styles.status} ${styles.swap}`}>
            <ArrowLeftRight size={16} aria-hidden />
            Swap: {swapText}
          </span>
        ) : (
          <span className={`${styles.status} ${styles.ready}`}>
            <Check size={16} strokeWidth={2.6} aria-hidden />
            Ready to make
          </span>
        )}
        <span className={styles.tag}>{sourceLabel(recipe.source)}</span>
      </div>
      </Link>
      <FavoriteButton recipeId={recipe.id} className={styles.heart} />
    </li>
  )
}

export default CocktailCard
