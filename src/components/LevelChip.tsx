import type { Level } from '../types.ts'
import styles from './LevelChip.module.css'

const LABELS: Record<Level, string> = { full: 'Full', half: 'Half', low: 'Low', empty: 'Empty' }

// Read-only for now; tapping to change the level comes in roadmap step 3.4.
function LevelChip({ level }: { level: Level }) {
  return <span className={`${styles.chip} ${styles[level]}`}>{LABELS[level]}</span>
}

export default LevelChip
