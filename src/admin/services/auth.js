import { auth } from "../../firebase/firebase";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ======================================================
// LOGIN
// ======================================================

export async function login(email, password) {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// ======================================================
// LOGOUT
// ======================================================

export async function logout() {
  return await signOut(auth);
}