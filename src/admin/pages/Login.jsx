import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { login } from "../services/auth";
import { auth } from "../../firebase/firebase";

import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiShieldCheck,
  HiExclamationCircle,
} from "react-icons/hi";

// Shared input styling: responsive sizing + left icon space + autofill fix
// 2xl (1536px and up): larger, more professional sizing
const inputClass = `
  w-full
  rounded-xl
  border
  border-slate-700
  bg-[#111827]/80
  pl-10
  sm:pl-12
  2xl:pl-14
  pr-4
  py-3
  sm:py-3.5
  md:py-4
  text-sm
  sm:text-base
  2xl:text-lg
  text-white
  placeholder:text-gray-500
  outline-none
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-500/20
  transition
  disabled:opacity-50
  [&:-webkit-autofill]:shadow-[0_0_0_1000px_#111827_inset]
  [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]
`;

const iconClass = `
  pointer-events-none
  absolute
  left-4
  2xl:left-5
  top-1/2
  -translate-y-1/2
  text-base
  sm:text-xl
  2xl:text-2xl
  text-gray-500
  transition
  group-focus-within:text-blue-400
`;

// Shared style for the show/hide eye buttons (email + password)
const eyeBtnClass = `
  absolute
  right-2.5
  sm:right-3.5
  2xl:right-4
  top-1/2
  -translate-y-1/2
  p-2
  text-lg
  sm:text-2xl
  2xl:text-[26px]
  text-gray-400
  hover:text-blue-400
  transition
  disabled:opacity-50
  rounded-lg
`;

export default function Login() {
  const navigate = useNavigate();

  // ==================================================
  // STATE
  // ==================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Both fields are hidden by default. The eye button lets the admin
  // reveal them to check for typing mistakes.
  const [showEmail, setShowEmail] = useState(false);
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


    // BASIC VALIDATION

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


      // USER-FRIENDLY FIREBASE ERRORS

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
      <section className="min-h-screen min-h-[100dvh] bg-[#0B1120] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
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
    <section className="min-h-screen min-h-[100dvh] bg-[#0B1120] flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6 sm:py-12">


      {/* BACKGROUND GLOW */}

      <div className="absolute -top-24 -left-24 w-[260px] h-[260px] sm:-top-40 sm:-left-40 sm:w-[450px] sm:h-[450px] 2xl:-top-56 2xl:-left-56 2xl:w-[700px] 2xl:h-[700px] rounded-full bg-blue-600/20 blur-[90px] sm:blur-[120px] 2xl:blur-[160px]" />

      <div className="absolute bottom-0 right-0 w-[260px] h-[260px] sm:w-[450px] sm:h-[450px] 2xl:w-[700px] 2xl:h-[700px] rounded-full bg-cyan-500/20 blur-[90px] sm:blur-[120px] 2xl:blur-[160px]" />


      {/* LOGIN CARD */}

      <div className="relative z-10 w-full max-w-[400px] sm:max-w-md 2xl:max-w-[540px] rounded-2xl sm:rounded-3xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl p-5 sm:p-8 md:p-10 2xl:p-12 shadow-[0_0_60px_rgba(37,99,235,.15)]">

        {/* TOP ACCENT LINE */}

        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent 2xl:inset-x-12" />


        {/* HEADER */}

        <div className="text-center">

          <div className="mx-auto mb-3 sm:mb-5 2xl:mb-6 flex h-10 w-10 sm:h-14 sm:w-14 2xl:h-16 2xl:w-16 items-center justify-center rounded-xl sm:rounded-2xl border border-blue-500/20 bg-blue-500/10 text-xl sm:text-3xl 2xl:text-4xl text-blue-400">
            <HiShieldCheck />
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black text-white">
            Admin Login
          </h1>

          <p className="mt-1 sm:mt-3 2xl:mt-4 text-xs sm:text-base 2xl:text-lg text-gray-400">
            Portfolio Management System
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="mt-5 sm:mt-8 md:mt-9 2xl:mt-11 space-y-3.5 sm:space-y-5 2xl:space-y-6"
        >


          {/* EMAIL — hidden by default, eye button reveals it */}

          <div>

            <label className="block mb-1.5 sm:mb-2 2xl:mb-2.5 text-xs sm:text-sm 2xl:text-base font-medium text-gray-300">
              Email
            </label>

            <div className="group relative">

              <HiMail className={iconClass} />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                disabled={loading}
                className={`${inputClass} !pr-12 sm:!pr-14 2xl:!pr-16 ${
                  showEmail
                    ? ""
                    : "[-webkit-text-security:disc]"
                }`}
              />


              {/* SHOW / HIDE EMAIL */}

              <button
                type="button"
                onClick={() =>
                  setShowEmail(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showEmail
                    ? "Hide email"
                    : "Show email"
                }
                className={eyeBtnClass}
              >

                {showEmail ? (
                  <HiEyeOff />
                ) : (
                  <HiEye />
                )}

              </button>

            </div>

          </div>


          {/* PASSWORD */}

          <div>

            <label className="block mb-1.5 sm:mb-2 2xl:mb-2.5 text-xs sm:text-sm 2xl:text-base font-medium text-gray-300">
              Password
            </label>


            <div className="group relative">

              <HiLockClosed className={iconClass} />

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
                className={`${inputClass} !pr-12 sm:!pr-14 2xl:!pr-16`}
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
                className={eyeBtnClass}
              >

                {showPassword ? (
                  <HiEyeOff />
                ) : (
                  <HiEye />
                )}

              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 sm:px-4 sm:py-3 2xl:px-5 2xl:py-3.5"
            >

              <HiExclamationCircle className="mt-0.5 shrink-0 text-base sm:text-lg 2xl:text-xl text-red-400" />

              <p className="text-xs sm:text-sm 2xl:text-base text-red-400">
                {error}
              </p>

            </div>

          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              !email.trim() ||
              !password
            }
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              py-3
              sm:py-3.5
              md:py-4
              2xl:py-[18px]
              text-sm
              sm:text-base
              2xl:text-lg
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-blue-500
              hover:from-blue-500
              hover:to-blue-400
              active:scale-[0.98]
              transition
              font-semibold
              text-white
              shadow-lg
              shadow-blue-600/25
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:active:scale-100
            "
          >

            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>


        {/* FOOTER NOTE */}

        <p className="mt-4 sm:mt-6 2xl:mt-8 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs 2xl:text-sm text-gray-500">
          <HiLockClosed />
          Secure admin access only
        </p>

      </div>

    </section>
  );
}