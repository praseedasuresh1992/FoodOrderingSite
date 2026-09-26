import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Button from "../components/Button";
import { restaurantData } from "../data/restaurantData";

export default function WelcomePage() {
  const introRef = useRef(null);
  const measured = useRef(false);
  const [introShift, setIntroShift] = useState(null);

  /*
   * Welcome animation
   * "Welcome" starts from the exact center of the viewport and glides to
   * its resting spot: top-left, a little below the logo. The resting spot
   * is measured from the real, in-flow element (see markup below), so it
   * lands correctly at any screen size instead of relying on per-breakpoint
   * pixel guesses.
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
    <main className="h-[100dvh] overflow-hidden bg-slate-950 text-white">
      <section className="welcome-screen relative flex h-full w-full flex-col overflow-hidden">
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

        {/* ================= PAGE SHELL ================= */}
        <div className="welcome-shell relative z-10 mx-auto flex h-full min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
          {/* ================= HEADER: logo, then Welcome just below it ================= */}
          <header className="flex shrink-0 flex-col gap-1 sm:gap-2 md:gap-3">
            {/* Logo row */}
            <div className="flex justify-end">
              <div
                className="
                  logo-badge
                  relative
                  h-12
                  w-12
                  shrink-0
                  overflow-hidden
                  rounded-full
                  p-[2px]

                  sm:h-14
                  sm:w-14

                  md:h-16
                  md:w-16

                  lg:h-[72px]
                  lg:w-[72px]
                "
              >
                {/* Animated border */}
                <div
                  className="
                    absolute
                    inset-[-100%]
                    animate-[spin_1.5s_linear_infinite]
                    bg-[conic-gradient(from_0deg,transparent_0deg,#88BDF2_80deg,transparent_160deg,#9B1313_220deg,transparent_300deg)]
                  "
                />

                {/* Logo */}
                <div className="relative z-10 h-full w-full rounded-full bg-white p-[2px]">
                  <img
                    src="/images/logo.jpg"
                    alt={`${restaurantData.name} logo`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* "Welcome" resting spot — a little below the logo, left-aligned.
                This element IS the anchor: its natural position here is what
                gets measured above, and what the fly-in animation lands on. */}
            <h1
              ref={introRef}
              style={
                introShift
                  ? {
                      "--intro-x": `${introShift.x}px`,
                      "--intro-y": `${introShift.y}px`,
                    }
                  : undefined
              }
              className={`
                w-fit
                text-4xl
                font-bold
                leading-none
                tracking-tight

                sm:text-5xl

                md:text-6xl

                lg:text-7xl

                xl:text-8xl

                ${introShift ? "animate-[welcomeMove_1.1s_ease-in-out_0.2s_both]" : ""}
              `}
            >
              Welcome
            </h1>
          </header>

          {/* ================= RESTAURANT NAME =================
              Pinned right under the header — not inside the centered
              block below — so it stays at the top regardless of how
              that block is aligned. */}
              <div className="  h-5 ">
          <p
            className="
          
              shrink-0
              pt-25
              mx-auto
              text-center
              text-2xl
              font-bold
              uppercase
              tracking-[0.1em]
              opacity-0
              animate-[fadeUp_0.5s_ease-out_1.3s_forwards]

              sm:pb-4
              sm:text-2xl
              sm:tracking-[0.2em]

              md:text-3xl

              lg:text-4xl
            "
          >
            {restaurantData.name}
          </p>
          </div>

          {/* ================= CENTERED CONTENT =================
              Everything else fades in, centered both ways, on every
              screen size. */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2 sm:py-4 md:py-5">
            <div
              className="
                mx-auto
                w-full
                max-w-sm
                text-center

                sm:max-w-md

                md:max-w-lg

                lg:max-w-xl
              "
            >
              {/* ================= PREMIUM CONTENT ================= */}
              <div
                className="
                  opacity-0
                  animate-[fadeUp_0.5s_ease-out_1.3s_forwards]
                "
              >
                <p
                  className="
                    text-base
                    font-semibold
                    leading-tight
                    text-xl

                    sm:text-xl

                    md:text-2xl

                    lg:text-2xl
                  "
                >
                  Premium Customer
                </p>

                <p
                  className="
                    mx-auto
                    mt-1.5
                    max-w-sm
                    text-md
                    px-2
                    pb-5
                    pt-5
                    leading-5
                    text-white/70

                    sm:mt-2
                    sm:text-sm
                    sm:leading-6

                    md:text-base
                    md:leading-7
                  "
                >
                  Enjoy an exclusive dining experience and discover
                  something delicious today.
                </p>
              </div>

              {/* ================= BUTTONS ================= */}
              <div
                className="
                  mx-auto
                  mt-4
                  flex
                  w-full
                  flex-col
                  items-center
                  gap-7
                  opacity-0
                  animate-[fadeUp_0.5s_ease-out_1.55s_forwards]

                  sm:mt-5
                  sm:w-fit
                  sm:flex-row
                  sm:flex-wrap
                  sm:justify-center
                  sm:gap-3

                  pb-15

                  md:mt-6
                "
              >
                {/* Start Ordering */}
                <Link to="/order" className="w-full sm:w-auto">
                  <Button
                    className="
                      min-h-[44px]
                      w-3/4
                      animate-[attentionPulse_1.4s_ease-in-out_2.25s_infinite]

                      sm:min-h-[48px]
                      sm:w-auto
                    "
                  >
                    Start Ordering
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                {/* Story */}
                <Link to="/home" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="
                      min-h-[44px]
                      w-full

                      sm:min-h-[48px]
                      sm:w-auto
                    "
                  >
                    Our Story & Specials
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <footer
            className="
              mx-auto
              w-full
              max-w-sm
              shrink-0
              pt-1
              pb-5

              text-center
              opacity-0
              animate-[fadeUp_0.5s_ease-out_1.75s_forwards]

              sm:max-w-md
              sm:pt-2

              md:max-w-2xl

              lg:max-w-3xl
            "
          >
            {/* Description */}
            <p
              className="
                text-[10px]
                leading-4
                text-white/65

                sm:text-xs
                sm:leading-5

                md:text-sm
                md:leading-6

                lg:text-base
                lg:leading-7
              "
            >
              {restaurantData.description}
            </p>

            {/* Bottom text */}
            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-white/50

                sm:mt-2
                sm:text-[10px]
                sm:tracking-[0.2em]
              "
            >
              Scan, Order & Enjoy!
            </p>
          </footer>
        </div>
      </section>

      {/* ================= STYLES ================= */}
      <style>
        {`
          /*
           * Use dynamic viewport height.
           * This handles mobile browser address bars correctly.
           */
          .welcome-screen {
            height: 100dvh;
            min-height: 100dvh;
          }

          /*
           * Page padding, safe-area aware.
           */
          .welcome-shell {
            --pad: 0.75rem;

            padding-top: max(0.5rem, env(safe-area-inset-top));
            padding-right: max(var(--pad), env(safe-area-inset-right));
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
            padding-left: max(var(--pad), env(safe-area-inset-left));
          }

          @media (min-width: 640px) {
            .welcome-shell { --pad: 1.25rem; }
          }

          @media (min-width: 768px) {
            .welcome-shell { --pad: 1.5rem; }
          }

          @media (min-width: 1024px) {
            .welcome-shell { --pad: 2rem; }
          }

          @media (min-width: 1280px) {
            .welcome-shell { --pad: 3rem; }
          }

          /*
           * Welcome animation: fly in from viewport center, land in place.
           */
          @keyframes welcomeMove {
            from {
              transform: translate3d(var(--intro-x, 0px), var(--intro-y, 0px), 0);
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }

          /*
           * Fade-up animation for everything else.
           */
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(24px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /*
           * Button pulse
           */
          @keyframes attentionPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          /*
           * Short screens (e.g. landscape phones): tighten everything up
           * so nothing gets clipped by the fixed viewport height.
           */
          @media (max-height: 700px) {
            .welcome-shell {
              padding-top: 0.4rem;
              padding-bottom: 0.4rem;
            }

            .welcome-shell .logo-badge {
              width: 3rem;
              height: 3rem;
            }

            .welcome-shell header h1 {
              font-size: 2.5rem;
            }

            .welcome-shell footer {
              transform: scale(0.9);
              transform-origin: bottom center;
            }
          }

          @media (max-height: 600px) {
            .welcome-shell {
              padding-top: 0.25rem;
              padding-bottom: 0.25rem;
            }

            .welcome-shell header {
              gap: 0.25rem;
            }

            .welcome-shell .logo-badge {
              width: 2.5rem;
              height: 2.5rem;
            }

            .welcome-shell header h1 {
              font-size: 2.1rem;
            }

            .welcome-shell footer {
              display: none;
            }
          }

          /*
           * Reduced motion accessibility
           */
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