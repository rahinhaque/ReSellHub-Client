"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const CATEGORIES = [
  { label: "Electronics", color: "#1D9E75" },
  { label: "Clothing & Fashion", color: "#378ADD" },
  { label: "Furniture & Home", color: "#D85A30" },
  { label: "Books & Media", color: "#D4537E" },
  { label: "Sports & Outdoors", color: "#BA7517" },
  { label: "Toys & Games", color: "#7F77DD" },
];

// ── Role-based dropdown menu items ───────────────────────────────────────────
const ROLE_MENU = {
  seller: [
    { href: "/dashboard/seller",              icon: "ti-layout-dashboard", label: "Dashboard Overview" },
    { href: "/dashboard/seller/add-product",  icon: "ti-circle-plus",      label: "Add Product" },
    { href: "/dashboard/seller/products",     icon: "ti-package",          label: "My Products" },
    { href: "/dashboard/seller/orders",       icon: "ti-clipboard-list",   label: "Manage Orders" },
    { href: "/dashboard/seller/analytics",    icon: "ti-chart-bar",        label: "Sales Analytics" },
  ],
  buyer: [
    { href: "/dashboard/buyer",               icon: "ti-layout-dashboard", label: "Dashboard Overview" },
    { href: "/dashboard/buyer/orders",        icon: "ti-shopping-bag",     label: "My Orders" },
    { href: "/dashboard/buyer/wishlist",      icon: "ti-heart",            label: "Wishlist" },
    { href: "/dashboard/buyer/payments",      icon: "ti-credit-card",      label: "Payment History" },
    { href: "/dashboard/buyer/profile",       icon: "ti-user-cog",         label: "Profile Management" },
  ],
  admin: [
    { href: "/dashboard/admin",               icon: "ti-layout-dashboard", label: "Dashboard Overview" },
    { href: "/dashboard/admin/users",         icon: "ti-users",            label: "Manage Users" },
    { href: "/dashboard/admin/products",      icon: "ti-package",          label: "Manage Products" },
    { href: "/dashboard/admin/orders",        icon: "ti-clipboard-list",   label: "Manage Orders" },
    { href: "/dashboard/admin/analytics",     icon: "ti-trending-up",      label: "Platform Analytics" },
    { href: "/dashboard/admin/monitoring",    icon: "ti-monitor",          label: "Admin Monitoring" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = user?.role ?? "buyer";

  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catRef = useRef(null);
  const profileRef = useRef(null);

  const dashboardHref =
    role === "seller" ? "/dashboard/seller"
    : role === "admin" ? "/dashboard/admin"
    : "/dashboard/buyer";

  const menuItems = ROLE_MENU[role] ?? ROLE_MENU.buyer;

  useEffect(() => {
    function handleClick(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setCatOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/",         label: "Home",     icon: "ti-home" },
    { href: "/products", label: "Products", icon: "ti-package" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <i className="ti ti-refresh-alert text-white text-lg" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-gray-900 text-[15px] tracking-tight">ReSell Hub</span>
            <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">marketplace</span>
          </div>
        </Link>

        {/* ── Center nav (desktop) ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href) ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i className={`ti ${icon} text-base`} aria-hidden="true" />
              {label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative" ref={catRef}>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="true"
            >
              <i className="ti ti-category text-base" aria-hidden="true" />
              Categories
              <i className={`ti ti-chevron-down text-xs text-gray-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50"
                  role="menu"
                >
                  {CATEGORIES.map(({ label, color }) => (
                    <Link
                      key={label}
                      href={`/products?category=${encodeURIComponent(label)}`}
                      className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      role="menuitem"
                      onClick={() => setCatOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      {label}
                    </Link>
                  ))}
                  <div className="my-1.5 mx-3 border-t border-gray-100" />
                  <Link
                    href="/products"
                    className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                    role="menuitem"
                    onClick={() => setCatOpen(false)}
                  >
                    <i className="ti ti-layout-grid text-base" aria-hidden="true" />
                    View all products
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dashboard link (logged-in only) */}
          {user && (
            <Link
              href={dashboardHref}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard") ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i className="ti ti-layout-dashboard text-base" aria-hidden="true" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Search (desktop/tablet) */}
          <Link
            href="/products?search="
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition-colors w-44"
            aria-label="Search products"
          >
            <i className="ti ti-search text-base" aria-hidden="true" />
            <span>Search products…</span>
          </Link>

          {/* Loading skeleton */}
          {isPending && <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />}

          {/* Logged in: Profile dropdown (desktop) */}
          {!isPending && user && (
            <div className="hidden md:block relative" ref={profileRef}>
              <button
                className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow hover:shadow-md hover:scale-105 transition-all overflow-hidden border-2 border-white ring-1 ring-gray-200"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Open user menu"
              >
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50"
                    role="menu"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <span className="text-xs text-gray-500 truncate block">{user.email}</span>
                        {user.role && (
                          <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            user.role === "seller" ? "bg-emerald-100 text-emerald-700"
                            : user.role === "admin" ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role-based nav items */}
                    {menuItems.map(({ href, icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm transition-colors ${
                          isActive(href) ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i className={`ti ${icon} text-base ${isActive(href) ? "text-emerald-600" : "text-gray-400"}`} aria-hidden="true" />
                        {label}
                      </Link>
                    ))}

                    <div className="my-1.5 mx-3 border-t border-gray-100" />

                    <Link
                      href="/settings"
                      className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm transition-colors ${
                        isActive("/settings") ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <i className="ti ti-settings text-base text-gray-400" aria-hidden="true" />
                      Settings
                    </Link>

                    <div className="my-1.5 mx-3 border-t border-gray-100" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      style={{ width: "calc(100% - 12px)" }}
                      role="menuitem"
                    >
                      <i className="ti ti-logout text-base" aria-hidden="true" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Guest: Log in + Register (desktop) */}
          {!isPending && !user && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />
              <Link href="/Login" className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Log in
              </Link>
              <Link href="/Register" className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile: Avatar (logged in) */}
          {!isPending && user && (
            <button
              className="md:hidden w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow overflow-hidden border-2 border-white ring-1 ring-gray-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : <span>{initials}</span>}
            </button>
          )}

          {/* Hamburger (mobile, guest) */}
          {!isPending && !user && (
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/30 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">

                {/* Nav links */}
                {navLinks.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(href) ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <i className={`ti ${icon} text-base`} aria-hidden="true" />
                    {label}
                  </Link>
                ))}

                {/* Role-based dashboard links (mobile) */}
                {user && (
                  <>
                    <div className="pt-2 pb-1">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
                        {role === "admin" ? "Admin" : role === "seller" ? "Seller" : "My Account"}
                      </p>
                    </div>
                    {menuItems.map(({ href, icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive(href) ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <i className={`ti ${icon} text-base`} aria-hidden="true" />
                        {label}
                      </Link>
                    ))}
                  </>
                )}

                {/* Categories */}
                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map(({ label, color }) => (
                      <Link
                        key={label}
                        href={`/products?category=${encodeURIComponent(label)}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* User section */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="ti ti-logout text-base" aria-hidden="true" />
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link href="/Login" className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                      Log in
                    </Link>
                    <Link href="/Register" className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
