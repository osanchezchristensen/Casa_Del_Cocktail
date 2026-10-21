import { Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LEVEL_LABELS, ingredientName } from '../logic/cart.ts'
import { useStore } from '../store/useStore.ts'
import type { Bottle, Level } from '../types.ts'
import styles from './Sheet.module.css'

const LEVELS: Level[] = ['full', 'half', 'low', 'empty']

// Edit one bottle: name, level, or remove it. Same <dialog> pattern as AddItemsSheet.
function BottleSheet({
  bottle,
  onClose,
  onRemoved,
}: {
  bottle: Bottle
  onClose: () => void
  onRemoved: (bottle: Bottle) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const updateBottle = useStore((s) => s.updateBottle)
  const removeBottle = useStore((s) => s.removeBottle)
  const [name, setName] = useState(bottle.name ?? '')
  const [level, setLevel] = useState(bottle.level)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const type = ingredientName(bottle.ingredientId)

  const save = () => {
    updateBottle(bottle.id, { name, level })
    onClose()
  }

  const remove = () => {
    removeBottle(bottle.id)
    onRemoved(bottle)
  }

  return (
    <dialog ref={dialogRef} className={styles.sheet} onClose={onClose} aria-labelledby="bottle-title">
      <header className={styles.header}>
        <h2 id="bottle-title">{bottle.name ?? type}</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <X size={22} aria-hidden />
        </button>
      </header>
      {bottle.name && <p className={styles.subtitle}>{type}</p>}

      <div className={styles.body}>
        <label htmlFor="bottle-name" className={styles.fieldLabel}>
          Bottle name
        </label>
        <input
          id="bottle-name"
          className={styles.input}
          placeholder="For example, Bulleit"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <span id="level-label" className={styles.fieldLabel}>
          Level
        </span>
        <div className={styles.modes} role="group" aria-labelledby="level-label">
          {LEVELS.map((l) => (
            <button key={l} type="button" className={styles.mode} aria-pressed={level === l} onClick={() => setLevel(l)}>
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>

        <button type="button" className={styles.remove} onClick={remove}>
          <Trash2 size={18} aria-hidden />
          Remove bottle
        </button>
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Cancel
        </button>
        <button type="button" className={styles.primary} onClick={save}>
          Save
        </button>
      </footer>
    </dialog>
  )
}

export default BottleSheet
