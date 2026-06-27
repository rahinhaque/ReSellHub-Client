"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getBuyerOrders } from "@/lib/api/buyer/order/data";
import { cancelOrder } from "@/lib/api/buyer/order/action";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
  Ban,
  Truck,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconStyle: "text-yellow-500",
    dot: "bg-yellow-500",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    style: "bg-blue-50 text-blue-700 border-blue-200",
    iconStyle: "text-blue-500",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    style: "bg-purple-50 text-purple-700 border-purple-200",
    iconStyle: "text-purple-500",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    icon: BadgeCheck,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconStyle: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    style: "bg-red-50 text-red-600 border-red-200",
    iconStyle: "text-red-400",
    dot: "bg-red-400",
  },
};

const STEPS = ["pending", "accepted", "shipped", "delivered"];

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
  const isCancelled = status === "cancelled";
  const currentStep = STEPS.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-red-50 rounded-xl border border-red-100">
        <XCircle size={15} className="text-red-400 shrink-0" />
        <p className="text-xs text-red-500 font-medium">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, i) => {
        const done = i <= currentStep;
        const isLast = i === STEPS.length - 1;
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
                  size={14}
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

function OrderCard({ order, onCancelled }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const statusKey = order.orderStatus || "pending";
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const canCancel = statusKey === "pending";

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError("");
      await cancelOrder(order._id.toString());
      onCancelled(order._id.toString());
      setShowConfirm(false);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      const message = err.message || "Failed to cancel. Please try again.";
      setCancelError(message);
      toast.error(message);
    } finally {
      setCancelling(false);
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
              Order #{order._id.toString().slice(-8).toUpperCase()}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-bold text-emerald-600">
                ${Number(order.price).toLocaleString()}
              </span>
              <span className="text-xs text-gray-300">·</span>
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
              Order status
            </p>
            <OrderTracker status={statusKey} />
          </div>

          {statusKey === "delivered" && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">
                Your order has been delivered. Enjoy!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Payment
              </p>
              <p className="text-xs font-semibold text-emerald-600 capitalize">
                {order.paymentStatus || "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="text-xs font-semibold text-gray-700">
                ${Number(order.price).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Seller
              </p>
              <p className="text-xs font-semibold text-gray-700 truncate">
                {order.sellerInfo?.name || "—"}
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
          </div>

          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="text-xs font-mono text-gray-500 break-all">
              {order._id.toString()}
            </p>
          </div>

          {order.stripeSessionId && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Transaction reference
              </p>
              <p className="text-xs font-mono text-gray-400 break-all">
                {order.stripeSessionId}
              </p>
            </div>
          )}

          {cancelError && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <XCircle size={12} />
              {cancelError}
            </p>
          )}

          {canCancel && (
            <>
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Ban size={14} />
                  Cancel order
                </button>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className="text-red-500 mt-0.5 shrink-0"
                    />
                    <p className="text-xs text-red-600">
                      Are you sure you want to cancel this order?
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      disabled={cancelling}
                      className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600"
                    >
                      No, keep it
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 py-2 rounded-lg border border-red-200 bg-red-600 text-xs font-medium text-white flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {cancelling ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Cancelling…
                        </>
                      ) : (
                        <>
                          <Ban size={13} />
                          Yes, cancel
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
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

export default function BuyerOrderList() {
  const { data: session } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const data = await getBuyerOrders(user.email);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const handleCancelled = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id.toString() === orderId ? { ...o, orderStatus: "cancelled" } : o,
      ),
    );
  };

  const FILTERS = [
    { key: "all", label: "All orders" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ShoppingBag size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">My orders</h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          Track and manage all your purchases.
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
            <ShoppingBag size={26} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `No ${filter} orders.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard
              key={order._id.toString()}
              order={order}
              onCancelled={handleCancelled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
