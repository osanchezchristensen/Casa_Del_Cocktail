import { useEffect, useState, type CSSProperties } from 'react'
import { countAt, prefersReducedMotion } from '../logic/motion.ts'
import styles from './Starburst.module.css'

// Count and burst (docs/motion.md): 10 shapes in Atomic Garden colors fly out once.
const SHAPES = ['dot', 'diamond', 'star'] as const
const COLORS = ['var(--amber)', 'var(--mustard)', 'var(--teal)', 'var(--rust)', 'var(--avocado)']
const BITS = Array.from({ length: 10 }, (_, i) => ({ shape: SHAPES[i % 3], color: COLORS[i % 5], angle: i * 36 + 12 }))

// The mustard starburst badge. Brand rule: used only on Unlock suggestions.
// With celebrate, it pops in, counts up and bursts. Give it a new key to play it again.
function Starburst({ count, size, celebrate = false }: { count: number; size: number; celebrate?: boolean }) {
  const counting = celebrate && !prefersReducedMotion()
  const [shown, setShown] = useState(counting ? 0 : count)

  useEffect(() => {
    if (!counting) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const n = countAt(now - start, count)
      setShown(n)
      if (n < count) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [counting, count])

  return (
    <span
      className={celebrate ? `${styles.burst} ${styles.celebrate}` : styles.burst}
      style={{ width: size, height: size, fontSize: size > 60 ? 20 : 15 }}
      role="img"
      aria-label={`Unlocks ${count} ${count === 1 ? 'cocktail' : 'cocktails'}`}
    >
      {celebrate &&
        BITS.map((b, i) => (
          <span
            key={i}
            className={`${styles.bit} ${styles[b.shape]}`}
            style={{ background: b.color, '--angle': `${b.angle}deg`, '--reach': `${size * 0.85}px` } as CSSProperties}
          />
        ))}
      <svg className={styles.shape} viewBox="0 0 100 100" aria-hidden="true">
        <polygon
          fill="var(--mustard)"
          points="50,2 58,26 82,12 72,38 98,42 76,58 92,80 64,74 60,98 48,78 32,96 30,70 4,78 22,56 2,40 28,34 16,10 42,24"
        />
      </svg>
      <span className={styles.number}>+{counting ? shown : count}</span>
    </span>
  )
}

export default Starburst
