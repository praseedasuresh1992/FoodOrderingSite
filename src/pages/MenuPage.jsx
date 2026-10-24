import { useMemo, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Plus,
  X,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Pencil,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import { createCategory } from "../api/category";

import Header from "../components/layout/Header";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import MenuItem from "../components/menu/MenuItem";

import { menuCategories, menuItems } from "../data/menuData";
import { getAdminToken } from "../api/auth";

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Determine if admin mode is active (via stored admin token or query/state parameter)
  const hasToken = Boolean(getAdminToken());
  const isAdminParam =
    searchParams.get("admin") === "true" || Boolean(location.state?.fromAdmin);
  const isAdmin = hasToken || isAdminParam;

  // Dynamic Categories and Items state
  const [categories, setCategories] = useState(menuCategories);
  const [items, setItems] = useState(menuItems);

  // Filters state
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showVegOnly, setShowVegOnly] = useState(false);

  // Modal State: Add Category
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catIsActive, setCatIsActive] = useState(true);
  const [catError, setCatError] = useState("");

  // Modal State: Edit Dish
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsVeg, setEditIsVeg] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesVeg = !showVegOnly || item.isVeg;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [items, activeCategory, search, showVegOnly]);

  const handleAdd = (item) => {
    console.log("Add to cart:", item);
    showToast(`Added "${item.name}" to cart!`);
  };

  // ── Category Handlers ──────────────────────────────────────────────────────
  const handleOpenCategoryModal = () => {
    setCatName("");
    setCatDescription("");
    setCatIsActive(true);
    setCatError("");
    setIsAddCategoryOpen(true);
  };

 
