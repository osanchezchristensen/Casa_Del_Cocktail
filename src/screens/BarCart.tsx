import { ChevronDown, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddItemsSheet from '../components/AddItemsSheet.tsx'
import BottleSheet from '../components/BottleSheet.tsx'
import LevelChip from '../components/LevelChip.tsx'
import { CATEGORY_LABELS, groupCart, ingredientName } from '../logic/cart.ts'
import { useStore } from '../store/useStore.ts'
import type { Bottle, Level } from '../types.ts'
import styles from './BarCart.module.css'

const label = (b: Bottle) => b.name ?? ingredientName(b.ingredientId)

// Tapping the chip steps the level down, the way bottles usually go, then wraps to Full.
const NEXT_LEVEL: Record<Level, Level> = { full: 'half', half: 'low', low: 'empty', empty: 'full' }

function BottleList({ bottles, onEdit }: { bottles: Bottle[]; onEdit: (id: string) => void }) {
  const updateBottle = useStore((s) => s.updateBottle)
  return (
    <ul className={styles.list}>
      {bottles.map((b) => (
        <li key={b.id} className={styles.bottle}>
          <button type="button" className={styles.bottleInfo} onClick={() => onEdit(b.id)}>
            <span className={styles.bottleName}>{label(b)}</span>
            {b.name ? (
              <span className={styles.bottleType}>{ingredientName(b.ingredientId)}</span>
            ) : (
              <span className={styles.addName}>Add a bottle name</span>
            )}
          </button>
          <LevelChip level={b.level} onClick={() => updateBottle(b.id, { level: NEXT_LEVEL[b.level] })} />
        </li>
      ))}
    </ul>
  )
}

function BarCart() {
  const bottles = useStore((s) => s.bottles)
  const loadSampleCart = useStore((s) => s.loadSampleCart)
  const undoRemove = useStore((s) => s.undoRemove)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Bottle | null>(null)

  // The undo bar hides itself after 6 seconds.
  useEffect(() => {
    if (!removed) return
    const timer = setTimeout(() => setRemoved(null), 6000)
    return () => clearTimeout(timer)
  }, [removed])

  const editing = bottles.find((b) => b.id === editingId)

  const header = (
    <div className={styles.header}>
      <h1>Bar Cart</h1>
      <button type="button" className={styles.button} onClick={() => setAdding(true)}>
        <Plus size={18} aria-hidden />
        Add items
      </button>
    </div>
  )

  const overlays = (
    <>
      {adding && <AddItemsSheet onClose={() => setAdding(false)} />}
      {editing && (
        <BottleSheet
          bottle={editing}
          onClose={() => setEditingId(null)}
          onRemoved={(b) => {
            setEditingId(null)
            setRemoved(b)
          }}
        />
      )}
      <div className={styles.toastArea} role="status">
        {removed && (
          <div className={styles.toast}>
            <span>Removed {label(removed)}.</span>
            <button
              type="button"
              className={styles.undo}
              onClick={() => {
                undoRemove(removed.id)
                setRemoved(null)
              }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </>
  )

  if (bottles.length === 0) {
    return (
      <>
        {header}
        <p>Your cart's looking a little bare. Add a bottle or two and we'll find you a drink.</p>
        {/* Temporary: remove at Milestone A. */}
        <button type="button" className={styles.secondary} onClick={loadSampleCart}>
          Load sample cart
        </button>
        {overlays}
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

      {groupCart(bottles).map((section) => (
        <details key={section.category} open className={styles.section}>
          <summary className={styles.sectionTitle}>
            <h2>{CATEGORY_LABELS[section.category]}</h2>
            <span className={styles.sectionCount}>{section.bottles.length}</span>
            <ChevronDown size={20} className={styles.chevron} aria-hidden />
          </summary>

          {section.families.length > 0 ? (
            section.families.map((family) => {
              const low = family.bottles.filter((b) => b.level === 'low').length
              return (
                <details key={family.familyId} open className={styles.family}>
                  <summary className={styles.familyTitle}>
                    <span className={styles.familyName}>{family.name}</span>
                    <span className={styles.preview}>{family.bottles.map(label).join(', ')}</span>
                    {low > 0 && <span className={styles.lowBadge}>{low} low</span>}
                    <ChevronDown size={18} className={styles.chevron} aria-hidden />
                  </summary>
                  <BottleList bottles={family.bottles} onEdit={setEditingId} />
                </details>
              )
            })
          ) : (
            <BottleList bottles={section.bottles} onEdit={setEditingId} />
          )}
        </details>
      ))}

      {overlays}
    </>
  )
}

export default BarCart
