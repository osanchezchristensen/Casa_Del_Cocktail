import { useId, useState } from 'react'
import { useStore } from '../store/useStore.ts'
import styles from './MadeThis.module.css'

const GLASS = 'M6 6h28l-3 31.3a3 3 0 0 1-3 2.7H12a3 3 0 0 1-3-2.7Z'

/**
 * "I made this" on the recipe page: logs the drink, then plays Fill rise (docs/motion.md).
 * The glass stays full until you leave the page; give it key={recipe.id} so a new recipe starts fresh.
 */
function MadeThis({ recipeId }: { recipeId: string }) {
  const logMade = useStore((s) => s.logMade)
  const [made, setMade] = useState(false)
  const clipId = useId()

  if (!made) {
    return (
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          logMade(recipeId)
          setMade(true)
        }}
      >
        I made this
      </button>
    )
  }

  return (
    <div className={styles.done} role="status">
      <svg className={styles.glass} viewBox="0 0 44 46" width={44} height={46} aria-hidden="true">
        <clipPath id={clipId}>
          <path d={GLASS} />
        </clipPath>
        <g className={styles.wobble}>
          <rect className={styles.liquid} x="0" y="12" width="40" height="29" clipPath={`url(#${clipId})`} />
          <path d={GLASS} className={styles.outline} />
        </g>
        <g className={styles.check}>
          <circle cx="34" cy="35" r="9" />
          <path d="M30 35l3 3 5-6" />
        </g>
      </svg>
      <span className={styles.text}>Made it. Cheers!</span>
    </div>
  )
}

export default MadeThis
