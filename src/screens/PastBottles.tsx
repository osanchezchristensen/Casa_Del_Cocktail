import { Check, ChevronLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import HeaderBlob from '../components/HeaderBlob.tsx'
import { ingredientName, pastBottlesNewestFirst, shortDate } from '../logic/cart.ts'
import { useStore } from '../store/useStore.ts'
import cart from './BarCart.module.css'
import styles from './PastBottles.module.css'

/** Every bottle you've finished, newest first, with a way to buy it again (PRD section 14). */
function PastBottles() {
  const pastBottles = useStore((s) => s.pastBottles)
  const addBottles = useStore((s) => s.addBottles)
  // Rows added again during this visit show "Added", so a second tap doesn't add a duplicate by accident.
  const [added, setAdded] = useState<Set<string>>(new Set())
  const count = pastBottles.length

  return (
    <>
      <HeaderBlob variant="cart" />
      <Link to="/cart" className={styles.back}>
        <ChevronLeft size={20} aria-hidden />
        Bar Cart
      </Link>
      <div className={cart.header}>
        <div>
          <h1>Past bottles</h1>
          {count > 0 && (
            <p className={cart.count}>
              {count} past {count === 1 ? 'bottle' : 'bottles'}
            </p>
          )}
        </div>
      </div>

      {count === 0 ? (
        <>
          <p className={cart.empty}>No past bottles yet. When you finish one on your Bar Cart, it lands here.</p>
          <Link to="/cart" className={`${cart.secondary} ${styles.plain}`}>
            Go to Bar Cart
          </Link>
        </>
      ) : (
        <div className={cart.card}>
          <ul className={cart.list}>
            {pastBottlesNewestFirst(pastBottles).map((b) => (
              <li key={b.id} className={cart.bottle}>
                <span className={styles.info}>
                  <span className={cart.bottleName}>{b.name ?? ingredientName(b.ingredientId)}</span>
                  {b.name && <span className={cart.bottleType}>{ingredientName(b.ingredientId)}</span>}
                  <span className={cart.bottleType}>
                    Added {shortDate(b.addedAt)} · Finished {shortDate(b.finishedAt)}
                  </span>
                </span>
                {added.has(b.id) ? (
                  <span className={styles.added}>
                    <Check size={16} aria-hidden />
                    Added
                  </span>
                ) : (
                  <button
                    type="button"
                    className={styles.again}
                    aria-label={`Add ${b.name ?? ingredientName(b.ingredientId)} again`}
                    onClick={() => {
                      addBottles([{ ingredientId: b.ingredientId, name: b.name }])
                      setAdded(new Set(added).add(b.id))
                    }}
                  >
                    <Plus size={16} aria-hidden />
                    Add again
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default PastBottles
