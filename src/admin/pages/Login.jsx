import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { login } from "../services/auth";
import { auth } from "../../firebase/firebase";

import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const navigate = useNavigate();

  // ==================================================
  // STATE
  // ==================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");


  // ==================================================
  // CHECK EXISTING LOGIN SESSION
  // ==================================================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {

        if (user) {
          navigate("/admin/dashboard", {
            replace: true,
          });

          return;
        }

        setCheckingAuth(false);
      }
    );


    return () => unsubscribe();

  }, [navigate]);


  // ==================================================
  // LOGIN
  // ==================================================

  async function handleLogin(e) {

    e.preventDefault();

    setError("");


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }


    try {

      setLoading(true);


      await login(
        cleanEmail,
        password
      );


      // Firebase auth state will also update,
      // but navigating directly gives instant feedback.

      navigate("/admin/dashboard", {
        replace: true,
      });


    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      // ==================================================
      // USER-FRIENDLY FIREBASE ERRORS
      // ==================================================

      if (
        err?.code ===
        "auth/invalid-credential"
      ) {

        setError(
          "Invalid email or password."
        );

      } else if (
        err?.code ===
        "auth/invalid-email"
      ) {

        setError(
          "Please enter a valid email address."
        );

      } else if (
        err?.code ===
        "auth/user-disabled"
      ) {

        setError(
          "This account has been disabled."
        );

      } else if (
        err?.code ===
        "auth/too-many-requests"
      ) {

        setError(
          "Too many login attempts. Please try again later."
        );

      } else {

        setError(
          "Unable to login. Please check your credentials."
        );

      }


    } finally {

      setLoading(false);

    }
  }


  // ==================================================
  // AUTH CHECK LOADING
  // ==================================================

  if (checkingAuth) {

    return (
      <section className="min-h-screen bg-[#0B1120] flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-400">
            Checking authentication...
          </p>

        </div>

      </section>
    );
  }


  // ==================================================
  // LOGIN UI
  // ==================================================

  return (
    <section className="min-h-screen bg-[#0B1120] flex items-center justify-center relative overflow-hidden">


      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[120px]" />


      {/* ==================================================
          LOGIN CARD
      ================================================== */}

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl p-10 shadow-[0_0_60px_rgba(37,99,235,.15)]">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center">

          <h1 className="text-4xl font-black text-white">
            Admin Login
          </h1>

          <p className="mt-3 text-gray-400">
            Portfolio Management System
          </p>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >


          {/* ==================================================
              EMAIL
          ================================================== */}

          <div>

            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-[#111827]
                px-5
                py-4
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-blue-500
                transition
                disabled:opacity-50
              "
            />

          </div>


          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div>

            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>


            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-[#111827]
                  px-5
                  py-4
                  pr-14
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500
                  transition
                  disabled:opacity-50
                "
              />


              {/* SHOW / HIDE PASSWORD */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-2xl
                  text-gray-400
                  hover:text-blue-400
                  transition
                  disabled:opacity-50
                "
              >

                {showPassword ? (
                  <HiEyeOff />
                ) : (
                  <HiEye />
                )}

              </button>

            </div>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>

          )}


          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              !email.trim() ||
              !password
            }
            className="
              w-full
              py-4
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              transition
              font-semibold
              text-white
              shadow-lg
              shadow-blue-600/20
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>

      </div>

    </section>
  );
}