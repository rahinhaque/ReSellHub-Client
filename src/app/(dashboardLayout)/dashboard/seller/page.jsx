"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getSellerOverview } from "@/lib/api/seller/overview/data";
import DashboardHeader from "@/components/DashboardHeader";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Truck,
  BadgeCheck,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  accepted: {
    label: "Accepted",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
  },
};

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

function StatCard({ icon: Icon, label, value, iconBg, href, trend }) {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-sm transition-all group">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={18} className="text-white" />
        </div>
        {href && (
          <ArrowRight
            size={14}
            className="text-gray-300 group-hover:text-emerald-400 transition-colors"
          />
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1.5">
            <TrendingUp size={11} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-medium">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3" />
      <div className="h-7 w-16 bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  );
}

function RecentOrderSkeleton() {
  return (
    <div className="flex flex-col gap-0 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-5 py-3.5 flex items-center gap-3 border-b border-gray-50"
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
  );
}

export default function SellerOverview() {
  const { data: session } = useSession();
  const user = session?.user;

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetchOverview = async () => {
      try {
        const data = await getSellerOverview(user.email);
        setOverview(data);
      } catch (err) {
        console.error("Failed to fetch seller overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [user?.email]);

  const cards = overview
    ? [
        {
          icon: Package,
          label: "Total products",
          value: overview.totalProducts,
          iconBg: "bg-blue-500",
          href: "/dashboard/seller/products",
        },
        {
          icon: ShoppingBag,
          label: "Total sales",
          value: overview.totalSales,
          iconBg: "bg-emerald-500",
          href: "/dashboard/seller/orders",
        },
        {
          icon: DollarSign,
          label: "Total revenue",
          value: `$${overview.totalRevenue.toLocaleString()}`,
          iconBg: "bg-amber-500",
          href: "/dashboard/seller/analytics",
        },
        {
          icon: Clock,
          label: "Pending orders",
          value: overview.pendingOrders,
          iconBg: overview.pendingOrders > 0 ? "bg-red-400" : "bg-gray-400",
          href: "/dashboard/seller/orders",
          trend: overview.pendingOrders > 0 ? "Needs attention" : null,
        },
      ]
    : [];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      <DashboardHeader
        title="Seller Dashboard"
        description="Welcome back! Here's an overview of your marketplace activity."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading
          ? [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
          : cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={15} className="text-emerald-500" />
            <h2 className="text-sm font-semibold text-gray-800">
              Recent orders
            </h2>
          </div>
          <Link
            href="/dashboard/seller/orders"
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <RecentOrderSkeleton />
        ) : !overview?.recentOrders?.length ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={22} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Orders from buyers will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {overview.recentOrders.map((order) => {
              const statusKey = order.orderStatus || "pending";
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order._id?.toString()}
                  className="px-5 py-3.5 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-gray-400" />
                  </div>
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
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${cfg.style}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link
          href="/dashboard/seller/products/add"
          className="bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-2xl p-4 flex items-center justify-between group"
        >
          <div>
            <p className="text-sm font-semibold text-white">Add product</p>
            <p className="text-xs text-emerald-200 mt-0.5">
              List something new
            </p>
          </div>
          <ArrowRight
            size={16}
            className="text-emerald-300 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <Link
          href="/dashboard/seller/analytics"
          className="bg-white hover:border-emerald-200 transition-colors rounded-2xl p-4 border border-gray-100 flex items-center justify-between group"
        >
          <div>
            <p className="text-sm font-semibold text-gray-800">Analytics</p>
            <p className="text-xs text-gray-400 mt-0.5">View performance</p>
          </div>
          <ArrowRight
            size={16}
            className="text-gray-300 group-hover:text-emerald-400 transition-colors"
          />
        </Link>
      </div>
    </div>
  );
}
