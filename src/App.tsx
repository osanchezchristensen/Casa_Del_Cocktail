import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import BottomNav from './components/BottomNav.tsx'
import BarCart from './screens/BarCart.tsx'
import Favorites from './screens/Favorites.tsx'
import Home from './screens/Home.tsx'
import MakeNow from './screens/MakeNow.tsx'
import Onboarding from './screens/Onboarding.tsx'
import RecipeDetail from './screens/RecipeDetail.tsx'
import Settings from './screens/Settings.tsx'
import Unlock from './screens/Unlock.tsx'
import { useStore } from './store/useStore.ts'

/** The main screens with the bottom nav. First-time visitors are sent to the tour instead. */
function MainLayout() {
  const onboardingDone = useStore((s) => s.settings.onboardingDone)
  if (!onboardingDone) return <Navigate to="/welcome/1" replace />
  return (
    <>
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/welcome/:step" element={<Onboarding />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<BarCart />} />
          <Route path="/make" element={<MakeNow />} />
          <Route path="/make/:id" element={<RecipeDetail />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
