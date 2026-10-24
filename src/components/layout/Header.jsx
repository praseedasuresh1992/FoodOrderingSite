import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShieldUser,
  Menu,
  X,
  UtensilsCrossed,
} from "lucide-react";
import Container from "../Container";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/menu?search=${encodeURIComponent(query)}`);
    setShowSearch(false);
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-2 py-2">

          {/* Logo: Full on desktop, compact on mobile */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Grand Azure Home"
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white sm:h-10 sm:w-10">
              <UtensilsCrossed className="h-5 w-5" />
            </div>

            <div className="leading-tight">
              <span className="whitespace-nowrap text-base font-bold text-slate-900 sm:text-xl">
                Grand <span className="text-amber-500">Azure</span>
              </span>

              <span className="hidden text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:block">
                Taste the Difference
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-semibold text-slate-700 transition hover:text-amber-500"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="relative hidden w-52 xl:block"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food or category..."
                aria-label="Search food or category"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Search Icon: Mobile and Tablet */}
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              aria-label={showSearch ? "Close search" : "Open search"}
              aria-expanded={showSearch}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-amber-50 hover:text-amber-600 sm:h-10 sm:w-10 xl:hidden"
            >
              {showSearch ? <X size={19} /> : <Search size={19} />}
            </button>

            {/* Admin Icon */}
            <Link
              to="/login"
              aria-label="Admin login"
              title="Admin Login"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 sm:h-10 sm:w-10"
            >
              <ShieldUser className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </Link>

            {/* Hamburger: Mobile and Tablet */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-800 transition hover:bg-slate-100 lg:hidden sm:h-10 sm:w-10"
            >
              {isOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Expandable Search on Small Screens */}
        {showSearch && (
          <form
            onSubmit={handleSearch}
            className="border-t border-slate-100 py-3 xl:hidden"
          >
            <div className="relative">
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items or categories..."
                aria-label="Search menu items or categories"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-base outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />

              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600"
              >
                <Search size={17} />
              </button>
            </div>
          </form>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-slate-200 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-600"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
