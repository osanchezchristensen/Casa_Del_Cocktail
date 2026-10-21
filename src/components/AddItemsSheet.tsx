import { Check, ChevronDown, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABELS } from '../logic/cart.ts'
import { addableIngredients, searchIngredients } from '../logic/search.ts'
import { useStore } from '../store/useStore.ts'
import { INGREDIENT_CATEGORIES, type Ingredient } from '../types.ts'
import styles from './AddItemsSheet.module.css'

// Rendered only while open, so closing it (unmounting) resets the search and picks.
// <dialog> with showModal() gives the dimmed backdrop, Esc to close and focus kept inside.
function AddItemsSheet({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const bottles = useStore((s) => s.bottles)
  const addBottles = useStore((s) => s.addBottles)

  const [step, setStep] = useState<'search' | 'confirm'>('search')
  const [mode, setMode] = useState<'search' | 'browse'>('search')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<Ingredient[]>([])
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const results = searchIngredients(query)
  const isPicked = (id: string) => picked.some((p) => p.id === id)
  const toggle = (ingredient: Ingredient) =>
    setPicked(isPicked(ingredient.id) ? picked.filter((p) => p.id !== ingredient.id) : [...picked, ingredient])

  /** "You have 1: Espolòn Blanco", or just "You have 1" when no bottle is named. */
  const ownedNote = (id: string) => {
    const mine = bottles.filter((b) => b.ingredientId === id)
    if (mine.length === 0) return null
    const named = mine.flatMap((b) => (b.name ? [b.name] : []))
    return `You have ${mine.length}${named.length > 0 ? `: ${named.join(', ')}` : ''}`
  }

  // One row, used by both Search and Browse. Tap to pick or unpick.
  const resultRow = (i: Ingredient) => {
    const selected = isPicked(i.id)
    const note = ownedNote(i.id)
    return (
      <li key={i.id}>
        <button type="button" className={styles.result} aria-pressed={selected} onClick={() => toggle(i)}>
          <span>
            <span className={styles.resultName}>{i.name}</span>
            {note && <span className={styles.owned}>{note}</span>}
          </span>
          {selected ? <Check size={20} aria-hidden /> : <Plus size={20} aria-hidden />}
        </button>
      </li>
    )
  }

  const add = () => {
    addBottles(picked.map((p) => ({ ingredientId: p.id, name: names[p.id] })))
    onClose()
  }

  const title = step === 'search' ? 'Add items' : picked.length === 1 ? 'Add this bottle?' : `Add these ${picked.length} bottles?`

  return (
    <dialog ref={dialogRef} className={styles.sheet} onClose={onClose} aria-labelledby="add-items-title">
      <header className={styles.header}>
        <h2 id="add-items-title">{title}</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <X size={22} aria-hidden />
        </button>
      </header>

      {step === 'search' ? (
        <>
          <div className={styles.body}>
            <div className={styles.modes} role="group" aria-label="How to find items">
              <button type="button" className={styles.mode} aria-pressed={mode === 'search'} onClick={() => setMode('search')}>
                Search
              </button>
              <button type="button" className={styles.mode} aria-pressed={mode === 'browse'} onClick={() => setMode('browse')}>
                Browse
              </button>
            </div>

            {mode === 'search' ? (
              <>
                <input
                  type="search"
                  className={styles.input}
                  placeholder="Search, like “camp” for Campari"
                  aria-label="Search ingredients"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                {query.trim() && results.length === 0 && (
                  <p className={styles.hint}>Nothing by that name. Try another spelling.</p>
                )}
                <ul className={styles.results}>{results.map(resultRow)}</ul>
              </>
            ) : (
              INGREDIENT_CATEGORIES.map((category) => {
                // Data-file order keeps families together: Rum, White rum, Dark rum…
                const items = addableIngredients.filter((i) => i.category === category)
                if (items.length === 0) return null
                const pickedHere = items.filter((i) => isPicked(i.id)).length
                return (
                  <details key={category} className={styles.category}>
                    <summary className={styles.categoryTitle}>
                      <span className={styles.resultName}>{CATEGORY_LABELS[category]}</span>
                      {pickedHere > 0 && <span className={styles.pickedCount}>{pickedHere} picked</span>}
                      <ChevronDown size={20} className={styles.chevron} aria-hidden />
                    </summary>
                    <ul className={styles.results}>{items.map(resultRow)}</ul>
                  </details>
                )
              })
            )}
          </div>
          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.primary}
              disabled={picked.length === 0}
              onClick={() => setStep('confirm')}
            >
              {picked.length === 0 ? 'Pick something to add' : `Review ${picked.length}`}
            </button>
          </footer>
        </>
      ) : (
        <>
          <div className={styles.body}>
            <ul className={styles.results}>
              {picked.map((p) => (
                <li key={p.id} className={styles.confirmRow}>
                  <label htmlFor={`name-${p.id}`} className={styles.resultName}>
                    {p.name}
                  </label>
                  <input
                    id={`name-${p.id}`}
                    className={styles.input}
                    placeholder="Bottle name (optional)"
                    value={names[p.id] ?? ''}
                    onChange={(e) => setNames({ ...names, [p.id]: e.target.value })}
                  />
                </li>
              ))}
            </ul>
          </div>
          <footer className={styles.footer}>
            <button type="button" className={styles.secondary} onClick={() => setStep('search')}>
              Back
            </button>
            <button type="button" className={styles.primary} onClick={add}>
              Add to cart
            </button>
          </footer>
        </>
      )}
    </dialog>
  )
}

export default AddItemsSheet
