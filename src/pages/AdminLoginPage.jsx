import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

import { restaurantData } from "../data/restaurantData";
import { adminLogin } from "../api/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      await adminLogin(username.trim(), password);
      /* On success the token is stored in sessionStorage by the service.
         Navigate to the admin dashboard.                                  */
      navigate("/adminProfile");
    } catch (err) {
      /* err.message is always a user-readable string from the service layer */
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-screen relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-950 text-white">

      {/* ── Background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/hero-food.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/80" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />
      </div>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div
        className="
          relative z-10
          mx-4
          w-full
          max-w-sm
          animate-[fadeUp_0.5s_ease-out_0.1s_both]
          rounded-2xl
          border border-white/10
          bg-slate-900/70
          p-8
          shadow-2xl
          backdrop-blur-md

          sm:max-w-md
          sm:p-10
        "
      >
        {/* ── Logo + title ─────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* Logo badge */}
          <div
            className="
              relative
              h-14 w-14
              overflow-hidden
              rounded-full
              p-[2px]

              sm:h-16 sm:w-16
            "
          >
            {/* Animated conic border */}
            <div
              className="
                absolute inset-[-100%]
                animate-[spin_1.5s_linear_infinite]
                bg-[conic-gradient(from_0deg,transparent_0deg,#88BDF2_80deg,transparent_160deg,#9B1313_220deg,transparent_300deg)]
              "
            />
            <div className="relative z-10 h-full w-full rounded-full bg-white p-[2px]">
              <img
                src="/images/logo.jpg"
                alt={`${restaurantData.name} logo`}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Heading */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              {restaurantData.name}
            </p>
            <h1 className="mt-1 flex items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Restricted access — authorised personnel only.
            </p>
          </div>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-wider text-white/60"
            >
          email
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="
                rounded-xl
                border border-white/15
                bg-white/5
                px-4 py-3
                text-sm text-white
                placeholder-white/30
                outline-none
                ring-0
                transition
                focus:border-amber-400/70
                focus:bg-white/10
                focus:ring-2
                focus:ring-amber-400/30
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-white/60"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border border-white/15
                  bg-white/5
                  px-4 py-3
                  pr-12
                  text-sm text-white
                  placeholder-white/30
                  outline-none
                  ring-0
                  transition
                  focus:border-amber-400/70
                  focus:bg-white/10
                  focus:ring-2
                  focus:ring-amber-400/30
                "
              />
              <button
                type="button"
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass((p) => !p)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  rounded-md
                  p-1
                  text-white/40
                  transition
                  hover:text-white/80
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-400/40
                "
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="
                flex items-start gap-2
                rounded-xl
                border border-red-500/30
                bg-red-500/10
                px-4 py-3
                text-sm text-red-300
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-1
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-amber-500
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              duration-300
              hover:bg-amber-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isLoading ? (
              <>
                {/* Spinner */}
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* ── Back link ────────────────────────────────────────────────── */}
        <p className="mt-6 text-center text-xs text-white/40">
          Not an admin?{" "}
          <a
            href="/"
            className="text-amber-400 underline-offset-2 hover:underline"
          >
            Back to site
          </a>
        </p>
      </div>

      {/* ── Inline keyframes (mirrors WelcomePage style) ───────────────── */}
      <style>{`
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </main>
  );
}

