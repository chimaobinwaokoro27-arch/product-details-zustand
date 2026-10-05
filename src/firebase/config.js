import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate that required config values are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId']
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key])

if (missingKeys.length > 0) {
  console.warn(
    `Firebase config missing required keys: ${missingKeys.join(', ')}. ` +
    'Please check your .env.local file.'
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app