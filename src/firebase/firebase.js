import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ======================================================
// FIREBASE CONFIGURATION
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyAqMaVszSpp94YHka8cD-dsOPNsN4OET8U",
  authDomain: "santosh-portfolio-project.firebaseapp.com",
  projectId: "santosh-portfolio-project",
  storageBucket: "santosh-portfolio-project.firebasestorage.app",
  messagingSenderId: "928923298001",
  appId: "1:928923298001:web:2b9eb69d30f45599bd7df0",
};

// ======================================================
// INITIALIZE FIREBASE (Prevent duplicate initialization)
// ======================================================

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================

export const auth = getAuth(app);

// ======================================================
// FIRESTORE DATABASE
// ======================================================

export const db = getFirestore(app);

// ======================================================
// FIREBASE STORAGE (Used for Resume PDF storage)
// ======================================================

export const storage = getStorage(app);

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default app;