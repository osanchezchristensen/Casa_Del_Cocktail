import styles from './Starburst.module.css'

// The mustard starburst badge. Brand rule: used only on Unlock suggestions.
function Starburst({ count, size }: { count: number; size: number }) {
  return (
    <span
      className={styles.burst}
      style={{ width: size, height: size, fontSize: size > 60 ? 20 : 15 }}
      role="img"
      aria-label={`Unlocks ${count} ${count === 1 ? 'cocktail' : 'cocktails'}`}
    >
      <svg className={styles.shape} viewBox="0 0 100 100" aria-hidden="true">
        <polygon
          fill="var(--mustard)"
          points="50,2 58,26 82,12 72,38 98,42 76,58 92,80 64,74 60,98 48,78 32,96 30,70 4,78 22,56 2,40 28,34 16,10 42,24"
        />
      </svg>
      <span className={styles.number}>+{count}</span>
    </span>
  )
}

export default Starburst
