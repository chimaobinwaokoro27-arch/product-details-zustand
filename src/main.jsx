import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'
import App from './App.jsx'

// CartProvider sits inside AuthProvider because the cart is stored under the
// signed-in user's id, so it needs to know who is signed in before it listens.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)