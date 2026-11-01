// First-run tour (PRD section 13), one route per step: /welcome/1 to /welcome/5. No bottom nav here.
import { ArrowLeftRight, Check, ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import GlassIcon from '../components/GlassIcon.tsx'
import LevelChip from '../components/LevelChip.tsx'
import Starburst from '../components/Starburst.tsx'
import { useStore } from '../store/useStore.ts'
import styles from './Onboarding.module.css'

// The previews are fixed sample content (one story: Campari is missing), never the user's data.
type Step = { title: string; text: string; art?: ReactNode; next?: string }

const STEPS: Step[] = [
  {
    title: 'Welcome to Casa.',
    text: "Tell us what's on your bar cart, and we'll show you what you can make tonight, and which one bottle would open up even more.",
    next: 'Show me around',
    art: (
      <>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob1b}`} />
        <div className={`${styles.blob} ${styles.blob1c}`} />
        <div className={styles.coupe}>
          <GlassIcon glass="coupe" size={76} />
        </div>
      </>
    ),
  },
  {
    title: 'Stock your cart',
    text: 'Add the bottles on your shelf. Name them if you like, and tap the level when one starts running low.',
    next: 'Next',
    art: (
      <>
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={styles.cartCard}>
          <div className={styles.cartHead}>
            <span className={styles.cartFamily}>Tequila &amp; mezcal</span>
            <small>2 bottles</small>
          </div>
          {[
            { name: 'Espolòn Blanco', type: 'Blanco tequila', level: 'full' as const },
            { name: 'Casamigos Reposado', type: 'Reposado tequila', level: 'low' as const },
          ].map((b) => (
            <div key={b.name} className={styles.cartRow}>
              <span className={styles.bottleText}>
                <span className={styles.bottleName}>{b.name}</span>
                <small>{b.type}</small>
              </span>
              <LevelChip level={b.level} />
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: 'See what you can make',
    text: 'Make Now lists every cocktail you can mix right now. Turn on swaps and a close cousin can stand in, like aged rum for white rum.',
    next: 'Next',
    art: (
      <>
        <div className={`${styles.blob} ${styles.blob3}`} />
        <div className={styles.cards}>
          <div className={styles.drinkCard}>
            <span className={styles.glass}>
              <GlassIcon glass="coupe" size={24} />
            </span>
            <span className={styles.drinkText}>
              <span className={styles.drinkName}>Margarita</span>
              <span className={`${styles.status} ${styles.ready}`}>
                <Check size={14} strokeWidth={2.8} aria-hidden />
                Ready to make
              </span>
            </span>
          </div>
          <div className={`${styles.drinkCard} ${styles.offset}`}>
            <span className={styles.glass}>
              <GlassIcon glass="coupe" size={24} />
            </span>
            <span className={styles.drinkText}>
              <span className={styles.drinkName}>Daiquiri</span>
              <span className={`${styles.status} ${styles.swap}`}>
                <ArrowLeftRight size={14} strokeWidth={2.6} aria-hidden />
                Swap: aged rum for white rum
              </span>
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    title: 'Find your next bottle',
    text: 'Unlock shows which single bottle would open up the most new cocktails. Handy before a trip to the store.',
    next: 'Stock my cart',
    art: (
      <>
        <div className={`${styles.blob} ${styles.blob4}`} />
        {/* The starburst is allowed here because this previews Unlock (PRD section 13). */}
        <div className={styles.unlockCard}>
          <span className={styles.burst}>
            <Starburst count={6} size={80} />
          </span>
          <span className={styles.eyebrow}>BEST NEXT BOTTLE</span>
          <span className={styles.unlockName}>Add Campari</span>
          <span className={styles.unlockText}>Unlocks 6 cocktails, including the Negroni.</span>
        </div>
      </>
    ),
  },
  // shortcut: placeholder for screen 5; step 8.2 builds the tap-to-pick list.
  { title: "What's on your cart?", text: "Tap everything you've got. You can add bottle names and more later." },
]

function Onboarding() {
  const step = Number(useParams().step)
  const navigate = useNavigate()
  const finishOnboarding = useStore((s) => s.finishOnboarding)
  const current = STEPS[step - 1]
  if (!current) return <Navigate to="/welcome/1" replace />

  const finish = () => {
    finishOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <main className={styles.screen}>
      <div className={styles.top}>
        {step > 1 && (
          <Link to={`/welcome/${step - 1}`} className={styles.back} aria-label="Back">
            <ChevronLeft size={24} aria-hidden />
          </Link>
        )}
        <button type="button" className={styles.skip} onClick={finish}>
          Skip
        </button>
      </div>

      {current.art && (
        <div className={styles.art} aria-hidden>
          {current.art}
        </div>
      )}

      <div className={styles.copy}>
        <h1>{current.title}</h1>
        <p>{current.text}</p>
      </div>

      <div className={styles.footer}>
        {step <= 4 && (
          <div className={styles.dots} role="img" aria-label={`Step ${step} of 4`}>
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={n === step ? styles.dotOn : styles.dot} />
            ))}
          </div>
        )}
        {current.next && (
          <Link to={`/welcome/${step + 1}`} className={styles.primary}>
            {current.next}
          </Link>
        )}
        {step === 4 && (
          <button type="button" className={styles.later} onClick={finish}>
            I'll do it later
          </button>
        )}
      </div>
    </main>
  )
}

export default Onboarding
