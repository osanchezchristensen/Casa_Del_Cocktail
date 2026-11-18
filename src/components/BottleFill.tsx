import { useId } from 'react'
import type { Level } from '../types.ts'
import styles from './BottleFill.module.css'

const BOTTLE = 'M7 1.5h4V8s5 1.5 5 5.5V27a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 27V13.5C2 9.5 7 8 7 8Z'

/** A bottle drawing filled to its level. Decorative: the level chip next to it says the level in words. */
function BottleFill({ level }: { level: Level }) {
  const clipId = useId()
  return (
    <svg className={styles.bottle} viewBox="0 0 18 30" width={18} height={30} aria-hidden="true">
      <clipPath id={clipId}>
        <path d={BOTTLE} />
      </clipPath>
      <rect className={`${styles.liquid} ${styles[level]}`} x="0" y="13" width="18" height="16" clipPath={`url(#${clipId})`} />
      <path d={BOTTLE} className={styles.outline} />
    </svg>
  )
}

export default BottleFill