const handleSaveCategory = async (e) => {
  e.preventDefault();

  const trimmedName = catName.trim();

  if (!trimmedName) {
    setCatError("Please enter a category name.");
    return;
  }

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    setCatError("Please enter a valid category name.");
    return;
  }

  if (
    categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() ||
        category.slug === slug
    )
  ) {
    setCatError("A category with this name already exists.");
    return;
  }

  try {
    setCatError("");

    const categoryData = {
      name: trimmedName,
      slug,
      description: catDescription.trim(),
      image: "",
      isActive: catIsActive,
    };

    // Call the backend API
    const response = await createCategory(categoryData);

    // Use the category returned by MongoDB
    const savedCategory = response.category;

    if (!savedCategory) {
      throw new Error("Category was created, but no category data was returned.");
    }

    // Update the UI after the API succeeds
    const newCategory = {
      ...savedCategory,
      id: savedCategory._id,
    };

    setCategories((prev) => [...prev, newCategory]);

    setIsAddCategoryOpen(false);
    setCatName("");
    setCatDescription("");
    setCatIsActive(true);

    if (savedCategory.isActive) {
      setActiveCategory(savedCategory._id);
    }

    showToast(`Category "${savedCategory.name}" created successfully!`);
  } catch (error) {
    setCatError(error.message || "Failed to create category.");
  }
};


  // ── Item Actions: Edit & Remove ───────────────────────────────────────────
  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditIsVeg(item.isVeg);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPrice) {
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              name: editName.trim(),
              price: Number(editPrice),
              category: editCategory,
              description: editDescription.trim(),
              isVeg: editIsVeg,
            }
          : i
      )
    );

    const updatedDishName = editName.trim();
    setEditingItem(null);
    showToast(`"${updatedDishName}" updated successfully!`);
  };

  const handleRemoveItem = (item) => {
    if (window.confirm(`Are you sure you want to remove "${item.name}" from the menu?`)) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast(`Removed "${item.name}" from menu.`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* ── Admin Management Mode Banner ─────────────────────────────────── */}
      {isAdmin && (
        <aside
          aria-label="Admin Catalogue Mode"
          className="sticky top-16 z-30 border-b border-amber-500/20 bg-slate-950 px-4 py-2.5 text-white shadow-md backdrop-blur-md"
        >
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="font-semibold text-white">
                  Menu Catalogue Control
                </span>
                <span className="hidden rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 sm:inline-block">
                  Admin Active
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCategoryModal}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Category</span>
                </button>

                <Link
                  to="/adminProfile"
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Admin Profile</span>
                </Link>
              </div>
            </div>
          </Container>
        </aside>
      )}

      {/* ── Toast Notification ───────────────────────────────────────────── */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 sm:text-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main>
        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/images/hero-food.jpg"
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          </div>

          <Container className="relative z-10">
            <div className="mx-auto max-w-3xl text-center text-white">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-sm">
                {isAdmin ? "Catalogue Management" : "Our Menu"}
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {isAdmin ? "Manage Restaurant" : "Taste Something"}
                <span className="block text-amber-400">
                  {isAdmin ? "Menu & Categories" : "Extraordinary"}
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-white/70 sm:text-base sm:leading-7">
                {isAdmin
                  ? "Update dishes, adjust prices, and add new categories with instant live preview."
                  : "Explore our carefully crafted selection of dishes, prepared with fresh ingredients and authentic flavors."}
              </p>
            </div>
          </Container>
        </section>

        {/* ── Menu Section ────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-16 lg:py-20">
          <Container>
            <SectionTitle
              subtitle={isAdmin ? "Live Catalogue" : "Discover"}
              title={isAdmin ? "Menu Items & Categories" : "Explore Our Menu"}
              description={
                isAdmin
                  ? "Click the options on any dish to edit or remove it, or add new categories using the plus button."
                  : "Choose from our selection of freshly prepared dishes."
              }
            />

            {/* ── Search & Veg Filter Bar ───────────────────────────────── */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Box */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search dishes by name or description..."
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Veg Only Filter */}
              <button
                type="button"
                onClick={() => setShowVegOnly(!showVegOnly)}
                className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition shadow-sm ${
                  showVegOnly
                    ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${
                    showVegOnly ? "bg-green-600" : "bg-slate-300"
                  }`}
                />
                Vegetarian Only
              </button>
            </div>

            {/* ── Categories Bar + Admin Add Button ─────────────────────── */}
            <div className="mb-10 overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-2">
                {/* "All" Tab */}
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    activeCategory === "all"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({items.length})
                </button>

                {/* Dynamic Category List */}
                {categories.map((category) => {
                  const count = items.filter(
                    (i) => i.category === category.id
                  ).length;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        activeCategory === category.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`text-xs ${
                          activeCategory === category.id
                            ? "text-white/70"
                            : "text-slate-400"
                        }`}
                      >
                        ({count})
                      </span>
                    </button>
                  );
                })}

                {/* ── Admin "+" Button to Add Category ──────────────────── */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleOpenCategoryModal}
                    title="Add New Category"
                    aria-label="Add New Category"
                    className="group ml-1 flex h-10 items-center gap-1.5 rounded-full border-2 border-dashed border-amber-500 bg-amber-50/70 px-4 text-xs font-bold text-amber-700 shadow-sm transition hover:border-amber-600 hover:bg-amber-100 active:scale-95"
                  >
                    <Plus className="h-4 w-4 transition group-hover:rotate-90 duration-200" />
                    <span>Add Category</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Food Items Grid ───────────────────────────────────────── */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAdd={handleAdd}
                    isAdmin={isAdmin}
                    onEdit={handleStartEdit}
                    onRemove={handleRemoveItem}
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
                  Try changing your search keywords or active category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setShowVegOnly(false);
                  }}
                  className="mt-5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </Container>
        </section>
      </main>

      {/* ── Modal: Add New Category ──────────────────────────────────────── */}
      {isAddCategoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAddCategoryOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl animate-in zoom-in-95 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-bold sm:text-xl">
                    Add New Category
                  </h3>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Define a new menu group for restaurant dishes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {catError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {catError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="cat-name-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/60"
                >
                  Category Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  autoFocus
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (catError) setCatError("");
                  }}
                  placeholder="e.g. Desserts, Mocktails, Tandoori"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-400/80 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="cat-desc-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/60"
                >
                  Description
                </label>
                <textarea
                  id="cat-desc-input"
                  rows={3}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Briefly describe what dishes belong to this category..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-400/80 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                    Category Status
                  </span>
                  <span className="text-[11px] text-white/50">
                    {catIsActive
                      ? "Active (Visible in menu filter)"
                      : "Inactive (Hidden from public)"}
                  </span>
                </div>

                {/* Modern Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={catIsActive}
                  onClick={() => setCatIsActive((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    catIsActive ? "bg-amber-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      catIsActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition hover:bg-amber-600 active:scale-95"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Dish ─────────────────────────────────────────────── */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl animate-in zoom-in-95 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold sm:text-xl">Edit Dish</h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close edit modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/80 focus:bg-white/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/80 focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/80"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/80 focus:bg-white/10"
                />
              </div>

              {/* Vegetarian Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Vegetarian Dish
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={editIsVeg}
                  onClick={() => setEditIsVeg((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    editIsVeg ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      editIsVeg ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition hover:bg-amber-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
