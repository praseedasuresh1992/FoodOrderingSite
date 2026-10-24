import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Clock,
  MapPin,
  Utensils,
  ShoppingBag,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  ExternalLink,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { restaurantData } from "../data/restaurantData";
import { menuItems } from "../data/menuData";
import {
  getAdminProfile,
  getAdminUser,
  getAdminToken,
  adminLogout,
} from "../api/auth";

export default function AdminProfilePage() {
  const navigate = useNavigate();

  // Authentication & Profile state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "credentials" | "restaurant"

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(restaurantData.phone);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  const isAuthenticated = Boolean(getAdminToken());

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        // Fallback to locally stored user while or if backend is loading
        const cached = getAdminUser();
        if (cached) {
          setProfile(cached);
          setName(cached.name || "Administrator");
          setEmail(cached.email || "admin@grandazure.com");
        }

        const data = await getAdminProfile();
        if (data) {
          const user = data.admin || data.user || data;
          setProfile(user);
          setName(user.name || "Administrator");
          setEmail(user.email || "admin@grandazure.com");
        }
      } catch (err) {
        console.warn("Could not fetch remote profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    try {
      await adminLogout();
    } catch (err) {
      console.warn("Logout error:", err);
    }
    navigate("/login");
  }

  function handleProfileSave(e) {
    e.preventDefault();
    const updated = {
      ...profile,
      name,
      email,
      phone,
    };
    setProfile(updated);
    sessionStorage.setItem("adminUser", JSON.stringify(updated));
    setIsEditing(false);
    setProfileSavedMsg("Profile information updated successfully.");
    setTimeout(() => setProfileSavedMsg(""), 3500);
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    setIsUpdatingPassword(true);
    // Simulate updating password
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordStatus({
        type: "success",
        message: "Password changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus(null), 4000);
    }, 700);
  }

  // Fallback state if user visits /adminProfile without logging in
  if (!loading && !isAuthenticated) {
    return (
      <main className="relative flex min-h-[100dvh] w-full items-center justify-center bg-slate-950 p-4 text-white">
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-sm text-white/60">
            Please log in with your administrator credentials to access the
            management profile.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Sign In to Admin
            </Link>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100">
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">
                Grand <span className="text-amber-400">Azure</span>
              </span>
            </Link>
            <span className="hidden rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-400 ring-1 ring-inset ring-amber-500/20 sm:inline-block">
              Admin Portal
            </span>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/order"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
              Customer View
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ───────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Hero Profile Card ───────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* User Info with Avatar */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar with spinning glowing ring */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full p-[2px] sm:h-24 sm:w-24">
                <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#F59E0B_90deg,transparent_180deg,#88BDF2_270deg,transparent_360deg)]" />
                <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-3xl font-bold text-amber-400 shadow-inner">
                  {name ? name.charAt(0).toUpperCase() : "A"}
                </div>
              </div>

              {/* Name & Role details */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {name || "Administrator"}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/60 sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    {profile?.role || "Super Administrator"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-white/40" />
                    {email || "admin@grandazure.com"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-white/40" />
                    {restaurantData.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Switch Tabs / Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "overview"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Profile Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("credentials")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "credentials"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Security & Password
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("restaurant")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "restaurant"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Restaurant Info
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Menu Items
                </span>
                <Utensils className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {menuItems.length}
              </p>
              <p className="text-[11px] text-white/40">Active in catalogue</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-medium uppercase tracking-wider">
                  System Role
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-lg font-bold text-white">Full Access</p>
              <p className="text-[11px] text-white/40">Read & Write privileges</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Session
                </span>
                <Clock className="h-4 w-4 text-sky-400" />
              </div>
              <p className="mt-2 text-lg font-bold text-white">Active</p>
              <p className="text-[11px] text-white/40">JWT Token Authenticated</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between text-white/50">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Fast Orders
                </span>
                <ShoppingBag className="h-4 w-4 text-purple-400" />
              </div>
              <p className="mt-2 text-lg font-bold text-white">Enabled</p>
              <p className="text-[11px] text-white/40">Live Table Monitoring</p>
            </div>
          </div>
        </section>

        {/* ── Tab Content ─────────────────────────────────────────────── */}
        <div className="mt-8">
          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW & PERSONAL INFO                                 */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Profile Details Card */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md lg:col-span-2 sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                      Personal Information
                    </h2>
                    <p className="text-xs text-white/50">
                      Manage your administrator identity and communication channels.
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {profileSavedMsg && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{profileSavedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        Full Name
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60 focus:bg-white/10 disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60 focus:bg-white/10 disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60 focus:bg-white/10 disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                        Admin Role
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile?.role || "Super Administrator"}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 outline-none"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5"
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
                  )}
                </form>
              </div>

              {/* Quick Navigation Cards */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                  <h3 className="text-base font-bold text-white">
                    Quick Operations
                  </h3>
                  <p className="mt-1 text-xs text-white/50">
                    Jump directly to restaurant tools.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <Link
                      to="/menu?admin=true"
                      state={{ fromAdmin: true }}
                      className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3.5 transition hover:border-amber-400/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                          <Utensils className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-amber-400">
                            Menu Catalogue
                          </p>
                          <p className="text-[11px] text-white/40">
                            {menuItems.length} dishes listed
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                    </Link>

                    <Link
                      to="/orderDetails"
                      className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3.5 transition hover:border-amber-400/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-emerald-400">
                            Live Order Timeline
                          </p>
                          <p className="text-[11px] text-white/40">
                            Kitchen & serving status
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                    </Link>

                    <Link
                      to="/order?table=1"
                      className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3.5 transition hover:border-amber-400/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-sky-400">
                            Table Simulator
                          </p>
                          <p className="text-[11px] text-white/40">
                            Test customer QR order
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white" />
                    </Link>
                  </div>
                </div>

                {/* System Info Card */}
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                  <h3 className="text-sm font-bold text-white">System Security</h3>
                  <div className="mt-3 space-y-2 text-xs text-white/60">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>Auth Type</span>
                      <span className="font-semibold text-white">JWT Bearer</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>Storage</span>
                      <span className="font-semibold text-white">SessionStorage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Gateway</span>
                      <span className="font-semibold text-emerald-400">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CREDENTIALS & PASSWORD                                  */}
          {/* ============================================================== */}
          {activeTab === "credentials" && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Change Password
                  </h2>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Update your administrator credentials to keep your portal secure.
                </p>
              </div>

              {passwordStatus && (
                <div
                  className={`mt-6 flex items-start gap-2.5 rounded-2xl p-4 text-xs font-medium ${
                    passwordStatus.type === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {passwordStatus.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/70 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/70 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/70 focus:bg-white/10 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:opacity-60"
                  >
                    {isUpdatingPassword ? "Updating Password…" : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: RESTAURANT OVERVIEW                                     */}
          {/* ============================================================== */}
          {activeTab === "restaurant" && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* General Details */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Building2 className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">
                    Restaurant Profile
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Restaurant Name
                    </span>
                    <p className="mt-0.5 text-base font-bold text-white">
                      {restaurantData.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Tagline
                    </span>
                    <p className="mt-0.5 text-sm text-white/80">
                      {restaurantData.tagline}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Address
                    </span>
                    <p className="mt-0.5 flex items-start gap-1.5 text-sm text-white/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {restaurantData.address}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Contact Phone
                    </span>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
                      <Phone className="h-4 w-4 text-amber-400" />
                      {restaurantData.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Support Email
                    </span>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
                      <Mail className="h-4 w-4 text-amber-400" />
                      {restaurantData.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Opening Hours Schedule */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Opening Hours</h2>
                </div>

                <div className="mt-6 divide-y divide-white/5">
                  {Object.entries(restaurantData.openingHours || {}).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
                      >
                        <span className="font-semibold capitalize text-white/80">
                          {day}
                        </span>
                        <span className="rounded-md bg-white/5 px-2.5 py-1 text-white/60">
                          {hours}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

