import { useNavigate, Link } from 'react-router-dom'
import { formatPrice } from '../lib/formatPrice.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useCartDrawerStore } from '../store/useCartDrawerStore.js'
import CartIcon from './CartIcon.jsx'

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth()
  const { addItem, lastAddedId } = useCart()
  const openDrawer = useCartDrawerStore((state) => state.openDrawer)
  const navigate = useNavigate()
  const justAdded = lastAddedId === product.id

  // Add, then reveal the cart so the item just added can be seen.
  const handleAdd = () => {
    // Guard clause: the cart belongs to a signed-in user, so send anyone else
    // to the login page instead of silently doing nothing.
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    addItem(product)
    openDrawer()
  }

  return (
    <article className="group relative flex flex-col">
      <div className="overflow-hidden rounded-2xl bg-bone-100 ring-1 ring-bone-200 transition-all duration-500 group-hover:ring-clay-200">
        <div className="aspect-square">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-10 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="line-clamp-1 text-[15px] font-medium text-stone-700 transition-colors group-hover:text-stone-900">
          {product.title}
        </h3>
        <p className="mt-1 text-xl font-semibold tabular-nums text-clay-600">
          {formatPrice(product.price)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.title} to cart`}
        className={`relative z-20 mt-4 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium transition-colors ${
          justAdded
            ? 'border-clay-600 bg-clay-600 text-white'
            : 'border-bone-200 text-stone-600 hover:border-clay-500 hover:text-clay-600'
        }`}
      >
        <CartIcon className="h-3.5 w-3.5" />
        {justAdded ? 'Added' : 'Add to cart'}
      </button>

      <Link
        to={`/products/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay-600"
      />
    </article>
  )
}