import { ArrowLeftRight, Check, ChevronLeft, X } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import FavoriteButton from '../components/FavoriteButton.tsx'
import GlassIcon from '../components/GlassIcon.tsx'
import { ALL_RECIPES } from '../data/recipes.ts'
import { ingredientName } from '../logic/cart.ts'
import { ingredientStatuses, matchRecipe, ownedIngredientIds, type RowStatus } from '../logic/matching.ts'
import { formatAmount, lowerFirst, sourceLabel } from '../logic/recipeDisplay.ts'
import { useStore } from '../store/useStore.ts'
import styles from './RecipeDetail.module.css'

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

// Every status has an icon and a word, so color is never the only signal.
const STATUS = {
  have: { Icon: Check, word: 'Have it', className: styles.have },
  swap: { Icon: ArrowLeftRight, word: 'Swap', className: styles.swap },
  missing: { Icon: X, word: 'Missing', className: styles.missing },
}

function Status({ status, optional }: { status: RowStatus; optional: boolean }) {
  const { Icon, word, className } = STATUS[status]
  // A missing garnish never blocks the drink, so it is not shown in alarm colors.
  const tone = optional && status === 'missing' ? styles.quiet : className
  return (
    <span className={`${styles.status} ${tone}`}>
      <Icon size={14} strokeWidth={2.8} aria-hidden />
      {word}
    </span>
  )
}

function RecipeDetail() {
  const { id } = useParams()
  const bottles = useStore((s) => s.bottles)
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const recipe = ALL_RECIPES.find((r) => r.id === id)
  const owned = useMemo(() => ownedIngredientIds(bottles), [bottles])

  const back = (
    <Link to="/make" className={styles.back}>
      <ChevronLeft size={20} aria-hidden />
      Make Now
    </Link>
  )

  if (!recipe) {
    return (
      <>
        {back}
        <h1 className={styles.notFound}>We couldn't find that recipe.</h1>
      </>
    )
  }

  const statuses = ingredientStatuses(recipe, owned, allowSwaps)
  const { swaps } = matchRecipe(recipe, owned, allowSwaps)

  return (
    <>
      <div className={styles.topRow}>
        {back}
        <FavoriteButton recipeId={recipe.id} large />
      </div>

      <div className={styles.title}>
        <span className={styles.blob}>
          <GlassIcon glass={recipe.glass} size={48} />
        </span>
        <div className={styles.titleText}>
          <h1>{recipe.name}</h1>
          <span className={styles.meta}>
            {capitalize(recipe.method)} · {capitalize(recipe.glass)}
          </span>
          <span className={styles.tag}>{sourceLabel(recipe.source)}</span>
        </div>
      </div>

      {swaps.length > 0 && (
        <p className={styles.swapNote}>
          <ArrowLeftRight size={18} aria-hidden />
          <span>
            <b>{swaps.length > 1 ? 'Made with swaps.' : 'Made with a swap.'}</b>{' '}
            {swaps
              .map((s) => `Your ${lowerFirst(ingredientName(s.used))} stands in for ${lowerFirst(ingredientName(s.needed))}.`)
              .join(' ')}
          </span>
        </p>
      )}

      <h2 className={styles.heading}>Ingredients</h2>
      <ul className={styles.ingredients}>
        {recipe.ingredients.map((ri, i) => {
          const optional = Boolean(ri.garnish || ri.optional)
          return (
            <li key={`${ri.ingredientId}-${i}`} className={styles.row}>
              <span className={optional ? `${styles.amount} ${styles.amountQuiet}` : styles.amount}>
                {formatAmount(ri.amount, ri.unit)}
              </span>
              <span className={styles.ingredient}>
                {ingredientName(ri.ingredientId)}
                {optional && <span className={styles.note}>{ri.garnish ? 'Garnish, optional' : 'Optional'}</span>}
              </span>
              <Status status={statuses[i]} optional={optional} />
            </li>
          )
        })}
      </ul>

      <h2 className={styles.heading}>Recipe</h2>
      <ol className={styles.steps}>
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </>
  )
}

export default RecipeDetail
