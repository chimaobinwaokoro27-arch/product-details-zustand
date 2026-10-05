import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.'
      case 'auth/operation-not-allowed':
        return 'Email/password sign-up is not enabled. Please contact support.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 sm:px-8 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-stone-900 sm:text-5xl">
          Create an account
        </h1>
        <p className="mt-4 text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="text-clay-600 hover:underline">
            Sign in
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-bone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-clay-600 focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2 transition-colors"
            disabled={loading}
          />
          <p className="mt-1.5 text-xs text-stone-500">At least 6 characters</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-stone-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-bone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-clay-600 focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2 transition-colors"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-clay-600 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-clay-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        By creating an account, you agree to our{' '}
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