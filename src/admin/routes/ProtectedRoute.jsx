import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase/firebase";

export default function ProtectedRoute({ children }) {
  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // FIREBASE AUTH STATE
  // ==================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    // Cleanup Firebase listener
    return () => unsubscribe();
  }, []);

  // ==================================================
  // AUTH CHECK LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-10
              w-10
              rounded-full
              border-4
              border-slate-700
              border-t-blue-500
              animate-spin
            "
          />

          <p className="mt-4 text-sm text-gray-400">
            Checking authentication...
          </p>

        </div>
      </div>
    );
  }

  // ==================================================
  // NOT AUTHENTICATED
  // ==================================================

  if (!user) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // ==================================================
  // AUTHENTICATED
  // ==================================================

  return children;
}