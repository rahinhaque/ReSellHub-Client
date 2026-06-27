"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  RefreshCw,
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
  Home,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { Monitor } from "lucide-react";

// ── Menu definitions ────────────────────────────────────────────────
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

// ── Role theme config ───────────────────────────────────────────────
const ROLE_THEME = {
  seller: {
    color: "emerald",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
    activeIcon: "text-emerald-600",
    activeDot: "bg-emerald-500",
    hover: "hover:bg-gray-50 hover:text-gray-800",
    avatarBg: "bg-emerald-500",
    statusDot: "bg-emerald-500",
  },
  buyer: {
    color: "blue",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    activeIcon: "text-blue-600",
    activeDot: "bg-blue-500",
    hover: "hover:bg-gray-50 hover:text-gray-800",
    avatarBg: "bg-blue-500",
    statusDot: "bg-blue-500",
  },
  admin: {
    color: "amber",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    activeBg: "bg-amber-50",
    activeText: "text-amber-700",
    activeIcon: "text-amber-600",
    activeDot: "bg-amber-500",
    hover: "hover:bg-gray-50 hover:text-gray-800",
    avatarBg: "bg-amber-500",
    statusDot: "bg-amber-500",
  },
};

// ── Component ───────────────────────────────────────────────────────
export default function DashboardSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role ?? "buyer";

  const menuItems =
    role === "seller"
      ? SELLER_MENU
      : role === "admin"
        ? ADMIN_MENU
        : BUYER_MENU;

  const theme = ROLE_THEME[role] ?? ROLE_THEME.buyer;

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    onClose?.();
    router.push("/");
    router.refresh();
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 h-screen shrink-0 border-r border-gray-100">
      <div className="h-full flex flex-col bg-white">
        {/* ── Brand ── */}
        <div className="px-5 py-[18px] flex items-center justify-between border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => onClose?.()}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <RefreshCw size={14} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-gray-900 text-[13.5px] tracking-tight">
                ReSell Hub
              </span>
              <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                marketplace
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close sidebar"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── User profile ── */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.image ? (
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <Image
                    src={user.image}
                    alt={user?.name || "User"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${theme.avatarBg}`}
                >
                  {initials}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${theme.statusDot}`}
              />
            </div>

            {/* Info */}
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-gray-900 text-[13px] font-semibold truncate leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-gray-400 text-[11px] truncate mt-0.5">
                {user?.email}
              </p>
              <span
                className={`inline-block mt-1.5 text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badge}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest px-2 pb-3">
            Menu
          </p>

          {menuItems.map(({ key, label, icon: Icon, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={() => onClose?.()}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                  ${
                    active
                      ? `${theme.activeBg} ${theme.activeText}`
                      : `text-gray-500 ${theme.hover}`
                  }`}
              >
                {/* Active bar */}
                {active && (
                  <span
                    className={`absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full ${theme.activeDot}`}
                  />
                )}

                {/* Icon */}
                <span className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Icon
                    size={16}
                    className={
                      active
                        ? theme.activeIcon
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  />
                </span>

                <span className="flex-1 truncate">{label}</span>

                {active && (
                  <ChevronRight
                    size={13}
                    className={`${theme.activeIcon} mr-3`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom actions ── */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all"
          >
            <span className="w-8 h-8 flex items-center justify-center shrink-0">
              <Home size={16} className="text-gray-400" />
            </span>
            Back to Site
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <span className="w-8 h-8 flex items-center justify-center shrink-0">
              <LogOut
                size={16}
                className="text-gray-400 group-hover:text-red-500"
              />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
