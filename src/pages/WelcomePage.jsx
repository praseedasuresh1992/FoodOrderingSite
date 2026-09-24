import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import Button from "../components/Button";
import { restaurantData } from "../data/restaurantData";

export default function WelcomePage() {
  const introRef = useRef(null);
  const measured = useRef(false);
  const [introShift, setIntroShift] = useState(null);

  /*
    Intro animation
    ---------------
    The "Welcome" heading starts in the exact centre of the screen and glides
    to wherever the layout places it. Instead of hard-coding left/top values
    per breakpoint, we measure the real position once (before first paint) so
    it stays correct on every screen size, orientation and font size.
  */
  useLayoutEffect(() => {
    if (measured.current) return;
    measured.current = true;

    const el = introRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const rect = el.getBoundingClientRect();

    setIntroShift({
      x: window.innerWidth / 2 - (rect.left + rect.width / 2),
      y: window.innerHeight / 2 - (rect.top + rect.height / 2),
    });
  }, []);

  return (
    <main className="bg-slate-950 text-white">
      {/* welcome-screen = full viewport height that also works with mobile browser bars */}
      <section className="welcome-screen relative flex flex-col overflow-hidden">

        {/* ================= BACKGROUND ================= */}
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/images/hero-food.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-slate-950/70" />

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/90" />
        </div>

        {/* ================= PAGE SHELL =================
            Normal document flow: header -> content -> footer.
            Nothing is absolutely positioned, so nothing can overlap,
            and the page simply scrolls on very short screens. */}
        <div className="welcome-shell relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">

          {/* ================= LOGO ================= */}
          <header className="flex justify-end">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full p-[2px] sm:h-16 sm:w-16 md:h-[72px] md:w-[72px] lg:h-20 lg:w-20">
              {/* Animated border */}
              <div className="absolute inset-[-100%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#88BDF2_80deg,transparent_160deg,#9B1313_220deg,transparent_300deg)]" />

              {/* Logo */}
              <div className="relative z-10 h-full w-full rounded-full bg-white p-[2px]">
                <img
                  src="/images/logo.jpg"
                  alt={`${restaurantData.name} logo`}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* ================= WELCOME CONTENT ================= */}
          <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12">
            <div className="mx-auto w-full max-w-sm text-center sm:mx-0 sm:max-w-md sm:text-left md:max-w-lg lg:max-w-xl">

              {/* Intro block (this is the part that glides in from the centre) */}
              <div
                ref={introRef}
                style={
                  introShift
                    ? {
                        "--intro-x": `${introShift.x}px`,
                        "--intro-y": `${introShift.y}px`,
                      }
                    : undefined
                }
                className={`mx-auto w-fit sm:mx-0 ${
                  introShift
                    ? "animate-[welcomeMove_2.2s_ease-in-out_0.4s_both]"
                    : ""
                }`}
              >
                {/* Welcome label */}
                <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3 sm:justify-start">
                  <Sparkles className="h-4 w-4 text-[#88BDF2] sm:h-5 sm:w-5" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#88BDF2] sm:text-xs md:text-sm">
                    Welcome
                  </span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl font-bold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                  Welcome
                </h1>
              </div>

              {/* ================= PREMIUM CONTENT ================= */}
              <div className="mt-4 opacity-0 animate-[fadeUp_0.9s_ease-out_2.3s_forwards] sm:mt-5 md:mt-6">
                <p className="text-lg font-semibold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
                  You are our
                  <span className="block text-[#88BDF2]">
                    Premium Customer
                  </span>
                </p>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/70 sm:mx-0 sm:mt-3 md:text-base md:leading-7">
                  Enjoy an exclusive dining experience and discover
                  something delicious today.
                </p>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="mt-6 flex w-full flex-col gap-3 opacity-0 animate-[fadeUp_0.9s_ease-out_2.7s_forwards] sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap md:mt-8">
                {/* Start Ordering */}
                <Link to="/order" className="w-full sm:w-auto">
                  <Button className="min-h-[48px] w-full animate-[attentionPulse_1.8s_ease-in-out_3.7s_infinite] sm:w-auto">
                    Start Ordering
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                {/* Story */}
                <Link to="/home" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="min-h-[48px] w-full sm:w-auto"
                  >
                    Our Story & Specials
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM DESCRIPTION ================= */}
          <footer className="mx-auto w-full max-w-sm pt-2 text-center opacity-0 animate-[fadeUp_1s_ease-out_2.9s_forwards] sm:max-w-md md:max-w-2xl lg:max-w-3xl">
            {/* Restaurant name */}
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#88BDF2] sm:mb-2 sm:text-xs sm:tracking-[0.25em]">
              {restaurantData.name}
            </p>

            {/* Description */}
            <p className="text-xs leading-5 text-white/65 sm:text-sm sm:leading-6 md:leading-7 lg:text-base">
              {restaurantData.description}
            </p>

            {/* Bottom text */}
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/50 sm:mt-3 sm:text-xs sm:tracking-[0.2em]">
              Scan, Order & Enjoy!
            </p>
          </footer>
        </div>
      </section>

      {/* ================= STYLES & ANIMATIONS ================= */}
      <style>
        {`
          /* Full viewport height, with fallbacks for older browsers
             and mobile browsers whose address bar changes the height */
          .welcome-screen {
            min-height: 100vh;
            min-height: 100svh;
          }

          /* Mobile-first padding that also respects notches / home bars.
             (Needs viewport-fit=cover in index.html to take effect.) */
          .welcome-shell {
            --pad: 1rem;
            padding-top: max(var(--pad), env(safe-area-inset-top));
            padding-right: max(var(--pad), env(safe-area-inset-right));
            padding-bottom: max(var(--pad), env(safe-area-inset-bottom));
            padding-left: max(var(--pad), env(safe-area-inset-left));
          }

          @media (min-width: 640px)  { .welcome-shell { --pad: 1.5rem; } }
          @media (min-width: 768px)  { .welcome-shell { --pad: 2rem; } }
          @media (min-width: 1024px) { .welcome-shell { --pad: 3rem; } }
          @media (min-width: 1280px) { .welcome-shell { --pad: 4rem; } }

          /* Heading glides from the screen centre to its real position.
             --intro-x / --intro-y are measured in JS. */
          @keyframes welcomeMove {
            from {
              transform: translate3d(var(--intro-x, 0px), var(--intro-y, 0px), 0);
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes attentionPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-delay: 0ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}
      </style>
    </main>
  );
}