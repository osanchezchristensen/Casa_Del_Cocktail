import styles from './HeaderBlob.module.css'

type Variant = 'cart' | 'make' | 'unlock' | 'favorites' | 'settings'

/** The soft color shape behind a screen's header (brand kit, section 6). One per screen. */
function HeaderBlob({ variant }: { variant: Variant }) {
  return (
    <div className={styles.clip} aria-hidden>
      <div className={`${styles.blob} ${styles[variant]}`} />
    </div>
  )
}

export default HeaderBlob
