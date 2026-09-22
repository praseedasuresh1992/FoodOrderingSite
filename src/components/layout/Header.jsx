import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "../Container";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Menu",
    path: "/menu",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">

          <Link
            to="/"
            className="text-xl font-bold text-slate-900"
          >
            Grand<span className="text-amber-500">Azure</span>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-slate-700 transition hover:text-amber-500"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/order"
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Order Now
            </Link>
          </nav>

          {/* Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-900 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        Mobile menu
        {isOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/order"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-lg bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Order Now
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}