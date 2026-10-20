import { ChevronDown } from 'lucide-react'
import LevelChip from '../components/LevelChip.tsx'
import { CATEGORY_LABELS, groupCart, ingredientName } from '../logic/cart.ts'
import { useStore } from '../store/useStore.ts'
import type { Bottle } from '../types.ts'
import styles from './BarCart.module.css'

const label = (b: Bottle) => b.name ?? ingredientName(b.ingredientId)

function BottleList({ bottles }: { bottles: Bottle[] }) {
  return (
    <ul className={styles.list}>
      {bottles.map((b) => (
        <li key={b.id} className={styles.bottle}>
          <div>
            <div className={styles.bottleName}>{label(b)}</div>
            {b.name ? (
              <div className={styles.bottleType}>{ingredientName(b.ingredientId)}</div>
            ) : (
              <div className={styles.addName}>Add a bottle name</div>
            )}
          </div>
          <LevelChip level={b.level} />
        </li>
      ))}
    </ul>
  )
}

function BarCart() {
  const bottles = useStore((s) => s.bottles)
  const loadSampleCart = useStore((s) => s.loadSampleCart)

  if (bottles.length === 0) {
    return (
      <>
        <h1>Bar Cart</h1>
        <p>Your cart's looking a little bare. Add a bottle or two and we'll find you a drink.</p>
        {/* Temporary: remove at Milestone A. */}
        <button type="button" className={styles.button} onClick={loadSampleCart}>
          Load sample cart
        </button>
      </>
    )
  }

  // <details> gives open/close and keyboard support for free; sections start open.
  return (
    <>
      <h1>Bar Cart</h1>
      <p className={styles.count}>
        {bottles.length} {bottles.length === 1 ? 'bottle' : 'bottles'}
      </p>

      {groupCart(bottles).map((section) => (
        <details key={section.category} open className={styles.section}>
          <summary className={styles.sectionTitle}>
            <h2>{CATEGORY_LABELS[section.category]}</h2>
            <span className={styles.sectionCount}>{section.bottles.length}</span>
            <ChevronDown size={20} className={styles.chevron} aria-hidden />
          </summary>

          {section.families.length > 0 ? (
            section.families.map((family) => (
              <details key={family.familyId} open className={styles.family}>
                <summary className={styles.familyTitle}>
                  <span className={styles.familyName}>{family.name}</span>
                  <span className={styles.preview}>{family.bottles.map(label).join(', ')}</span>
                  <ChevronDown size={18} className={styles.chevron} aria-hidden />
                </summary>
                <BottleList bottles={family.bottles} />
              </details>
            ))
          ) : (
            <BottleList bottles={section.bottles} />
          )}
        </details>
      ))}
    </>
  )
}

export default BarCart
