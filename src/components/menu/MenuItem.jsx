import { useState, useRef, useEffect } from "react";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function MenuItem({
  item,
  onAdd,
  isAdmin = false,
  onEdit,
  onRemove,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <article className="relative rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:shadow-md">
      {/* Dish Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback image placeholder if image fails to load
            e.currentTarget.src = "/images/hero-food.jpg";
          }}
        />
      </div>

      <div className="p-4">
        {/* Title & Veg Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900 sm:text-base">
              {item.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </div>

          {item.isVeg && (
            <span
              className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 border-green-600 p-0.5"
              title="Vegetarian"
            >
              <span className="block h-2 w-2 rounded-full bg-green-600" />
            </span>
          )}
        </div>

        {/* Price & Action Button (Add to cart OR Admin Dropdown) */}
        <div className="mt-4 flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">
            ₹{item.price}
          </span>

          {isAdmin ? (
            /* Admin Dropdown Actions */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition shadow-sm active:scale-95 ${
                  dropdownOpen
                    ? "bg-amber-500 text-white ring-2 ring-amber-500/30"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
                aria-label={`Options for ${item.name}`}
                aria-expanded={dropdownOpen}
                title="Manage dish"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute bottom-full right-0 z-40 mb-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onEdit?.(item);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
                    role="menuitem"
                  >
                    <Pencil className="h-3.5 w-3.5 text-amber-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onRemove?.(item);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    role="menuitem"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Customer Add Button */
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
              aria-label={`Add ${item.name}`}
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}