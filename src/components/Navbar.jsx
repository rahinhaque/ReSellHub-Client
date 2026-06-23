"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Electronics", color: "#1D9E75" },
  { label: "Clothing & Fashion", color: "#378ADD" },
  { label: "Furniture & Home", color: "#D85A30" },
  { label: "Books & Media", color: "#D4537E" },
  { label: "Sports & Outdoors", color: "#BA7517" },
  { label: "Toys & Games", color: "#7F77DD" },
];

export default function Navbar({ session }) {
  const pathname = usePathname();
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const catRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const navLinks = [
    { href: "/", label: "Home", icon: "ti-home" },
    { href: "/products", label: "Products", icon: "ti-package" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <i
              className="ti ti-refresh-alert text-white text-lg"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-gray-900 text-[15px] tracking-tight">
              ReSell Hub
            </span>
            <span className="text-[10px] text-emerald-600 font-medium tracking-widest uppercase">
              marketplace
            </span>
          </div>
        </Link>

        {/* ── Center nav ── */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
              <i
                className={`ti ti-chevron-down text-xs text-gray-400 transition-transform duration-200 ${
                  catOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {catOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100"
                role="menu"
              >
                {CATEGORIES.map(({ label, color }) => (
                  <Link
                    key={label}
                    href={`/categories/${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                    onClick={() => setCatOpen(false)}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    {label}
                  </Link>
                ))}
                <div className="my-1.5 mx-3 border-t border-gray-100" />
                <Link
                  href="/categories"
                  className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                  role="menuitem"
                  onClick={() => setCatOpen(false)}
                >
                  <i
                    className="ti ti-layout-grid text-base"
                    aria-hidden="true"
                  />
                  View all categories
                </Link>
              </div>
            )}
          </div>

          {/* Dashboard — logged-in only */}
          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i
                className="ti ti-layout-dashboard text-base"
                aria-hidden="true"
              />
              Dashboard
            </Link>
          )}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <Link
            href="/products?search="
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition-colors w-44"
            aria-label="Search products"
          >
            <i className="ti ti-search text-base" aria-hidden="true" />
            <span>Search products…</span>
          </Link>

          {user ? (
            /* ── Profile dropdown ── */
            <div className="relative" ref={profileRef}>
              <button
                className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow hover:shadow-md hover:scale-105 transition-all overflow-hidden border-2 border-white ring-1 ring-gray-200"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Open user menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50"
                  role="menu"
                >
                  {/* User info header */}
                  <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <span className="text-xs text-gray-500 truncate block">
                      {user.email}
                    </span>
                  </div>

                  {[
                    { href: "/profile", icon: "ti-user", label: "My profile" },
                    {
                      href: "/dashboard/listings",
                      icon: "ti-package",
                      label: "My listings",
                    },
                    {
                      href: "/dashboard/orders",
                      icon: "ti-shopping-cart",
                      label: "My orders",
                    },
                    { href: "/saved", icon: "ti-heart", label: "Saved items" },
                  ].map(({ href, icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <i
                        className={`ti ${icon} text-base text-gray-400`}
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  ))}

                  <div className="my-1.5 mx-3 border-t border-gray-100" />

                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i
                      className="ti ti-settings text-base text-gray-400"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>

                  <div className="my-1.5 mx-3 border-t border-gray-100" />

                  <Link
                    href="/api/auth/sign-out"
                    className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    role="menuitem"
                  >
                    <i className="ti ti-logout text-base" aria-hidden="true" />
                    Log out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest buttons ── */
            <div className="flex items-center gap-2">
              <div className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
