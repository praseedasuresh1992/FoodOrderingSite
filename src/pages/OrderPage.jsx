import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
} from "lucide-react";

import {
  menuCategories,
  menuItems,
} from "../data/menuData";

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);

  /*
   * For now table number is coming from the URL:
   *
   * /order?table=12
   *
   * Later this can come from QR code / backend.
   */
  const tableNumber =
    new URLSearchParams(window.location.search).get("table") ||
    "12";

  /* --------------------------------
     FILTER MENU
  -------------------------------- */

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "all" ||
        item.category === activeCategory;

      const searchMatch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  /* --------------------------------
     ADD TO CART
  -------------------------------- */

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  /* --------------------------------
     REMOVE ONE
  -------------------------------- */

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* --------------------------------
     CART TOTAL
  -------------------------------- */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ============================
          HEADER
      ============================ */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-5xl px-4">

          <div className="flex h-16 items-center justify-between">

            {/* Restaurant */}
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Grand
                <span className="text-amber-500">
                  Azure
                </span>
              </h1>

              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-xs text-slate-500">
                  Table
                </span>

                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  #{tableNumber}
                </span>
              </div>
            </div>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* ============================
          MAIN
      ============================ */}

      <main className="mx-auto max-w-5xl px-4 pb-28">

        {/* Welcome */}
        <section className="py-5">

          <p className="text-sm text-slate-500">
            Welcome to Grand Azure
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            What would you like to eat?
          </h2>

        </section>

        {/* ============================
            SEARCH
        ============================ */}

        <div className="relative">

          <Search
            className="
              absolute
              left-4
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search dishes..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              py-3.5
              pl-12
              pr-4
              text-sm
              text-slate-900
              shadow-sm
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-amber-500
              focus:ring-2
              focus:ring-amber-500/20
            "
          />

        </div>

        {/* ============================
            CATEGORIES
        ============================ */}

        <div className="mt-5 overflow-x-auto pb-2">

          <div className="flex min-w-max gap-2">

            <CategoryButton
              active={activeCategory === "all"}
              onClick={() =>
                setActiveCategory("all")
              }
            >
              All
            </CategoryButton>

            {menuCategories.map((category) => (
              <CategoryButton
                key={category.id}
                active={
                  activeCategory === category.id
                }
                onClick={() =>
                  setActiveCategory(category.id)
                }
              >
                {category.name}
              </CategoryButton>
            ))}

          </div>

        </div>

        {/* ============================
            FOOD LIST
        ============================ */}

        <section className="mt-6">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-lg font-bold text-slate-900">
              {activeCategory === "all"
                ? "All Dishes"
                : menuCategories.find(
                    (category) =>
                      category.id === activeCategory
                  )?.name}
            </h3>

            <span className="text-xs text-slate-500">
              {filteredItems.length} items
            </span>

          </div>

          <div className="space-y-3">

            {filteredItems.map((item) => (
              <OrderFoodCard
                key={item.id}
                item={item}
                onAdd={() => addToCart(item)}
              />
            ))}

          </div>

          {/* Empty */}
          {filteredItems.length === 0 && (
            <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm">

              <div className="text-4xl">
                🍽️
              </div>

              <h3 className="mt-3 font-semibold text-slate-900">
                No dishes found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try searching for another dish.
              </p>

            </div>
          )}

        </section>

      </main>

      {/* ============================
          BOTTOM CART
      ============================ */}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-3 shadow-[0_-5px_20px_rgba(0,0,0,0.08)]">

          <div className="mx-auto max-w-5xl">

            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                bg-slate-900
                px-5
                py-3.5
                text-white
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500">
                  <ShoppingCart className="h-4 w-4" />
                </div>

                <div className="text-left">
                  <p className="text-xs text-white/60">
                    {cartCount} items
                  </p>

                  <p className="text-sm font-semibold">
                    View Cart
                  </p>
                </div>

              </div>

              <span className="font-bold">
                ₹{cartTotal}
              </span>

            </button>

          </div>

        </div>
      )}

      {/* ============================
          CART DRAWER
      ============================ */}

      {showCart && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          tableNumber={tableNumber}
          onClose={() => setShowCart(false)}
          onAdd={addToCart}
          onDecrease={decreaseQuantity}
        />
      )}

    </div>
  );
}

/* ==================================
   CATEGORY BUTTON
================================== */

function CategoryButton({
  children,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-full
        px-5
        py-2.5
        text-sm
        font-semibold
        whitespace-nowrap
        transition
        ${
          active
            ? "bg-amber-500 text-white shadow-sm"
            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
        }
      `}
    >
      {children}
    </button>
  );
}

/* ==================================
   FOOD CARD
================================== */

function OrderFoodCard({
  item,
  onAdd,
}) {
  return (
    <article className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">

      {/* Food Image */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">

        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        {item.isPopular && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-1 text-[9px] font-bold text-white">
            Popular
          </span>
        )}

      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              {/* Veg indicator */}
              <span
                className={`
                  h-3
                  w-3
                  shrink-0
                  rounded-full
                  ${
                    item.isVeg
                      ? "bg-green-600"
                      : "bg-red-600"
                  }
                `}
              />

              <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                {item.name}
              </h3>

            </div>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
              {item.description}
            </p>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between pt-2">

          <p className="text-base font-bold text-slate-900">
            ₹{item.price}
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-full
              bg-amber-500
              px-4
              text-xs
              font-bold
              text-white
              transition
              hover:bg-amber-600
              active:scale-95
            "
          >
            <Plus className="h-4 w-4" />
            Add
          </button>

        </div>

      </div>

    </article>
  );
}

/* ==================================
   CART DRAWER
================================== */

function CartDrawer({
  cart,
  total,
  tableNumber,
  onClose,
  onAdd,
  onDecrease,
}) {
  return (
    <div className="fixed inset-0 z-50">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white sm:left-auto sm:top-0 sm:w-[420px] sm:rounded-none sm:rounded-l-3xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Cart
            </h2>

            <p className="text-xs text-slate-500">
              Table #{tableNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Items */}
        <div className="max-h-[55vh] overflow-y-auto p-5">

          {cart.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      ₹{item.price}
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          onDecrease(item.id)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-5 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onAdd(item)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>

                    </div>

                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5">

          <div className="mb-4 flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Total
            </span>

            <span className="text-xl font-bold text-slate-900">
              ₹{total}
            </span>

          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            className="
              w-full
              rounded-2xl
              bg-amber-500
              py-3.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-amber-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Proceed to Order
          </button>

        </div>

      </div>
    </div>
  );
}
