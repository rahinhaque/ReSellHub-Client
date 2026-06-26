"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getBuyerSummary } from "@/lib/api/buyer/overview/data";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_CONFIG = {
  processing: {
    label: "Processing",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: RefreshCw,
  },
  pending: {
    label: "Pending",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 h-24"
          />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BuyerDashboardOverview() {
  const { data: session } = useSession();
  const user = session?.user;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetch = async () => {
      try {
        const data = await getBuyerSummary(user.email);
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user?.email]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <LayoutDashboard size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Overview</h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          {greeting()},{" "}
          <span className="text-gray-600 font-medium">
            {user?.name?.split(" ")[0] ?? "there"}
          </span>
          . Here's your activity summary.
        </p>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total orders */}
            <Link
              href="/dashboard/buyer/orders"
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-emerald-500" />
                </div>
                <ArrowRight
                  size={14}
                  className="text-gray-300 group-hover:text-emerald-400 transition-colors"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.totalOrders ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Total orders</p>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              href="/dashboard/buyer/wishlist"
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-red-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Heart size={18} className="text-red-400" />
                </div>
                <ArrowRight
                  size={14}
                  className="text-gray-300 group-hover:text-red-400 transition-colors"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.wishlistCount ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Saved to wishlist
                </p>
              </div>
            </Link>
          </div>

          {/* ── Recent purchases ── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-emerald-500" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Recent purchases
                </h2>
              </div>
              <Link
                href="/dashboard/buyer/orders"
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {!summary?.recentPurchases?.length ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag size={22} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">
                    No purchases yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your recent orders will appear here.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {summary.recentPurchases.map((order) => {
                  const statusKey = order.orderStatus || "processing";
                  const cfg =
                    STATUS_CONFIG[statusKey] || STATUS_CONFIG.processing;
                  const Icon = cfg.icon;

                  return (
                    <div
                      key={order._id?.toString()}
                      className="px-5 py-3.5 flex items-center gap-3"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-gray-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {order.productTitle || "Product"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-emerald-600">
                            ${Number(order.price).toLocaleString()}
                          </span>
                          <span className="text-gray-200 text-xs">·</span>
                          <span className="text-xs text-gray-400">
                            {order.createdAt ? timeAgo(order.createdAt) : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.style}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
