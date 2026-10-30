import { ChevronDown, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddItemsSheet from '../components/AddItemsSheet.tsx'
import BottleSheet from '../components/BottleSheet.tsx'
import HeaderBlob from '../components/HeaderBlob.tsx'
import LevelChip from '../components/LevelChip.tsx'
import {
  CART_FILTERS,
  CATEGORY_LABELS,
  countLow,
  FILTER_LABELS,
  filterBottles,
  groupCart,
  ingredientName,
  levelSummary,
  type CartFilter,
} from '../logic/cart.ts'
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
  const undoRemove = useStore((s) => s.undoRemove)
  const loadSampleCart = useStore((s) => s.loadSampleCart)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Bottle | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CartFilter>('all')

  // The undo bar hides itself after 6 seconds.
  useEffect(() => {
    if (!removed) return
    const timer = setTimeout(() => setRemoved(null), 6000)
    return () => clearTimeout(timer)
  }, [removed])

  const editing = bottles.find((b) => b.id === editingId)

  const shown = filterBottles(bottles, query, filter)
  const narrowed = shown.length !== bottles.length
  const lowCount = countLow(bottles)

  const header = (
    <div className={styles.header}>
      <div>
        <h1>Bar Cart</h1>
        {bottles.length > 0 && (
          <p className={styles.count}>
            {narrowed && `${shown.length} of `}
            {bottles.length} {bottles.length === 1 ? 'bottle' : 'bottles'} on your cart
          </p>
        )}
      </div>
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
        <HeaderBlob variant="cart" />
        {header}
        <p className={styles.empty}>Your cart's looking a little bare. Add a bottle or two and we'll find you a drink.</p>
        <button type="button" className={styles.secondary} onClick={loadSampleCart}>
          Try a sample cart
        </button>
        {overlays}
      </>
    )
  }

  // <details> gives open/close and keyboard support for free. Sections start open and
  // only the first spirit family does; a search or filter opens every family so hits show.
  return (
    <>
      <HeaderBlob variant="cart" />
      {header}

      <label className={styles.search}>
        <Search size={18} aria-hidden />
        <input
          type="search"
          placeholder="Search by bottle or type"
          aria-label="Search your cart"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className={styles.filters} role="group" aria-label="Filter your cart">
        {CART_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={f === 'low' ? `${styles.filter} ${styles.lowFilter}` : styles.filter}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'low' && lowCount > 0 ? `${FILTER_LABELS[f]} · ${lowCount}` : FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <div className={styles.noMatch}>
          <p>No bottles match that.</p>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
          >
            Show all
          </button>
        </div>
      )}

      {groupCart(shown).map((section) => {
        const summary = levelSummary(section.bottles)
        return (
          <details key={section.category} open className={styles.section}>
            <summary className={styles.sectionTitle}>
              <h2>
                {CATEGORY_LABELS[section.category]} · {section.bottles.length}
              </h2>
              {summary && <span className={styles.lowBadge}>{summary}</span>}
              <ChevronDown size={20} className={styles.chevron} aria-hidden />
            </summary>

            <div className={styles.card}>
              {section.families.length > 0 ? (
                section.families.map((family, i) => {
                  const familySummary = levelSummary(family.bottles)
                  return (
                    <details key={family.familyId} open={narrowed || i === 0} className={styles.family}>
                      <summary className={styles.familyTitle}>
                        <span className={styles.familyText}>
                          <span className={styles.familyName}>{family.name}</span>
                          <span className={styles.preview}>{family.bottles.map(label).join(', ')}</span>
                        </span>
                        <span className={styles.familyCount}>
                          {family.bottles.length} {family.bottles.length === 1 ? 'bottle' : 'bottles'}
                        </span>
                        {familySummary && <span className={styles.lowBadge}>{familySummary}</span>}
                        <ChevronDown size={18} className={styles.chevron} aria-hidden />
                      </summary>
                      <BottleList bottles={family.bottles} onEdit={setEditingId} />
                    </details>
                  )
                })
              ) : (
                <BottleList bottles={section.bottles} onEdit={setEditingId} />
              )}
            </div>
          </details>
        )
      })}

      {overlays}
    </>
  )
}

export default BarCart
