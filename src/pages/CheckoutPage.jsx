import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/formatPrice'
import { Link } from 'react-router-dom'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()

  const handlePlaceOrder = () => {
    alert(`Order placed for ${formatPrice(subtotal)}! Thank you for your purchase.`)
    clearCart()
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-20">
      <div className="mb-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-clay-600"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Back to shopping
        </Link>
      </div>

      <h1 className="font-display text-4xl tracking-tight text-stone-900 sm:text-5xl">
        Checkout
      </h1>

      <p className="mt-4 text-stone-600">
        Signed in as <strong className="text-stone-900">{user?.email}</strong>
      </p>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-stone-500">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-clay-600 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-clay-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-bone-200 bg-white">
            <div className="border-b border-bone-200 px-6 py-4">
              <h2 className="font-display text-xl text-stone-900">Order Summary</h2>
            </div>
            <ul className="divide-y divide-bone-200">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 px-6 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bone-100">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-stone-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-stone-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-bone-200 px-6 py-4">
              <div className="flex items-baseline justify-between text-lg font-semibold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="w-full rounded-full bg-clay-600 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-clay-700"
          >
            Place Order ({formatPrice(subtotal)})
          </button>

          <p className="text-center text-xs text-stone-500">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      )}
    </div>
  )
}