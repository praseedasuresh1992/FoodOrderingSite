import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../components/Button"
import { restaurantData } from "../data/restaurantData";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-food.jpg"
            alt={restaurantData.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-950/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-xl text-center">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-3xl">
              🍽️
            </div>
          </div>

          {/* Restaurant */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            {restaurantData.name}
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/70 sm:text-base">
            {restaurantData.description}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link to="/order">
              <Button className="w-full sm:w-auto">
                Start Ordering
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/home">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Our Story & Specials
              </Button>
            </Link>

          </div>

          {/* Bottom text */}
          <div className="mt-16">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">
              Scan, Order & Enjoy!
            </p>

            <p className="mt-3 text-xs text-white/30">
              Powered by SmartMenu OS
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}