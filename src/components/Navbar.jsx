"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  ClipboardList,
  BarChart2,
  ShoppingBag,
  Heart,
  CreditCard,
  UserCog,
  Users,
  TrendingUp,
  Monitor,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

// ── Role menus ────────────────────────────────────────────────────────────────
const SELLER_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard/seller",
  },
  {
    key: "add-product",
    label: "Add Product",
    icon: PackagePlus,
    href: "/dashboard/seller/add-product",
  },
  {
    key: "my-products",
    label: "My Products",
    icon: Package,
    href: "/dashboard/seller/products",
  },
  {
    key: "manage-orders",
    label: "Manage Orders",
    icon: ClipboardList,
    href: "/dashboard/seller/orders",
  },
  {
    key: "sales-analytics",
    label: "Sales Analytics",
    icon: BarChart2,
    href: "/dashboard/seller/analytics",
  },
];

const BUYER_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard/buyer",
  },
  {
    key: "my-orders",
    label: "My Orders",
    icon: ShoppingBag,
    href: "/dashboard/buyer/orders",
  },
  {
    key: "wishlist",
    label: "Wishlist",
    icon: Heart,
    href: "/dashboard/buyer/wishlist",
  },
  {
    key: "payment-history",
    label: "Payment History",
    icon: CreditCard,
    href: "/dashboard/buyer/payments",
  },
  {
    key: "profile",
    label: "Profile Management",
    icon: UserCog,
    href: "/dashboard/buyer/profile",
  },
];

const ADMIN_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard/admin",
  },
  {
    key: "manage-users",
    label: "Manage Users",
    icon: Users,
    href: "/dashboard/admin/users",
  },
  {
    key: "manage-products",
    label: "Manage Products",
    icon: Package,
    href: "/dashboard/admin/products",
  },
  {
    key: "manage-orders",
    label: "Manage Orders",
    icon: ClipboardList,
    href: "/dashboard/admin/orders",
  },
  {
    key: "platform-analytics",
    label: "Platform Analytics",
    icon: TrendingUp,
    href: "/dashboard/admin/analytics",
  },
  {
    key: "admin-monitoring",
    label: "Admin Monitoring",
    icon: Monitor,
    href: "/dashboard/admin/monitoring",
  },
];

const ROLE_BADGE = {
  admin: "bg-amber-100 text-amber-700",
  seller: "bg-emerald-100 text-emerald-700",
  buyer: "bg-blue-100 text-blue-700",
};

const CATEGORIES = [
  { label: "Electronics", color: "#1D9E75" },
  { label: "Clothing & Fashion", color: "#378ADD" },
  { label: "Furniture & Home", color: "#D85A30" },
  { label: "Books & Media", color: "#D4537E" },
  { label: "Sports & Outdoors", color: "#BA7517" },
  { label: "Toys & Games", color: "#7F77DD" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const catRef = useRef(null);
  const profileRef = useRef(null);

  const role = user?.role || "buyer";

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "seller"
        ? "/dashboard/seller"
        : "/dashboard/buyer";

  const roleMenu =
    role === "admin"
      ? ADMIN_MENU
      : role === "seller"
        ? SELLER_MENU
        : BUYER_MENU;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setCatOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <i className="ti ti-refresh-alert text-white text-lg" />
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
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home", icon: "ti-home" },
            { href: "/products", label: "Products", icon: "ti-package" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i className={`ti ${icon} text-base`} />
              {label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <i className="ti ti-category text-base" />
              Categories
              <i
                className={`ti ti-chevron-down text-xs text-gray-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
              />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                {CATEGORIES.map(({ label, color }) => (
                  <Link
                    key={label}
                    href={`/categories/${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                  onClick={() => setCatOpen(false)}
                >
                  <i className="ti ti-layout-grid text-base" />
                  View all categories
                </Link>
              </div>
            )}
          </div>

          {/* Dashboard link — logged in only */}
          {user && (
            <Link
              href={dashboardHref}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <i className="ti ti-layout-dashboard text-base" />
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
          >
            <i className="ti ti-search text-base" />
            <span>Search products…</span>
          </Link>

          {/* Loading */}
          {isPending && (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          )}

          {/* Profile dropdown */}
          {!isPending && user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow hover:shadow-md hover:scale-105 transition-all overflow-hidden border-2 border-white ring-1 ring-gray-200"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {/* ── User info header ── */}
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden ring-2 ring-emerald-100">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[role] || ROLE_BADGE.buyer}`}
                        >
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Role-based menu section ── */}
                  <div className="px-2 mb-1">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-1.5">
                      {role === "admin"
                        ? "Admin Panel"
                        : role === "seller"
                          ? "Seller Dashboard"
                          : "My Account"}
                    </p>
                    {roleMenu.map(({ key, label, icon: Icon, href }) => {
                      const active =
                        pathname === href ||
                        (href !== dashboardHref && pathname.startsWith(href));
                      return (
                        <Link
                          key={key}
                          href={href}
                          onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                            active
                              ? "bg-emerald-50 text-emerald-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon
                            size={15}
                            className={
                              active ? "text-emerald-600" : "text-gray-400"
                            }
                          />
                          {label}
                        </Link>
                      );
                    })}
                  </div>

                  {/* ── Footer actions ── */}
                  <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={15} className="text-gray-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut size={15} className="text-red-500" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guest */}
          {!isPending && !user && (
            <div className="flex items-center gap-2">
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <Link
                href="/Login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/Register"
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
