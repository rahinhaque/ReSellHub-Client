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
  ShieldCheck,
  TrendingUp,
  Home,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

// ── Menu definitions ────────────────────────────────────────────────
const SELLER_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "add-product",
    label: "Add Product",
    icon: PackagePlus,
    href: "/dashboard/add-product",
  },
  {
    key: "my-products",
    label: "My Products",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    key: "manage-orders",
    label: "Manage Orders",
    icon: ClipboardList,
    href: "/dashboard/orders",
  },
  {
    key: "sales-analytics",
    label: "Sales Analytics",
    icon: BarChart2,
    href: "/dashboard/analytics",
  },
];

const BUYER_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "my-orders",
    label: "My Orders",
    icon: ShoppingBag,
    href: "/dashboard/orders",
  },
  {
    key: "wishlist",
    label: "Wishlist",
    icon: Heart,
    href: "/dashboard/wishlist",
  },
  {
    key: "payment-history",
    label: "Payment History",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    key: "profile",
    label: "Profile Management",
    icon: UserCog,
    href: "/dashboard/profile",
  },
];

const ADMIN_MENU = [
  {
    key: "overview",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "manage-users",
    label: "Manage Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    key: "manage-products",
    label: "Manage Products",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    key: "manage-orders",
    label: "Manage Orders",
    icon: ClipboardList,
    href: "/dashboard/orders",
  },
  {
    key: "platform-analytics",
    label: "Platform Analytics",
    icon: TrendingUp,
    href: "/dashboard/analytics",
  },
];

// ── Role theme config ───────────────────────────────────────────────
const ROLE_THEME = {
  seller: {
    accent: "emerald",
    badge: "bg-emerald-500/20 text-emerald-400",
    hover: "hover:bg-emerald-500/10 hover:text-emerald-300",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    activeBg: "bg-emerald-500/20",
    activeText: "text-emerald-300",
    activeBorder: "border-l-2 border-emerald-500",
    ring: "ring-emerald-500/40",
  },
  buyer: {
    accent: "blue",
    badge: "bg-blue-500/20 text-blue-400",
    hover: "hover:bg-blue-500/10 hover:text-blue-300",
    iconBg: "bg-blue-500/15",
    iconText: "text-blue-400",
    activeBg: "bg-blue-500/20",
    activeText: "text-blue-300",
    activeBorder: "border-l-2 border-blue-500",
    ring: "ring-blue-500/40",
  },
  admin: {
    accent: "amber",
    badge: "bg-amber-500/20 text-amber-400",
    hover: "hover:bg-amber-500/10 hover:text-amber-300",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    activeBg: "bg-amber-500/20",
    activeText: "text-amber-300",
    activeBorder: "border-l-2 border-amber-500",
    ring: "ring-amber-500/40",
  },
};

// ── Component ───────────────────────────────────────────────────────
export default function DashboardSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role ?? "buyer"; // fallback to buyer

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

  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=059669&color=fff&bold=true`;

  return (
    <aside className="w-64 h-screen border-r border-white/5 shrink-0">
      <div className="h-full flex flex-col bg-gray-950/90 backdrop-blur-xl">
        {/* ── Brand ── */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => onClose?.()}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
              <RefreshCw size={15} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-[13px] tracking-tight">
                ReSell Hub
              </span>
              <span className="text-[9px] text-emerald-500 font-medium tracking-widest uppercase">
                marketplace
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── User profile ── */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full overflow-hidden border-2 border-white/10 ring-2 ${theme.ring} shrink-0`}
            >
              <Image
                src={avatarSrc}
                alt={user?.name || "User"}
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              <span
                className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badge}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-3 pb-3">
            Navigation
          </p>

          {menuItems.map(({ key, label, icon: Icon, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={() => onClose?.()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${
                    active
                      ? `${theme.activeBg} ${theme.activeText}`
                      : `text-gray-400 ${theme.hover}`
                  }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                  ${active ? theme.iconBg : "bg-white/5 group-hover:" + theme.iconBg}
                `}
                >
                  <Icon
                    size={16}
                    className={
                      active
                        ? theme.iconText
                        : `text-gray-500 group-hover:${theme.iconText}`
                    }
                  />
                </span>
                <span className="flex-1 truncate">{label}</span>
                {active && (
                  <ChevronRight size={14} className={theme.iconText} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom actions ── */}
        <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <Home size={15} />
            </span>
            Back to Site
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <LogOut size={15} />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
