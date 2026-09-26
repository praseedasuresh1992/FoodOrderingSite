import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Sparkles,
} from "lucide-react";

import {
  menuCategories,
  menuItems,
} from "../data/menuData";

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  // Existing cart drawer state
  const [showCart, setShowCart] = useState(false);

  // AI chat demo state
  const [showAIChat, setShowAIChat] = useState(false);

  /*
   * Table number from URL:
   * /order?table=12
   * Later this can come from QR code / backend.
   */
  const tableNumber =
    new URLSearchParams(window.location.search).get("table") ||
    "12";

const navigate=useNavigate();

  /* ================================
     FILTER MENU
  ================================= */

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "all" ||
        item.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  /* ================================
     ADD TO CART
  ================================= */

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

  /* ================================
     REMOVE ONE
  ================================= */

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

  /* ================================
     CART TOTAL
  ================================= */

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
    <div className="min-h-[100dvh] overflow-x-hidden bg-slate-50 text-slate-900">

      {/* =================================
          HEADER
      ================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="flex min-h-16 items-center justify-between gap-3 py-2 sm:min-h-[68px]">

            {/* Restaurant information */}

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight text-slate-900 sm:text-lg md:text-xl">
                Grand
                <span className="text-amber-500">
                  Azure
                </span>
              </h1>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 sm:text-xs">
                  Table
                </span>

                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 sm:px-2 sm:text-xs">
                  #{tableNumber}
                </span>
              </div>
            </div>

            {/* Home Button */}

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              aria-label="Home"
              title="Home"
              className="
                group
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-amber-200
                from-amber-400
                to-orange-500
                text-white
                shadow-md
                shadow-amber-500/20
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-lg
                hover:shadow-amber-500/30
                active:scale-95
                sm:h-11
                sm:w-11
              "
            >
              <span className="text-[22px] leading-none sm:text-[24px]">
                🏠
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* =================================
          RESPONSIVE BOTTOM NAVIGATION
      ================================== */}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">

        <div className="relative mx-auto flex h-[76px] w-full max-w-[720px] items-center justify-between px-10 sm:h-[90px] sm:px-20">

          {/* Cart */}

          <button
            type="button"
            onClick={() => setShowCart(true)}
            aria-label="Open Cart"
            className="
              relative
              flex
              min-w-[64px]
              flex-col
              items-center
              justify-center
              gap-1.5
              text-orange-400
              transition
              active:scale-95
              sm:gap-2
            "
          >
            <span className="relative">

              <ShoppingCart className="h-[27px] w-[27px] sm:h-[30px] sm:w-[30px]" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#244294]
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    ring-2
                    ring-white
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}

            </span>

            <span className="text-xs font-semibold sm:text-base">
              Cart
            </span>
          </button>

          {/* AI Menu */}

          <button
            type="button"
            onClick={() => setShowAIChat(true)}
            aria-label="Open AI Chat"
            className="
              absolute
              left-1/2
              top-0
              flex
              h-[68px]
              w-[68px]
              -translate-x-1/2
              -translate-y-[18px]
              items-center
              justify-center
              rounded-full
              border-[5px]
              border-white
              bg-orange-400
              shadow-[0_4px_20px_rgba(0,0,0,0.2)]
              transition
              active:scale-95
              sm:h-[78px]
              sm:w-[78px]
              sm:border-[6px]
              sm:-translate-y-[20px]
            "
          >
            <span className="text-[30px] leading-none sm:text-[36px]">
              🤖
            </span>
          </button>

          {/* Orders */}
<button
  type="button"
  onClick={() => {
    navigate("/orderDetails")}
  }
  aria-label="Orders"
  className="
    flex
    min-w-[64px]
    flex-col
    items-center
    justify-center
    gap-1.5
    text-gray-500
    transition
    active:scale-95
    sm:gap-2
  "
>
  <span className="text-[26px] leading-none sm:text-[30px]">
    📋
  </span>

  <span className="text-xs font-semibold sm:text-base">
    Orders
  </span>
