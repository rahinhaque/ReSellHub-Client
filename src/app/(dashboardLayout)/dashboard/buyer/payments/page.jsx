"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getBuyerPayments } from "@/lib/api/buyer/payment-history/data";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Payment status config — matches DB values exactly ────────────────────────
const PAYMENT_STATUS = {
  paid: {
    label: "Paid",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    iconStyle: "text-emerald-500",
    amountStyle: "text-emerald-600",
  },
  refunded: {
    label: "Refunded",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-400",
    icon: RefreshCw,
    iconStyle: "text-purple-400",
    amountStyle: "text-purple-500 line-through",
  },
  failed: {
    label: "Failed",
    style: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
    iconStyle: "text-red-400",
    amountStyle: "text-red-400",
  },
  pending: {
    label: "Pending",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    icon: Clock,
    iconStyle: "text-yellow-500",
    amountStyle: "text-yellow-600",
  },
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 px-5 py-4 animate-pulse"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3.5 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-4 w-16 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Single payment row ────────────────────────────────────────────────────────
function PaymentRow({ payment }) {
  const [expanded, setExpanded] = useState(false);
  const statusKey = payment.paymentStatus || "pending";
  const cfg = PAYMENT_STATUS[statusKey] || PAYMENT_STATUS.pending;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Main row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            <Icon size={17} className={cfg.iconStyle} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {payment.productTitle || "Product purchase"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {payment.createdAt ? formatDate(payment.createdAt) : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-sm font-bold ${cfg.amountStyle}`}>
            ${Number(payment.amount).toLocaleString()}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.style}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 py-4 flex flex-col gap-3">
          {/* Refund notice */}
          {statusKey === "refunded" && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
              <RefreshCw size={14} className="text-purple-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-purple-700">
                  This payment was refunded
                </p>
                {payment.refundedAt && (
                  <p className="text-[11px] text-purple-400 mt-0.5">
                    Refunded on {formatDate(payment.refundedAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className={`text-sm font-bold ${cfg.amountStyle}`}>
                ${Number(payment.amount).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Payment status
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.style}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Order status
              </p>
              <p className="text-xs font-semibold text-gray-700 capitalize">
                {payment.orderStatus || "—"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-xs font-semibold text-gray-700">
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Refund ID */}
          {payment.refundId && (
            <div className="bg-purple-50 rounded-xl px-3 py-2.5 border border-purple-100">
              <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">
                Refund ID
              </p>
              <p className="text-xs font-mono text-purple-600 break-all">
                {payment.refundId}
              </p>
            </div>
          )}

          {/* Transaction ID */}
          {payment.transactionId && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Transaction ID
              </p>
              <p className="text-xs font-mono text-gray-500 break-all">
                {payment.transactionId}
              </p>
            </div>
          )}

          {/* Stripe session */}
          {payment.stripeSessionId && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Stripe session
              </p>
              <p className="text-xs font-mono text-gray-400 break-all">
                {payment.stripeSessionId}
              </p>
            </div>
          )}

          {/* Order ID */}
          {payment.orderId && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Order ID
              </p>
              <p className="text-xs font-mono text-gray-500 break-all">
                {payment.orderId}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Summary cards ─────────────────────────────────────────────────────────────
function SummaryCards({ payments }) {
  const paidPayments = payments.filter((p) => p.paymentStatus === "paid");
  const totalSpent = paidPayments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );
  const refundedCount = payments.filter(
    (p) => p.paymentStatus === "refunded",
  ).length;
  const totalCount = payments.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
          Total spent
        </p>
        <p className="text-lg font-bold text-gray-900">
          ${totalSpent.toLocaleString()}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
          Transactions
        </p>
        <p className="text-lg font-bold text-gray-900">{totalCount}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
          Refunded
        </p>
        <p className="text-lg font-bold text-purple-500">{refundedCount}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BuyerPaymentHistory() {
  const { data: session } = useSession();
  const user = session?.user;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.email) return;
    const fetch = async () => {
      try {
        const data = await getBuyerPayments(user.email);
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "refunded", label: "Refunded" },
    { key: "failed", label: "Failed" },
    { key: "pending", label: "Pending" },
  ];

  const filtered =
    filter === "all"
      ? payments
      : payments.filter((p) => p.paymentStatus === filter);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <CreditCard size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Payment history
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          All your transaction records in one place.
        </p>
      </div>

      {/* ── Summary cards ── */}
      {!loading && payments.length > 0 && <SummaryCards payments={payments} />}

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === "all"
              ? payments.length
              : payments.filter((p) => p.paymentStatus === key).length;

          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all
                ${
                  filter === key
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${
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

      {/* ── List ── */}
      {loading ? (
        <Skeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Receipt size={26} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              No payments found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {filter === "all"
                ? "You haven't made any payments yet."
                : `No ${filter} payments.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((payment) => (
            <PaymentRow key={payment._id?.toString()} payment={payment} />
          ))}
        </div>
      )}
    </div>
  );
}
