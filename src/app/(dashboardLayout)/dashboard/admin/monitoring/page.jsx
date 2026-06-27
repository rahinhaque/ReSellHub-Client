"use client";

import { useEffect, useState } from "react";
import { getAdminPayments } from "@/lib/api/admin/payments/data";
import {
  DollarSign,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Receipt,
  User,
  Mail,
  Hash,
  Calendar,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  refunded: {
    label: "Refunded",
    style: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
    icon: RefreshCw,
  },
};

const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  accepted: {
    label: "Accepted",
    style: "bg-blue-50 text-blue-700 border-blue-200",
  },
  shipped: {
    label: "Shipped",
    style: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    label: "Delivered",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-red-50 text-red-600 border-red-200",
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
    year: "numeric",
  });
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconBg, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Transaction Card ──────────────────────────────────────────────────────────
function TransactionCard({ payment }) {
  const [expanded, setExpanded] = useState(false);

  const statusKey = payment.paymentStatus || "paid";
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.paid;
  const orderCfg =
    ORDER_STATUS_CONFIG[payment.orderStatus] || ORDER_STATUS_CONFIG.pending;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Row */}
      <div className="px-5 py-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            <Receipt size={17} className="text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {payment.productTitle || "Product"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
              {payment.transactionId
                ? payment.transactionId.slice(0, 24) + "…"
                : "—"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-emerald-600">
                ${Number(payment.amount).toLocaleString()}
              </span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">
                {payment.createdAt ? timeAgo(payment.createdAt) : "—"}
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

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 py-4 flex flex-col gap-4">
          {/* Buyer & Seller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                Buyer
              </p>
              {payment.buyerInfo?.name && (
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={11} className="text-blue-400 shrink-0" />
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {payment.buyerInfo.name}
                  </p>
                </div>
              )}
              {payment.buyerInfo?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500 truncate">
                    {payment.buyerInfo.email}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                Seller
              </p>
              {payment.sellerInfo?.name && (
                <div className="flex items-center gap-1.5 mb-1">
                  <User size={11} className="text-emerald-400 shrink-0" />
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {payment.sellerInfo.name}
                  </p>
                </div>
              )}
              {payment.sellerInfo?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500 truncate">
                    {payment.sellerInfo.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="text-sm font-bold text-emerald-600">
                ${Number(payment.amount).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Order status
              </p>
              <span
                className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${orderCfg.style}`}
              >
                {orderCfg.label}
              </span>
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

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Payment status
              </p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.style}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Hash size={11} className="text-gray-400" />
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Transaction ID
              </p>
            </div>
            <p className="text-xs font-mono text-gray-500 break-all">
              {payment.transactionId || "—"}
            </p>
          </div>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Package size={11} className="text-gray-400" />
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                Order ID
              </p>
            </div>
            <p className="text-xs font-mono text-gray-500 break-all">
              {payment.orderId || "—"}
            </p>
          </div>

          {/* Refund info */}
          {payment.refundId && (
            <div className="bg-red-50 rounded-xl px-3 py-2.5 border border-red-100">
              <div className="flex items-center gap-1.5 mb-1">
                <RefreshCw size={11} className="text-red-400" />
                <p className="text-[10px] text-red-400 uppercase tracking-wider">
                  Refund ID
                </p>
              </div>
              <p className="text-xs font-mono text-red-500 break-all">
                {payment.refundId}
              </p>
              {payment.refundedAt && (
                <p className="text-[10px] text-red-300 mt-1">
                  Refunded {timeAgo(payment.refundedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
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
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPaymentMonitoring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const result = await getAdminPayments({
        status: filter !== "all" ? filter : undefined,
        search: search || undefined,
      });
      setData(result);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "refunded", label: "Refunded" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <DollarSign size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Payment Monitoring
          </h1>
          {data && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
              {data.stats.total}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 ml-12">
          View and monitor all transactions across the platform.
        </p>
      </div>

      {/* Stat cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Total revenue"
            value={`$${data.stats.totalRevenue.toLocaleString()}`}
            iconBg="bg-emerald-500"
            sub="From paid transactions"
          />
          <StatCard
            icon={RefreshCw}
            label="Total refunded"
            value={`$${data.stats.totalRefunded.toLocaleString()}`}
            iconBg="bg-red-400"
            sub="Across all refunds"
          />
          <StatCard
            icon={CheckCircle2}
            label="Paid transactions"
            value={data.stats.paid}
            iconBg="bg-blue-500"
          />
          <StatCard
            icon={XCircle}
            label="Refunded transactions"
            value={data.stats.refunded}
            iconBg="bg-orange-400"
          />
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by product, buyer, seller or transaction ID…"
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
            onClick={clearSearch}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => {
          const count =
            key === "all"
              ? data?.stats.total
              : key === "paid"
                ? data?.stats.paid
                : data?.stats.refunded;

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

      {/* Transactions list */}
      {loading ? (
        <Skeleton />
      ) : !data?.payments?.length ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Receipt size={26} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              No transactions found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search
                ? `No results for "${search}"`
                : filter !== "all"
                  ? `No ${filter} transactions.`
                  : "No payments recorded yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.payments.map((payment) => (
            <TransactionCard key={payment._id?.toString()} payment={payment} />
          ))}
        </div>
      )}
    </div>
  );
}