</button>

        </div>
      </div>

      {/* =================================
          MAIN
      ================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          pb-28
          sm:px-4
          md:px-6
          lg:px-8
          lg:pb-32
        "
      >

        {/* =================================
            WELCOME
        ================================== */}

        <section
          className="
            py-5
            sm:py-6
            md:py-8
            lg:py-9
          "
        >
          <p className="text-xs text-slate-500 sm:text-sm">
            Welcome to Grand Azure
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-bold
              leading-tight
              text-slate-900
              sm:text-2xl
              md:text-3xl
            "
          >
            What would you like to eat?
          </h2>
        </section>

        {/* =================================
            SEARCH
        ================================== */}

        <div className="relative">

          <Search
            className="
              absolute
              left-3.5
              top-1/2
              h-[18px]
              w-[18px]
              -translate-y-1/2
              text-slate-400
              sm:left-4
              sm:h-5
              sm:w-5
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
              rounded-xl
              border
              border-slate-200
              bg-white
              py-3
              pl-10
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
              sm:rounded-2xl
              sm:py-3.5
              sm:pl-12
            "
          />

        </div>

        {/* =================================
            CATEGORIES
        ================================== */}

        <div
          className="
            mt-4
            -mx-3
            overflow-x-auto
            px-3
            pb-2
            scrollbar-none
            sm:-mx-4
            sm:px-4
            md:mt-5
            md:-mx-6
            md:px-6
            lg:mx-0
            lg:px-0
          "
        >
          <div className="flex min-w-max gap-2">

            <CategoryButton
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              All
            </CategoryButton>

            {menuCategories.map((category) => (
              <CategoryButton
                key={category.id}
                active={activeCategory === category.id}
                onClick={() =>
                  setActiveCategory(category.id)
                }
              >
                {category.name}
              </CategoryButton>
            ))}

          </div>
        </div>

        {/* =================================
            FOOD LIST
        ================================== */}

        <section className="mt-5 sm:mt-6 md:mt-8">

          {/* Section heading */}

          <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">

            <h3
              className="
                min-w-0
                truncate
                text-base
                font-bold
                text-slate-900
                sm:text-lg
                md:text-xl
              "
            >
              {activeCategory === "all"
                ? "All Dishes"
                : menuCategories.find(
                    (category) =>
                      category.id === activeCategory
                  )?.name}
            </h3>

            <span className="shrink-0 text-[11px] text-slate-500 sm:text-xs">
              {filteredItems.length} items
            </span>

          </div>

          {/* Responsive food layout */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:gap-4
              md:grid-cols-2
              md:gap-4
              xl:grid-cols-3
              xl:gap-5
            "
          >
            {filteredItems.map((item) => (
              <OrderFoodCard
                key={item.id}
                item={item}
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>

          {/* Empty state */}

          {filteredItems.length === 0 && (
            <div
              className="
                rounded-2xl
                bg-white
                px-5
                py-12
                text-center
                shadow-sm
                ring-1
                ring-slate-100
                sm:py-16
              "
            >
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

      {/* =================================
          BOTTOM CART
      ================================== */}

      {cartCount > 0 && (
        <div
          className="
            fixed
            bottom-[76px]
            left-0
            right-0
            z-40
            border-t
            border-slate-200
            bg-white/95
            p-2.5
            shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
            backdrop-blur-md
            sm:bottom-[90px]
            sm:p-3
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              px-0.5
              sm:px-1
              md:px-2
            "
          >

            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="
                flex
                w-full
                items-center
                justify-between
                gap-3
                rounded-xl
                bg-slate-900
                px-3.5
                py-3
                text-white
                transition
                active:scale-[0.99]
                sm:rounded-2xl
                sm:px-5
                sm:py-3.5
                hover:bg-slate-800
              "
            >

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-500
                    sm:h-9
                    sm:w-9
                  "
                >
                  <ShoppingCart className="h-4 w-4" />
                </div>

                <div className="min-w-0 text-left">

                  <p className="text-[10px] text-white/60 sm:text-xs">
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "item"
                      : "items"}
                  </p>

                  <p className="truncate text-xs font-semibold sm:text-sm">
                    View Cart
                  </p>

                </div>

              </div>

              <span className="shrink-0 text-sm font-bold sm:text-base">
                ₹{cartTotal}
              </span>

            </button>

          </div>
        </div>
      )}

      {/* =================================
          CART DRAWER
      ================================== */}

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

      {/* =================================
          AI CHAT DEMO MODAL
      ================================== */}

      {showAIChat && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowAIChat(false)}
        >
          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={() => setShowAIChat(false)}
              aria-label="Close AI Chat"
              className="
                absolute
                right-3
                top-3
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-xl
                text-white
                transition
                hover:bg-black/80
                active:scale-95
              "
            >
              ×
            </button>

            {/* AI Header */}

            <div className="bg-orange-400 px-5 py-4 text-white">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-2xl
                  "
                >
                  🤖
                </div>

                <div>

                  <h3 className="text-lg font-bold">
                    Azure AI Assistant
                  </h3>

                  <p className="text-sm text-white/90">
                    How can I help you today?
                  </p>

                </div>

              </div>

            </div>

            {/* Chat Demo */}

            <div className="space-y-4 bg-slate-50 p-5">

              {/* AI message */}

              <div className="flex items-start gap-2">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-400
                    text-sm
                  "
                >
                  🤖
                </div>

                <div
                  className="
                    max-w-[80%]
                    rounded-2xl
                    rounded-tl-sm
                    bg-white
                    px-4
                    py-3
                    shadow-sm
                  "
                >
                  <p className="text-sm text-gray-700">
                    Hi! 👋 What would you like to
                    order today?
                  </p>
                </div>

              </div>

              {/* User message */}

              <div className="flex justify-end">

                <div
                  className="
                    max-w-[80%]
                    rounded-2xl
                    rounded-tr-sm
                    bg-[#244294]
                    px-4
                    py-3
                    text-white
                  "
                >
                  <p className="text-sm">
                    I want something spicy.
                  </p>
                </div>

              </div>

              {/* AI response */}

              <div className="flex items-start gap-2">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-orange-400
                    text-sm
                  "
                >
                  🤖
                </div>

                <div
                  className="
                    max-w-[80%]
                    rounded-2xl
                    rounded-tl-sm
                    bg-white
                    px-4
                    py-3
                    shadow-sm
                  "
                >
                  <p className="text-sm text-gray-700">
                    Great choice! 🌶️ I recommend
                    our spicy chicken dishes.
                    Would you like me to show you
                    the options?
                  </p>
                </div>

              </div>

            </div>

            {/* Demo Input */}

            <div
              className="
                flex
                items-center
                gap-2
                border-t
                border-gray-200
                bg-white
                p-4
              "
            >

              <input
                type="text"
                placeholder="Ask AI anything..."
                disabled
                className="
                  flex-1
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  outline-none
                "
              />

              <button
                type="button"
                disabled
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-400
                  text-white
                  opacity-80
                "
              >
                ↑
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* =========================================
   CATEGORY BUTTON
========================================= */

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
        shrink-0
        rounded-full
        px-4
        py-2.5
        text-xs
        font-semibold
        whitespace-nowrap
        transition
        active:scale-95
        sm:px-5
        sm:text-sm
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

/* =========================================
   FOOD CARD
========================================= */

function OrderFoodCard({
  item,
  onAdd,
}) {
  return (
    <article
      className="
        flex
        min-w-0
        gap-3
        rounded-2xl
        bg-white
        p-2.5
        shadow-sm
        ring-1
        ring-slate-100
        sm:p-3
      "
    >

      {/* Food image */}

      <div
        className="
          relative
          h-[104px]
          w-[104px]
          shrink-0
          overflow-hidden
          rounded-xl
          min-[375px]:h-28
          min-[375px]:w-28
          sm:h-32
          sm:w-32
          md:h-32
          md:w-32
        "
      >

        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition
            duration-300
            hover:scale-105
          "
        />

        {item.isPopular && (
          <span
            className="
              absolute
              left-1.5
              top-1.5
              rounded-full
              bg-amber-500
              px-1.5
              py-1
              text-[8px]
              font-bold
              text-white
              sm:px-2
              sm:text-[9px]
            "
          >
            Popular
          </span>
        )}

      </div>

      {/* Content */}

      <div className="flex min-w-0 flex-1 flex-col">

        <div className="min-w-0">

          {/* Name */}

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

            {/* Veg indicator */}

            <span
              className={`
                h-2.5
                w-2.5
                shrink-0
                rounded-full
                sm:h-3
                sm:w-3
                ${
                  item.isVeg
                    ? "bg-green-600"
                    : "bg-red-600"
                }
              `}
            />

            <h3
              className="
                min-w-0
                truncate
                text-xs
                font-bold
                text-slate-900
                sm:text-base
              "
            >
              {item.name}
            </h3>

          </div>

          {/* Description */}

          <p
            className="
              mt-1
              line-clamp-2
              text-[10px]
              leading-4
              text-slate-500
              sm:text-sm
              sm:leading-5
            "
          >
            {item.description}
          </p>

        </div>

        {/* Price + Add */}

        <div
          className="
            mt-auto
            flex
            items-end
            justify-between
            gap-2
            pt-2
          "
        >

          <p
            className="
              shrink-0
              text-sm
              font-bold
              text-slate-900
              sm:text-base
            "
          >
            ₹{item.price}
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="
              flex
              h-8
              shrink-0
              items-center
              gap-1
              rounded-full
              bg-amber-500
              px-3
              text-[10px]
              font-bold
              text-white
              transition
              hover:bg-amber-600
              active:scale-95
              sm:h-9
              sm:gap-1.5
              sm:px-4
              sm:text-xs
            "
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add
          </button>

        </div>

      </div>
    </article>
  );
}

/* =========================================
   CART DRAWER
========================================= */

function CartDrawer({
  cart,
  total,
  tableNumber,
  onClose,
  onAdd,
  onDecrease,
  onClear,
}) {
  const gst = total * 0.05;
  const grandTotal = total + gst;

  return (
    <div className="fixed inset-0 z-[60] bg-[#f5f6f8]">

      {/* ================================
          HEADER
      ================================= */}
{/* =================================
    HEADER
================================== */}
<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
  <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
    <div className="flex min-h-16 items-center justify-between gap-4 py-2 sm:min-h-[68px]">

  {/* Restaurant information */}
<div className="w-auto max-w-[55%] min-w-0 sm:max-w-[65%] md:max-w-[70%] lg:max-w-[75%]">
  <h1
    className="
      truncate
      text-base
      font-bold
      leading-tight
      text-slate-900
      sm:text-lg
      md:text-xl
      lg:text-2xl
      
    "
  >
    Grand
    <span className="text-amber-500">Azure</span>
  </h1>

  <div className="mt-1 flex items-center gap-1.5">
    <span className="text-[11px] text-slate-500 sm:text-xs">
      Table
    </span>

    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 sm:px-2 sm:text-xs">
      #{tableNumber}
    </span>
  </div>
</div>

      {/* Home Button */}
      <button
        type="button"
        onClick={() => {
          window.location.href = "/";
        }}
        aria-label="Home"
        title="Home"
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-amber-200
          text-white
          shadow-md
          shadow-amber-500/20
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-lg
          hover:shadow-amber-500/30
          active:scale-95
          sm:h-11
          sm:w-11
        "
      >
        <span className="text-[22px] leading-none sm:text-[24px]">
          🏠
        </span>
      </button>

    </div>
  </div>
</header>

      {/* ================================
          CONTENT
      ================================= */}
      <div
        className="
          mx-auto
          h-[calc(100dvh-92px)]
          w-full
          max-w-3xl
          overflow-y-auto
          px-4
          pb-8
          pt-7
          sm:px-8
        "
      >

        {/* Table information */}
        <div className="mb-4 text-sm text-slate-500">
          Table #{tableNumber}
        </div>

        {/* ================================
            CLEAR ENTIRE CART
        ================================= */}
        {cart.length > 0 && (
          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="
                flex
                items-center
                gap-2
                text-base
                font-semibold
                text-red-500
                transition
                hover:text-red-600
                active:scale-95
              "
            >
              🗑️
              <span>Clear Entire Cart</span>
            </button>
          </div>
        )}

        {/* ================================
            CART ITEMS
        ================================= */}
        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">🛒</div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add some delicious dishes to continue.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="
                mt-6
                rounded-2xl
                bg-amber-500
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-amber-600
                active:scale-95
              "
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="
                    rounded-3xl
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-6
                  "
                >

                  {/* Item information */}
                  <div className="flex min-w-0 items-start gap-4">

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="
                        h-16
                        w-16
                        shrink-0
                        rounded-xl
                        object-cover
                        sm:h-20
                        sm:w-20
                      "
                    />

                    {/* Name + quantity */}
                    <div className="min-w-0 flex-1">

                      <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-base text-slate-500">
                        ₹{item.price} × {item.quantity}
                      </p>

                      {/* Quantity controls */}
                      <div className="mt-3 flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() => onDecrease(item.id)}
                          aria-label={`Decrease ${item.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-slate-700
                            transition
                            hover:bg-slate-200
                            active:scale-95
                          "
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-7 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => onAdd(item)}
                          aria-label={`Increase ${item.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-amber-500
                            text-white
                            transition
                            hover:bg-amber-600
                            active:scale-95
                          "
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                      </div>

                    </div>

                    {/* Item total */}
                    <p className="shrink-0 text-lg font-bold text-slate-900 sm:text-xl">
                      ₹{item.price * item.quantity}
                    </p>

                  </div>

                  {/* ================================
                      SPECIAL INSTRUCTIONS
                  ================================= */}
                  <textarea
                    placeholder="Any special instructions? (e.g., extra spicy, no onions)"
                    className="
                      mt-5
                      min-h-[66px]
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-3.5
                      py-3
                      text-sm
                      text-slate-700
                      outline-none
                      transition
                      placeholder:text-slate-500
                      focus:border-amber-400
                      focus:ring-2
                      focus:ring-amber-400/20
                      sm:text-base
                    "
                  />

                </div>
              ))}

            </div>

            {/* ================================
                PRICE SUMMARY
            ================================= */}
            <div
              className="
                mt-8
                rounded-3xl
                bg-white
                p-6
                shadow-sm
                sm:p-7
              "
            >

              <div className="flex items-center justify-between">
                <span className="text-base text-slate-600 sm:text-lg">
                  Subtotal
                </span>

                <span className="text-base text-slate-600 sm:text-lg">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base text-slate-600 sm:text-lg">
                  GST (5%)
                </span>

                <span className="text-base text-slate-600 sm:text-lg">
                  ₹{gst.toFixed(2)}
                </span>
              </div>

              {/* Divider */}
              <div className="my-5 border-t-[8px] border-dotted border-slate-900" />

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

            </div>

            {/* ================================
                ACTION BUTTONS
            ================================= */}
            <div className="mt-8 space-y-4">

              {/* Show waiter */}
              <button
                type="button"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#244294]
                  py-5
                  text-lg
                  font-bold
                  text-white
                  shadow-md
                  shadow-[#244294]/20
                  transition
                  hover:bg-[#1f397f]
                  active:scale-[0.99]
                "
              >
                <span>Show Waiter</span>
                <span>👀</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#20c65a]
                  py-5
                  text-lg
                  font-bold
                  text-white
                  shadow-md
                  shadow-green-500/20
                  transition
                  hover:bg-[#1db954]
                  active:scale-[0.99]
                "
              >
                <span>Send Order to WhatsApp</span>
                <span>💬</span>
              </button>

            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </>
        )}

      </div>
    </div>
  );
}