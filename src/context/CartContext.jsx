import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuth } from './AuthContext.jsx'

// The cart lives in Firestore at:
//   users/{userId}/cart/{productId}
// One document per product. Using the product id as the document id means the
// same product can never create a duplicate entry - we just bump its quantity.

const CartContext = createContext(null)

// How long the "Added" feedback stays on the button. The timer is not render
// state, so it lives outside the component rather than triggering re-renders.
const ADDED_FEEDBACK_MS = 1600
let addedTimer = null

export function CartProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid

  // Signed-out users have no cart to show. Deriving this during render instead
  // of resetting it inside the effect keeps the two in step without a
  // setState-in-effect pass.
  const [signedInItems, setSignedInItems] = useState([])
  const [error, setError] = useState(null)
  const [lastAddedId, setLastAddedId] = useState(null)

  // A stable empty array, so the signed-out value keeps the same reference
  // across renders instead of looking like a brand new array every time.
  const noItems = useMemo(() => [], [])

  const items = uid ? signedInItems : noItems
  // While the listener is first attaching there is nothing to show yet. Firestore
  // calls the listener as soon as it has data, so this flips on its own.
  const loading = uid && signedInItems.length === 0 && !error

  // Real-time read. onSnapshot keeps the listener open, so Firestore pushes a
  // fresh snapshot the moment the cart changes - on this device or any other.
  useEffect(() => {
    if (!uid) return undefined

    const cartCollection = collection(db, 'users', uid, 'cart')

    const unsubscribe = onSnapshot(
      cartCollection,
      (snapshot) => {
        const nextItems = snapshot.docs
          .map((cartDoc) => ({ id: cartDoc.id, ...cartDoc.data() }))
          .sort((a, b) => a.productId - b.productId)

        setSignedInItems(nextItems)
        setError(null)
      },
      (snapshotError) => {
        // Usually a Firestore rules problem, so surface it instead of silently
        // showing an empty cart.
        console.error('Cart listener failed:', snapshotError)
        setError(snapshotError)
      },
    )

    return unsubscribe
  }, [uid])

  // Guard clause: never write to a cart without a signed-in user.
  const addItem = useCallback(
    async (product) => {
      if (!uid) return false

      const itemRef = doc(db, 'users', uid, 'cart', String(product.id))
      const existing = await getDoc(itemRef)

      if (existing.exists()) {
        // Already in the cart, so raise the quantity instead of adding a
        // second document for the same product.
        await updateDoc(itemRef, {
          quantity: increment(1),
          updatedAt: serverTimestamp(),
        })
      } else {
        await setDoc(
          itemRef,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )
      }

      setLastAddedId(product.id)
      clearTimeout(addedTimer)
      addedTimer = setTimeout(() => setLastAddedId(null), ADDED_FEEDBACK_MS)
      return true
    },
    [uid],
  )

  const incrementItem = useCallback(
    async (productId) => {
      if (!uid) return
      await updateDoc(doc(db, 'users', uid, 'cart', String(productId)), {
        quantity: increment(1),
        updatedAt: serverTimestamp(),
      })
    },
    [uid],
  )

  const decrementItem = useCallback(
    async (productId) => {
      if (!uid) return

      const itemRef = doc(db, 'users', uid, 'cart', String(productId))
      const existing = await getDoc(itemRef)
      if (!existing.exists()) return

      // Dropping to zero removes the line entirely rather than showing "0".
      if (existing.data().quantity <= 1) {
        await deleteDoc(itemRef)
        return
      }

      await updateDoc(itemRef, {
        quantity: increment(-1),
        updatedAt: serverTimestamp(),
      })
    },
    [uid],
  )

  const removeItem = useCallback(
    async (productId) => {
      if (!uid) return
      await deleteDoc(doc(db, 'users', uid, 'cart', String(productId)))
    },
    [uid],
  )

  // One batched write instead of a separate delete per line.
  const clearCart = useCallback(async () => {
    if (!uid) return

    const batch = writeBatch(db)
    for (const item of items) {
      batch.delete(doc(db, 'users', uid, 'cart', item.id))
    }
    await batch.commit()
  }, [uid, items])

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      lastAddedId,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      isEmpty: items.length === 0,
    }),
    [
      items,
      loading,
      error,
      lastAddedId,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }

  return context
}