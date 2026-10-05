import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useCartDrawerStore } from '../store/useCartDrawerStore.js'
import { useProductDetailStore } from '../store/useProductDetailStore.js'
import { formatPrice } from '../lib/formatPrice.js'
import CartIcon from '../components/CartIcon.jsx'

function SpecRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-bone-200 py-3.5">
      <dt className="text-xs tracking-[0.14em] text-stone-400 uppercase">{label}</dt>
      <dd className="text-right text-sm text-stone-700">{value}</dd>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { addItem, lastAddedId } = useCart()
  const openDrawer = useCartDrawerStore((state) => state.openDrawer)
  const navigate = useNavigate()

  // Add, then reveal the cart so the item just added can be seen.
  const handleAdd = () => {
    // Guard clause: the cart is stored per user, so an anonymous visitor has
    // nowhere to save this item. Send them to login first.
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    addItem(product)
    openDrawer()
  }

  const product = useProductDetailStore((state) => state.product)
  const loading = useProductDetailStore((state) => state.loading)
  const error = useProductDetailStore((state) => state.error)
  const attempt = useProductDetailStore((state) => state.attempt)
  const loadProduct = useProductDetailStore((state) => state.loadProduct)
  const retry = useProductDetailStore((state) => state.retry)

  useEffect(() => {
    const controller = new AbortController()

    loadProduct(id, controller.signal)

    return () => controller.abort()
  }, [id, attempt, loadProduct])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <Link
        to="/"
        className="group inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-clay-600"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          &larr;
        </span>
        Back to all products
      </Link>

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="mt-10 grid animate-pulse gap-12 lg:grid-cols-2 lg:gap-20"
        >
          <span className="sr-only">Loading product</span>
          <div className="aspect-square rounded-2xl bg-bone-100" />
          <div className="space-y-5">
            <div className="h-4 w-24 rounded bg-bone-100" />
            <div className="h-12 w-4/5 rounded bg-bone-100" />
            <div className="h-8 w-28 rounded bg-bone-100" />
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full rounded bg-bone-100" />
              <div className="h-3 w-full rounded bg-bone-100" />
              <div className="h-3 w-2/3 rounded bg-bone-100" />
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="mt-10 max-w-md rounded-2xl border border-clay-200 bg-clay-50 p-8">
          <h1 className="font-display text-2xl text-stone-900">Could not load this product</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-clay-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && product && (
        <article className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div className="overflow-hidden rounded-2xl bg-bone-100 ring-1 ring-bone-200">
            <img
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
              className="aspect-square w-full object-contain p-10 sm:p-14"
            />
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-stone-400 uppercase">
              {product.category}
            </p>

            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-stone-900 sm:text-5xl">
              {product.title}
            </h1>

            <p className="mt-6 text-3xl font-semibold tabular-nums text-clay-600">
              {formatPrice(product.price)}
            </p>

            <p className="mt-8 max-w-prose text-[15px] leading-relaxed text-stone-600">
              {product.description}
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-clay-600 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-700"
            >
              <CartIcon className="h-4 w-4" />
              {lastAddedId === product.id ? 'Added to cart' : 'Add to cart'}
            </button>

            <dl className="mt-12 border-t border-bone-200 pt-2">
              <SpecRow label="Brand" value={product.brand} />
              <SpecRow label="Rating" value={`${product.rating} / 5`} />
              <SpecRow label="Stock" value={product.stock} />
              <SpecRow label="Availability" value={product.availabilityStatus} />
              <SpecRow label="Shipping" value={product.shippingInformation} />
            </dl>
          </div>
        </article>
      )}
    </div>
  )
}
