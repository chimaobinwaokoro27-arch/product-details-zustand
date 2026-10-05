import { Link, Outlet } from 'react-router-dom'
import CartDrawer from './CartDrawer.jsx'
import UserIcon from './UserIcon.jsx'
import { useAuth } from '../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function Layout() {
  const { user, loading, isAuthenticated } = useAuth()

  const handleSignOut = async () => {
    await signOut(auth)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-bone-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 sm:px-8">
            <Link
              to="/"
              className="group flex items-baseline gap-2.5 font-display text-2xl tracking-tight text-stone-900 sm:text-[28px]"
            >
              Kiln
              <span className="h-1.5 w-1.5 rounded-full bg-clay-600 transition-transform duration-300 group-hover:scale-150" />
            </Link>
            <nav className="flex items-center gap-8 text-sm text-stone-500">
              <div className="h-6 w-24 animate-pulse rounded bg-bone-100" />
              <div className="h-6 w-24 animate-pulse rounded bg-bone-100" />
            </nav>
          </div>
        </header>
        <main className="flex-1" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-bone-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 sm:px-8">
          <Link
            to="/"
            className="group flex items-baseline gap-2.5 font-display text-2xl tracking-tight text-stone-900 sm:text-[28px]"
          >
            Kiln
            <span className="h-1.5 w-1.5 rounded-full bg-clay-600 transition-transform duration-300 group-hover:scale-150" />
          </Link>

          <nav className="flex items-center gap-6 text-sm text-stone-500">
            {/* Browsing products and the cart only make sense once someone is
                signed in, so they appear on the authenticated side of the gate
                only. While signed out the header offers just Sign In / Sign Up. */}
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link to="/" className="transition-colors hover:text-clay-600">
                  All products
                </Link>
                <span
                  className="text-stone-600"
                  title={user?.email}
                  aria-label={`Signed in as ${user?.email}`}
                >
                  <UserIcon className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full bg-clay-100 px-4 py-2 text-sm font-medium text-clay-700 transition-colors hover:bg-clay-200"
                >
                  Sign Out
                </button>
                <CartDrawer />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="transition-colors hover:text-clay-600">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-clay-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clay-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-bone-200">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs tracking-wide text-stone-400 sm:px-8">
          Product data from dummyjson.com
        </div>
      </footer>
    </div>
  )
}