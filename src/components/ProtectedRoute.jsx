import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Used as a layout route: it wraps every route that needs a signed-in user.
// While Firebase is still checking the session we show a loading state instead
// of redirecting, so refreshing the page never bounces a logged-in user to /login.
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:px-8 sm:py-32">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-clay-600 border-t-transparent" />
        <p className="text-stone-600">Checking authentication...</p>
      </div>
    )
  }

  if (!user) {
    // `state.from` remembers where they were heading so login can send them back.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}