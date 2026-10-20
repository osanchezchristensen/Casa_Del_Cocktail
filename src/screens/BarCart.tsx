import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import AddItemsSheet from '../components/AddItemsSheet.tsx'
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
  const [adding, setAdding] = useState(false)

  const header = (
    <div className={styles.header}>
      <h1>Bar Cart</h1>
      <button type="button" className={styles.button} onClick={() => setAdding(true)}>
        <Plus size={18} aria-hidden />
        Add items
      </button>
    </div>
  )
  const sheet = adding && <AddItemsSheet onClose={() => setAdding(false)} />

  if (bottles.length === 0) {
    return (
      <>
        {header}
        <p>Your cart's looking a little bare. Add a bottle or two and we'll find you a drink.</p>
        {/* Temporary: remove at Milestone A. */}
        <button type="button" className={styles.secondary} onClick={loadSampleCart}>
          Load sample cart
        </button>
        {sheet}
      </>
    )
  }

  // <details> gives open/close and keyboard support for free; sections start open.
  return (
    <>
      {header}
      <p className={styles.count}>
        {bottles.length} {bottles.length === 1 ? 'bottle' : 'bottles'}
      </p>
      {sheet}

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
