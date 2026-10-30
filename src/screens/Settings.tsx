import { ChevronLeft, Download, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import AllowSwapsCard from '../components/AllowSwapsCard.tsx'
import HeaderBlob from '../components/HeaderBlob.tsx'
import sheet from '../components/Sheet.module.css'
import { buildBackup, parseBackup, type BackupData } from '../logic/backup.ts'
import { useStore } from '../store/useStore.ts'
import styles from './Settings.module.css'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

// "Replace your cart?" Same <dialog> pattern as the Bar Cart sheets.
function ConfirmImport({ backup, onCancel, onConfirm }: { backup: BackupData; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} className={sheet.sheet} onClose={onCancel} aria-labelledby="import-title">
      <header className={sheet.header}>
        <h2 id="import-title">Replace your cart?</h2>
      </header>
      <div className={sheet.body}>
        <p>This will replace your current cart. Continue?</p>
        <p className={styles.backupSummary}>
          The backup has {plural(backup.bottles.length, 'bottle')} and {plural(backup.favorites.length, 'favorite')}.
        </p>
      </div>
      <footer className={sheet.footer}>
        <button type="button" className={sheet.secondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={sheet.primary} onClick={onConfirm}>
          Replace my cart
        </button>
      </footer>
    </dialog>
  )
}

function Settings() {
  const restoreBackup = useStore((s) => s.restoreBackup)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<BackupData | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string }>()

  const exportCart = () => {
    const { bottles, pastBottles, favorites, settings } = useStore.getState()
    const backup = buildBackup({ bottles, pastBottles, favorites, settings })
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `casa-del-cocktail-backup-${backup.exportedAt.slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setMessage({ ok: true, text: 'Your bar cart is backed up. Keep that file somewhere safe.' })
  }

  const readFile = async (file: File | undefined) => {
    if (!file) return
    // Clearing the input lets you pick the same file again later.
    if (fileRef.current) fileRef.current.value = ''
    const backup = parseBackup(await file.text().catch(() => ''))
    if (backup) {
      setMessage(undefined)
      setPending(backup)
    } else {
      setMessage({ ok: false, text: "That file doesn't look like a Casa backup. Try another one?" })
    }
  }

  return (
    <>
      <HeaderBlob variant="settings" />
      <Link to="/" className={styles.back}>
        <ChevronLeft size={20} aria-hidden />
        Home
      </Link>
      <h1 className={styles.title}>Settings</h1>

      <AllowSwapsCard />

      <section className={styles.card} aria-labelledby="data-title">
        <h2 id="data-title" className={styles.heading}>
          Your data
        </h2>
        <p className={styles.text}>Save a backup file now and then, so a cleared browser never costs you your cart.</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.primary} onClick={exportCart}>
            <Download size={18} aria-hidden />
            Export my cart
          </button>
          <button type="button" className={styles.secondary} onClick={() => fileRef.current?.click()}>
            <Upload size={18} aria-hidden />
            Import a backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className={styles.file}
            tabIndex={-1}
            aria-hidden
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>
        <div role="status">
          {message && <p className={message.ok ? styles.ok : styles.error}>{message.text}</p>}
        </div>
      </section>

      <section className={styles.card} aria-labelledby="about-title">
        <h2 id="about-title" className={styles.heading}>
          About
        </h2>
        <p className={styles.text}>
          Casa Del Cocktail is a home bar helper. Your cart, favorites and settings stay in this browser and are never
          sent anywhere.
        </p>
      </section>

      <p className={styles.note}>Made for enjoying, not overdoing. Please drink responsibly.</p>

      {pending && (
        <ConfirmImport
          backup={pending}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            restoreBackup(pending)
            setPending(null)
            setMessage({ ok: true, text: 'Welcome back. Your cart is just as you left it.' })
          }}
        />
      )}
    </>
  )
}

export default Settings
