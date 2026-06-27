"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getSellerOrders } from "@/lib/api/seller/orders/data";
import { updateOrderStatus } from "@/lib/api/seller/orders/action";
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  Mail,
  DollarSign,
  RefreshCw,
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

const FLOW = ["pending", "accepted", "shipped", "delivered"];

const NEXT_ACTIONS = {
  pending: [
    {
      status: "accepted",
      label: "Accept order",
      style: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      status: "cancelled",
      label: "Reject order",
      style: "border border-red-200 text-red-500 hover:bg-red-50",
    },
  ],
  accepted: [
    {
      status: "shipped",
      label: "Mark as shipped",
      style: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  ],
  shipped: [
    {
      status: "delivered",
      label: "Mark as delivered",
      style: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  ],
  delivered: [],
  cancelled: [],
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
    year: "numeric",
  });
}

function OrderTracker({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
        <XCircle size={14} className="text-red-400 shrink-0" />
        <p className="text-xs text-red-500 font-medium">
          This order was cancelled.
        </p>
      </div>
    );
  }

  const currentStep = FLOW.indexOf(status);

  return (
    <div className="flex items-start w-full">
      {FLOW.map((step, i) => {
        const done = i <= currentStep;
        const isLast = i === FLOW.length - 1;
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.icon;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Icon
                  size={13}
                  className={done ? "text-emerald-500" : "text-gray-300"}
                />
              </div>
              <span
                className={`text-[10px] font-medium capitalize whitespace-nowrap ${
                  done ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {cfg.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-0.5 flex-1 mx-1 mb-4 rounded transition-all ${
                  i < currentStep ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const statusKey = order.orderStatus || "pending";
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const actions = NEXT_ACTIONS[statusKey] || [];

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(newStatus);
      setError("");
      await updateOrderStatus(order._id.toString(), newStatus);
      onStatusUpdate(order._id.toString(), newStatus);
    } catch (err) {
      setError(err?.message || "Failed to update status.");
    } finally {
      setLoading(null);
    }
  };

  return (
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
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Order progress
            </p>
            <OrderTracker status={statusKey} />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Buyer information
            </p>

            <div className="bg-gray-50 rounded-xl p-3.5 flex flex-col gap-2">
              {order.buyerInfo?.name && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <User size={13} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {order.buyerInfo.name}
                    </p>
                    <p className="text-[10px] text-gray-400">Buyer</p>
                  </div>
                </div>
              )}

              {order.buyerInfo?.email && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-emerald-500" />
                  </div>
                  <a
                    href={`mailto:${order.buyerInfo.email}`}
                    className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {order.buyerInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>

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

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <XCircle size={12} />
              {error}
            </p>
          )}

          {actions.length > 0 && (
            <div className="flex gap-2">
              {actions.map((action) => (
                <button
                  key={action.status}
                  onClick={() => handleStatusUpdate(action.status)}
                  disabled={loading !== null}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${action.style}`}
                >
                  {loading === action.status ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Updating…
                    </>
                  ) : (
                    action.label
                  )}
                </button>
              ))}
            </div>
          )}

          {statusKey === "delivered" && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">
                Order delivered successfully.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
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

export default function SellerOrderManagement() {
  const { data: session } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const data = await getSellerOrders(user.email);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id?.toString() === orderId ? { ...o, orderStatus: newStatus } : o,
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

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ClipboardList size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Manage orders</h1>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
              {pendingCount} pending
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 ml-12">
          Accept, ship, and track incoming customer orders.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === "all"
              ? orders.length
              : orders.filter((o) => o.orderStatus === key).length;

          return (
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
              {count > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filter === key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <OrderSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ClipboardList size={26} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter === "all"
                ? "You haven't received any orders yet."
                : `No ${filter} orders.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard
              key={order._id?.toString()}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
