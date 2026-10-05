import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductsListPage from './pages/ProductsListPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Layout is the shared shell (header + cart drawer + footer), so the
            login and sign-up pages keep the same site chrome. */}
        <Route element={<Layout />}>
          {/* Public: only reachable when signed out. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Everything below this line requires a signed-in user. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ProductsListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}