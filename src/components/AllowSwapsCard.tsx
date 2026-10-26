import { useStore } from '../store/useStore.ts'
import styles from './AllowSwapsCard.module.css'

// The Allow swaps card and switch, shared by Make Now and Settings (one saved setting).
function AllowSwapsCard() {
  const allowSwaps = useStore((s) => s.settings.allowSwaps)
  const setAllowSwaps = useStore((s) => s.setAllowSwaps)
  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <span className={styles.label}>Allow swaps</span>
        <span className={styles.hint}>Lets a close cousin stand in, like aged rum for white rum.</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={allowSwaps}
        aria-label="Allow swaps"
        className={styles.switch}
        onClick={() => setAllowSwaps(!allowSwaps)}
      >
        <span className={styles.knob} aria-hidden />
      </button>
      <span className={styles.word} aria-hidden>
        {allowSwaps ? 'On' : 'Off'}
      </span>
    </div>
  )
}

export default AllowSwapsCard
