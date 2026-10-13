import { Heart, House, Martini, Sparkles, Wine } from 'lucide-react'
import { NavLink } from 'react-router'
import styles from './BottomNav.module.css'

// NavLink sets aria-current="page" on the active link; the CSS styles that.
function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <NavLink to="/cart" className={styles.tab}>
        <Wine size={22} aria-hidden />
        Bar Cart
      </NavLink>
      <NavLink to="/make" className={styles.tab}>
        <Martini size={22} aria-hidden />
        Make Now
      </NavLink>
      <NavLink to="/" end className={styles.home}>
        <House size={24} aria-hidden />
        Home
      </NavLink>
      <NavLink to="/unlock" className={styles.tab}>
        <Sparkles size={22} aria-hidden />
        Unlock
      </NavLink>
      <NavLink to="/favorites" className={styles.tab}>
        <Heart size={22} aria-hidden />
        Favorites
      </NavLink>
    </nav>
  )
}

export default BottomNav
