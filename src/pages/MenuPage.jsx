import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import MenuItem from "../components/menu/MenuItem";

import {
  menuCategories,
  menuItems,
} from "../data/menuData";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showVegOnly, setShowVegOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        item.category === activeCategory;

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesVeg =
        !showVegOnly || item.isVeg;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVeg
      );
    });
  }, [activeCategory, search, showVegOnly]);

  const handleAdd = (item) => {
    console.log("Add to :", item);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
          <div className="absolute inset-0">
            <img
              src="/images/hero-food.jpg"
              alt="Restaurant food"
              className="h-full w-full object-cover opacity-30"
            />

            <div className="absolute inset-0 bg-slate-950/70" />
          </div>

          <Container className="relative z-10">
            <div className="mx-auto max-w-3xl text-center text-white">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                Our Menu
              </p>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Taste Something
                <span className="block text-amber-400">
                  Extraordinary
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                Explore our carefully crafted selection of
                dishes, prepared with fresh ingredients and
                authentic flavors.
              </p>
            </div>
          </Container>
        </section>

        {/* Menu */}
        <section className="py-12 sm:py-16 lg:py-20">
          <Container>

            <SectionTitle
              subtitle="Discover"
              title="Explore Our Menu"
              description="Choose from our selection of freshly prepared dishes."
            />

            {/* Search + Filter */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search dishes..."
                  className="
                    w-full
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    py-3
                    pl-12
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-amber-500
                    focus:ring-2
                    focus:ring-amber-500/20
                  "
                />
              </div>

              {/* Veg Filter */}
              <button
                type="button"
                onClick={() =>
                  setShowVegOnly(!showVegOnly)
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    showVegOnly
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }
                `}
              >
                <span
                  className={`
                    h-3
                    w-3
                    rounded-full
                    ${
                      showVegOnly
                        ? "bg-green-600"
                        : "bg-slate-300"
                    }
                  `}
                />

                Vegetarian Only
              </button>
            </div>

            {/* Categories */}
            <div className="mb-10 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setActiveCategory("all")
                  }
                  className={`
                    rounded-full
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    transition
                    ${
                      activeCategory === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }
                  `}
                >
                  All
                </button>

                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category.id)
                    }
                    className={`
                      rounded-full
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      transition
                      ${
                        activeCategory === category.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}

              </div>
            </div>

            {/* Results */}
            {filteredItems.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {filteredItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <SlidersHorizontal className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  No dishes found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setShowVegOnly(false);
                  }}
                  className="mt-5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </Container>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
