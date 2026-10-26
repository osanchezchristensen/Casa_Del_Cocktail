import { Heart } from 'lucide-react'
import { useStore } from '../store/useStore.ts'
import styles from './FavoriteButton.module.css'

/** The heart: filled when saved. `large` is the round paper button on the recipe page. */
function FavoriteButton({ recipeId, large, className = '' }: { recipeId: string; large?: boolean; className?: string }) {
  const saved = useStore((s) => s.favorites.some((f) => f.recipeId === recipeId))
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  return (
    <button
      type="button"
      className={`${large ? styles.large : styles.small} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
      onClick={() => toggleFavorite(recipeId)}
    >
      <Heart size={large ? 22 : 20} fill={saved ? 'currentColor' : 'none'} aria-hidden />
    </button>
  )
}

export default FavoriteButton
