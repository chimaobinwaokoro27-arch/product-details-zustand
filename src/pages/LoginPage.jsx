import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please try again.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 sm:px-8 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-stone-900 sm:text-5xl">
          Sign in to Kiln
        </h1>
        <p className="mt-4 text-stone-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-clay-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-xl bg-clay-50 border border-clay-200 p-4 text-sm text-clay-700"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-bone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-clay-600 focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2 transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-bone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-clay-600 focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2 transition-colors"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-clay-600 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-clay-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        By signing in, you agree to our{' '}
        <Link to="/terms" className="text-clay-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-clay-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}