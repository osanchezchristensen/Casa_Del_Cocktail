// Onboarding screen 5: tap the bottles you own (PRD section 13). Onboarding.tsx draws Back and Skip above this.
import { Check, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import HeaderBlob from '../components/HeaderBlob.tsx'
import { groupIngredients, PICK_GROUPS } from '../logic/onboarding.ts'
import { searchIngredients } from '../logic/search.ts'
import { useStore } from '../store/useStore.ts'
import type { Ingredient } from '../types.ts'
import styles from './PickBottles.module.css'

function PickBottles({ onDone }: { onDone: () => void }) {
  const bottles = useStore((s) => s.bottles)
  const addBottles = useStore((s) => s.addBottles)
  const [picked, setPicked] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState<string[]>([]) // labels of groups opened with "More"

  // On a replay, anything with a bottle already on the cart can't be picked again.
  const onCart = new Set(bottles.map((b) => b.ingredientId))
  const toggle = (id: string) => setPicked(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id])

  const start = () => {
    addBottles(picked.map((ingredientId) => ({ ingredientId })))
    onDone()
  }

  const pill = (i: Ingredient) => {
    if (onCart.has(i.id)) {
      return (
        <button key={i.id} type="button" className={`${styles.pill} ${styles.onCart}`} disabled>
          <Check size={14} strokeWidth={3} aria-hidden />
          {i.name} · on cart
        </button>
      )
    }
    const selected = picked.includes(i.id)
    return (
      <button key={i.id} type="button" className={styles.pill} aria-pressed={selected} onClick={() => toggle(i.id)}>
        {selected && <Check size={14} strokeWidth={3} aria-hidden />}
        {i.name}
      </button>
    )
  }

  const results = searchIngredients(query)

  return (
    <>
      <HeaderBlob variant="pick" />
      <div className={styles.intro}>
        <h1>What's on your cart?</h1>
        <p>Tap everything you've got. You can add bottle names and more later.</p>
      </div>

      <label className={styles.search}>
        <Search size={18} aria-hidden />
        <input
          type="search"
          placeholder="Looking for something else?"
          aria-label="Search for an ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {query.trim() ? (
        results.length > 0 ? (
          <div className={styles.pills} role="group" aria-label="Search results">
            {results.map(pill)}
          </div>
        ) : (
          <p className={styles.empty}>Nothing by that name. Try another word.</p>
        )
      ) : (
        PICK_GROUPS.map((group, index) => {
          const all = groupIngredients(group, true)
          const open = showAll.includes(group.label)
          const count = all.filter((i) => picked.includes(i.id)).length
          return (
            <details key={group.label} className={styles.group} open={index < 2}>
              <summary className={styles.groupTitle}>
                <span>{count > 0 ? `${group.label} · ${count} picked` : group.label}</span>
                <ChevronDown size={20} className={styles.chevron} aria-hidden />
              </summary>
              <div className={styles.pills} role="group" aria-label={group.label}>
                {(open ? all : groupIngredients(group)).map(pill)}
                {!open && all.length > group.common.length && (
                  <button type="button" className={styles.more} onClick={() => setShowAll([...showAll, group.label])}>
                    More {group.label.toLowerCase()}
                  </button>
                )}
              </div>
            </details>
          )
        })
      )}

      <div className={styles.bar}>
        <span className={styles.barText}>
          {picked.length > 0 ? `${picked.length} picked. They'll go on as Full.` : 'Nothing picked yet.'}
        </span>
        <button type="button" className={styles.start} onClick={start} disabled={picked.length === 0}>
          {picked.length > 0
            ? `Add ${picked.length} ${picked.length === 1 ? 'bottle' : 'bottles'} and start`
            : 'Add bottles and start'}
        </button>
      </div>
    </>
  )
}

export default PickBottles
