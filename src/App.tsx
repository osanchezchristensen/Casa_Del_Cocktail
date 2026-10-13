import { BrowserRouter, Route, Routes } from 'react-router'
import BottomNav from './components/BottomNav.tsx'
import BarCart from './screens/BarCart.tsx'
import Favorites from './screens/Favorites.tsx'
import Home from './screens/Home.tsx'
import MakeNow from './screens/MakeNow.tsx'
import Unlock from './screens/Unlock.tsx'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<BarCart />} />
          <Route path="/make" element={<MakeNow />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
