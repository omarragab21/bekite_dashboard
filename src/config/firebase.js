import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

/**
 * Bekite Firebase Configuration
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCsRPofhQovyExbUYxHtrn9hZuG-ViU0tU",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "bekite-86b37.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "bekite-86b37",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "bekite-86b37.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "605103482642",
  appId: env.VITE_FIREBASE_APP_ID || "1:605103482642:web:19cc45f5de2621e540f5cb",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-PRYM1CWP17"
};

// Initialize Firebase app (avoid re-initialization if already initialized)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore database
export const db = getFirestore(app);

// Initialize Analytics conditionally (safe for SSR, testing, or unsupported environments)
export let analytics = null;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('[Firebase] Analytics initialized successfully (bekite-86b37)');
      } else {
        console.info('[Firebase] Analytics is not supported in this browser environment');
      }
    })
    .catch((err) => {
      console.warn('[Firebase] Failed to initialize Analytics:', err);
    });
}

export default app;
