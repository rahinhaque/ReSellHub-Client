"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminOrders } from "@/lib/api/admin/orders/data";
import { resolveOrder } from "@/lib/api/admin/orders/action";
import { toast } from "sonner";
import {
  ClipboardList,
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Loader2,
  XCircle,
  BadgeCheck,
  Truck,
  Clock,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  DollarSign,
  X,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: BadgeCheck,
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const ALL_STATUSES = [
  "pending",
  "accepted",
  "shipped",
  "delivered",
  "cancelled",
];

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
    year: "numeric",
  });
}

// ── Resolve Modal ─────────────────────────────────────────────────────────────
function ResolveModal({ order, onClose, onResolved }) {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [issueRefund, setIssueRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleResolve = async () => {
    try {
      setLoading(true);
      await resolveOrder(order._id.toString(), {
        orderStatus: selectedStatus,
        issueRefundNow: issueRefund,
      });
      toast.success(
        `Order updated to "${selectedStatus}"${issueRefund ? " + refund issued" : ""}`,
      );
      onResolved(order._id.toString(), selectedStatus);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to resolve order.");
    } finally {
      setLoading(false);
    }
  };

  const changed = selectedStatus !== order.orderStatus || issueRefund;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-emerald-500" />
            <h2 className="text-sm font-semibold text-gray-900">
              Resolve / Override Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Order info */}
          <div className="bg-gray-50 rounded-xl p-3.5 flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {order.productTitle}
            </p>
            <p className="text-xs text-gray-400">
              #{order._id.toString().slice(-8).toUpperCase()} · $
              {Number(order.price).toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400">Current status:</span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[order.orderStatus]?.style}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[order.orderStatus]?.dot}`}
                />
                {STATUS_CONFIG[order.orderStatus]?.label}
              </span>
            </div>
          </div>

          {/* Status selector */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Force status to
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStatus === s
                        ? cfg.style + " ring-2 ring-offset-1 ring-emerald-400"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Refund toggle */}
          <div
            onClick={() => setIssueRefund((v) => !v)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              issueRefund
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                issueRefund ? "bg-red-500 border-red-500" : "border-gray-300"
              }`}
            >
              {issueRefund && <X size={11} className="text-white" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <DollarSign
                  size={12}
                  className={issueRefund ? "text-red-500" : "text-gray-400"}
                />
                Issue refund to buyer
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Triggers a Stripe refund for the original payment
              </p>
            </div>
          </div>

          {/* Dispute note */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Admin note (optional)
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for override, dispute details…"
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleResolve}
            disabled={loading || !changed}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Resolving…
              </>
            ) : (
              <>
                <ShieldAlert size={14} /> Apply Override
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onResolved }) {
  const [expanded, setExpanded] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  const statusKey = order.orderStatus || "pending";
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <Package size={18} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {order.productTitle || "Product"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                #{order._id?.toString().slice(-8).toUpperCase()}
                {order.adminResolved && (
                  <span className="ml-2 px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-[10px] font-semibold">
                    Admin resolved
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-emerald-600">
                  ${Number(order.price).toLocaleString()}
                </span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">
                  {order.createdAt ? timeAgo(order.createdAt) : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.style}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              {expanded ? (
                <ChevronUp size={14} className="text-gray-400" />
              ) : (
                <ChevronDown size={14} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-50 px-5 py-4 flex flex-col gap-4">
            {/* Buyer & Seller info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                  Buyer
                </p>
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={11} className="text-blue-400" />
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {order.buyerInfo?.name || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">
                    {order.buyerInfo?.email || "—"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                  Seller
                </p>
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={11} className="text-emerald-400" />
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {order.sellerInfo?.name || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">
                    {order.sellerInfo?.email || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Amount
                </p>
                <p className="text-sm font-bold text-emerald-600">
                  ${Number(order.price).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Payment
                </p>
                <p className="text-xs font-semibold text-gray-700 capitalize">
                  {order.paymentStatus || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Placed
                </p>
                <p className="text-xs font-semibold text-gray-700">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Product ID
                </p>
                <p className="text-xs font-mono text-gray-500 truncate">
                  {order.productId || "—"}
                </p>
              </div>
            </div>

            {/* Dispute / Resolve button */}
            <button
              onClick={() => setShowResolve(true)}
              className="w-full py-2.5 rounded-xl border border-orange-200 text-sm font-semibold text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldAlert size={15} />
              {order.adminResolved
                ? "Re-resolve / Override again"
                : "Resolve dispute / Override status"}
            </button>
          </div>
        )}
      </div>

      {showResolve && (
        <ResolveModal
          order={order}
          onClose={() => setShowResolve(false)}
          onResolved={onResolved}
        />
      )}
    </>
  );
}

function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 px-5 py-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders({
        status: filter !== "all" ? filter : undefined,
        search: search || undefined,
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, search]);

  const handleResolved = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id?.toString() === orderId
          ? { ...o, orderStatus: newStatus, adminResolved: true }
          : o,
      ),
    );
  };

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] =
      f.key === "all"
        ? orders.length
        : orders.filter((o) => o.orderStatus === f.key).length;
    return acc;
  }, {});

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ClipboardList size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">All Orders</h1>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
            {orders.length}
          </span>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          Monitor, resolve disputes, and override order statuses across the
          platform.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by product, buyer or seller email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
            }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === key
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filter === key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <OrderSkeleton />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ClipboardList size={26} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search
                ? `No results for "${search}"`
                : filter !== "all"
                  ? `No ${filter} orders.`
                  : "No orders yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard
              key={order._id?.toString()}
              order={order}
              onResolved={handleResolved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
