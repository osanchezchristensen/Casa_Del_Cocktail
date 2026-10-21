import { LEVEL_LABELS } from '../logic/cart.ts'
import type { Level } from '../types.ts'
import styles from './LevelChip.module.css'

/** A plain label, or a button when onClick is given. */
function LevelChip({ level, onClick }: { level: Level; onClick?: () => void }) {
  const className = `${styles.chip} ${styles[level]}`
  if (!onClick) return <span className={className}>{LEVEL_LABELS[level]}</span>
  return (
    <button
      type="button"
      className={`${className} ${styles.button}`}
      onClick={onClick}
      aria-label={`Level: ${LEVEL_LABELS[level]}. Tap to change`}
    >
      {LEVEL_LABELS[level]}
    </button>
  )
}

export default LevelChip
