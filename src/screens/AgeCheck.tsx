// The age gate at /welcome/age, right after the welcome screen (PRD section 13). No mockup: it reuses the tour layout.
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import GlassIcon from '../components/GlassIcon.tsx'
import { useStore } from '../store/useStore.ts'
import styles from './Onboarding.module.css'

function AgeCheck() {
  const navigate = useNavigate()
  const onboardingDone = useStore((s) => s.settings.onboardingDone)
  const confirmAge = useStore((s) => s.confirmAge)
  // "No" is not saved, so a refresh asks again.
  const [under, setUnder] = useState(false)

  const yes = () => {
    confirmAge()
    navigate(onboardingDone ? '/' : '/welcome/2', { replace: true })
  }

  return (
    <main className={styles.screen}>
      <div className={styles.top}>
        {!under && (
          <Link to="/welcome/1" className={styles.back} aria-label="Back">
            <ChevronLeft size={24} aria-hidden />
          </Link>
        )}
      </div>

      <div className={styles.art} aria-hidden>
        <div className={`${styles.blob} ${styles.blob4}`} />
        <div className={styles.coupe}>
          <GlassIcon glass="coupe" size={76} />
        </div>
      </div>

      <div className={styles.copy}>
        <h1>{under ? 'Sorry, Casa is for grown-ups.' : 'One quick question'}</h1>
        <p>{under ? "Come back when you're 21. We'll keep the bar warm." : 'Are you 21 or older?'}</p>
      </div>

      {!under && (
        <div className={styles.footer}>
          <button type="button" className={styles.primary} onClick={yes}>
            Yes, I'm 21 or older
          </button>
          <button type="button" className={styles.secondary} onClick={() => setUnder(true)}>
            No
          </button>
        </div>
      )}
    </main>
  )
}

export default AgeCheck
