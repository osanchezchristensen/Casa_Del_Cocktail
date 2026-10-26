import { ArrowLeftRight, Check } from 'lucide-react'
import { ingredientName } from '../logic/cart.ts'
import { mainIngredients, type MakeableRecipe } from '../logic/matching.ts'
import type { RecipeSource } from '../types.ts'
import GlassIcon from './GlassIcon.tsx'
import styles from './CocktailCard.module.css'

const sourceLabel = (s: RecipeSource) => (s.type === 'starter' ? 'Casa starter set' : `From ${s.title}, p. ${s.page}`)

// "Dark rum" reads better mid-sentence as "dark rum".
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

function CocktailCard({ recipe, match }: MakeableRecipe) {
  const swapText = match.swaps
    .map((s) => `${lowerFirst(ingredientName(s.used))} for ${lowerFirst(ingredientName(s.needed))}`)
    .join(', ')

  return (
    <li className={styles.card}>
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
    </li>
  )
}

export default CocktailCard
