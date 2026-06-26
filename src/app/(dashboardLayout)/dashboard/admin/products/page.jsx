"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  getAllProductsAdmin,
  moderateProduct,
  deleteProductAdmin,
  getAllReports,
  updateReportStatus,
} from "../../../../../lib/api/adminProduct/products";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  RefreshCw,
  Package,
  Flag,
  Clock,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const MODERATION_TABS = [
  { value: "", label: "All", icon: Package },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "approved", label: "Approved", icon: ShieldCheck },
  { value: "rejected", label: "Rejected", icon: XCircle },
];

const conditionLabels = {
  used: "Used",
  like_new: "Like New",
  refurbished: "Refurbished",
};

const moderationBadge = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
};

// Deduplicate array by _id
const dedupe = (arr) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter((p) => {
    const key = String(p._id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Product Row ───────────────────────────────────────────────────────────────
function ProductRow({ product, onModerate, onDelete, reportCount }) {
  const [busy, setBusy] = useState(false);
  const [imgError, setImgError] = useState(false);

  const coverImage = Array.isArray(product.images) ? product.images[0] : null;
  const modStatus = product.moderationStatus || "pending";

  const act = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {coverImage && !imgError ? (
              <img
                src={coverImage}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={16} className="text-gray-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 line-clamp-1">
              {product.title || "Untitled"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {product.category} ·{" "}
              {conditionLabels[product.condition] || product.condition}
            </p>
            {product.isReported && (
              <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium mt-0.5">
                <Flag size={9} /> Reported ({reportCount})
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-xs font-medium text-gray-700">
          {product.sellerInfo?.name || "—"}
        </p>
        <p className="text-xs text-gray-400 truncate max-w-[140px]">
          {product.sellerInfo?.email || "—"}
        </p>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm font-bold text-emerald-600">
          ৳{Number(product.price).toLocaleString()}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${moderationBadge[modStatus] || moderationBadge.pending}`}
        >
          {modStatus}
        </span>
      </td>

      <td className="px-5 py-4 text-xs text-gray-400">
        {product.createdAt ? timeAgo(product.createdAt) : "—"}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {modStatus !== "approved" && (
            <button
              onClick={() => act(() => onModerate(product._id, "approved"))}
              disabled={busy}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <CheckCircle size={12} />
              )}
              Approve
            </button>
          )}
          {modStatus !== "rejected" && (
            <button
              onClick={() => act(() => onModerate(product._id, "rejected"))}
              disabled={busy}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <XCircle size={12} />
              )}
              Reject
            </button>
          )}
          <button
            onClick={() => act(() => onDelete(product._id))}
            disabled={busy}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Report Row ────────────────────────────────────────────────────────────────
function ReportRow({ report, onUpdate }) {
  const [busy, setBusy] = useState(false);

  const statusBadge = {
    open: "bg-red-50 text-red-600 border border-red-200",
    reviewed: "bg-blue-50 text-blue-600 border border-blue-200",
    dismissed: "bg-gray-100 text-gray-500 border border-gray-200",
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
          {report.productTitle || "Unknown"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">
          {report.productId}
        </p>
      </td>
      <td className="px-5 py-4 text-xs text-gray-600">
        {report.reporterEmail}
      </td>
      <td className="px-5 py-4">
        <span className="text-xs font-medium text-gray-700">
          {report.reason}
        </span>
        {report.details && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {report.details}
          </p>
        )}
      </td>
      <td className="px-5 py-4">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[report.status] || statusBadge.open}`}
        >
          {report.status}
        </span>
      </td>
      <td className="px-5 py-4 text-xs text-gray-400">
        {report.createdAt ? timeAgo(report.createdAt) : "—"}
      </td>
      <td className="px-5 py-4">
        {report.status === "open" ? (
          <div className="flex gap-1.5">
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onUpdate(report._id, "reviewed");
                setBusy(false);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all font-semibold disabled:opacity-50"
            >
              Mark Reviewed
            </button>
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onUpdate(report._id, "dismissed");
                setBusy(false);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-200 transition-all font-semibold disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">No actions</span>
        )}
      </td>
    </tr>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ManageProductsPage() {
  // allProducts = full unfiltered list, used ONLY for summary counts
  const [allProducts, setAllProducts] = useState([]);
  // filteredProducts = what the table renders (filtered by tab + search)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("products");

  // Track in-flight fetch so we never have two running at once
  const fetchIdRef = useRef(0);

  // ── Single source of truth for all data fetching ──────────────────────────
  const loadData = async ({ tab, srch, silent = false }) => {
    // Give this fetch a unique ID; if a newer one starts, discard our result
    const fetchId = ++fetchIdRef.current;

    if (!silent) setIsLoading(true);
    else setRefreshing(true);

    try {
      const [all, filtered, reps] = await Promise.all([
        getAllProductsAdmin({}), // always unfiltered
        getAllProductsAdmin({ moderation: tab, search: srch }),
        getAllReports(),
      ]);

      // Bail if a newer fetch already replaced us
      if (fetchId !== fetchIdRef.current) return;

      setAllProducts(dedupe(all));
      setFilteredProducts(dedupe(filtered));
      setReports(dedupe(reps));
    } catch {
      if (fetchId !== fetchIdRef.current) return;
      toast.error("Failed to load data");
    } finally {
      if (fetchId !== fetchIdRef.current) return;
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load + re-fetch whenever tab or committed search changes
  useEffect(() => {
    loadData({ tab: activeTab, srch: search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search]);

  const handleRefresh = () =>
    loadData({ tab: activeTab, srch: search, silent: true });

  // ── Optimistic moderation ──────────────────────────────────────────────────
  const handleModerate = async (id, moderationStatus) => {
    const statusMap = {
      approved: "available",
      rejected: "rejected",
      pending: "pending",
    };

    // Optimistically patch both lists right away
    const patch = (list) =>
      list.map((p) =>
        String(p._id) === String(id)
          ? {
              ...p,
              moderationStatus,
              status: statusMap[moderationStatus],
              moderatedAt: new Date().toISOString(),
            }
          : p,
      );

    setAllProducts((prev) => patch(prev));
    setFilteredProducts((prev) => {
      const patched = patch(prev);
      // If a tab filter is active and item no longer matches, hide it
      if (activeTab && moderationStatus !== activeTab) {
        return patched.filter((p) => String(p._id) !== String(id));
      }
      return patched;
    });

    try {
      await moderateProduct(id, moderationStatus);
      toast.success(`Product ${moderationStatus}`);
    } catch {
      toast.error("Failed to update — reverting");
      loadData({ tab: activeTab, srch: search, silent: true });
    }
  };

  // ── Optimistic delete ──────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this product?")) return;

    setAllProducts((prev) => prev.filter((p) => String(p._id) !== String(id)));
    setFilteredProducts((prev) =>
      prev.filter((p) => String(p._id) !== String(id)),
    );

    try {
      await deleteProductAdmin(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete — reverting");
      loadData({ tab: activeTab, srch: search, silent: true });
    }
  };

  // ── Optimistic report update ───────────────────────────────────────────────
  const handleReportUpdate = async (id, status) => {
    setReports((prev) =>
      prev.map((r) => (String(r._id) === String(id) ? { ...r, status } : r)),
    );
    try {
      await updateReportStatus(id, status);
      toast.success("Report updated");
    } catch {
      toast.error("Failed to update report");
      loadData({ tab: activeTab, srch: search, silent: true });
    }
  };

  // Summary always from the unfiltered allProducts list
  const summary = useMemo(
    () => ({
      total: allProducts.length,
      pending: allProducts.filter((p) => p.moderationStatus === "pending")
        .length,
      approved: allProducts.filter((p) => p.moderationStatus === "approved")
        .length,
      rejected: allProducts.filter((p) => p.moderationStatus === "rejected")
        .length,
      reported: allProducts.filter((p) => p.isReported).length,
      openReports: reports.filter((r) => r.status === "open").length,
    }),
    [allProducts, reports],
  );

  const reportCountFor = (productId) =>
    reports.filter((r) => r.productId === String(productId)).length;

  const tabCount = (val) => {
    if (val === "") return summary.total;
    if (val === "pending") return summary.pending;
    if (val === "approved") return summary.approved;
    return summary.rejected;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Manage Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, approve, and moderate all product listings.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Total",
              value: summary.total,
              color: "text-slate-700",
              bg: "bg-slate-50 border-slate-200",
            },
            {
              label: "Pending",
              value: summary.pending,
              color: "text-yellow-700",
              bg: "bg-yellow-50 border-yellow-200",
            },
            {
              label: "Approved",
              value: summary.approved,
              color: "text-emerald-700",
              bg: "bg-emerald-50 border-emerald-200",
            },
            {
              label: "Rejected",
              value: summary.rejected,
              color: "text-red-600",
              bg: "bg-red-50 border-red-200",
            },
            {
              label: "Reported",
              value: summary.reported,
              color: "text-orange-600",
              bg: "bg-orange-50 border-orange-200",
            },
            {
              label: "Open Reports",
              value: summary.openReports,
              color: "text-purple-600",
              bg: "bg-purple-50 border-purple-200",
            },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
              <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setView("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              view === "products"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
            }`}
          >
            <Package size={15} /> Products
          </button>
          <button
            onClick={() => setView("reports")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              view === "reports"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-red-300"
            }`}
          >
            <Flag size={15} />
            Reports
            {summary.openReports > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                {summary.openReports}
              </span>
            )}
          </button>
        </div>

        {/* ── Products view ── */}
        {view === "products" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
              {/* Moderation tabs */}
              <div className="flex gap-2 flex-wrap">
                {MODERATION_TABS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      activeTab === value
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                        activeTab === value
                          ? "bg-white/30 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {tabCount(value)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearch(searchInput);
                }}
                className="flex gap-2"
              >
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-400 transition w-48"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
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
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>

            {/* Products table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {[
                        "Product",
                        "Seller",
                        "Price",
                        "Status",
                        "Added",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr
                          key={`skeleton-${i}`}
                          className="border-b border-slate-100 animate-pulse"
                        >
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-5 py-4">
                              <div className="h-3 bg-gray-100 rounded w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Package size={32} className="text-gray-200" />
                            <p className="text-sm text-gray-400">
                              No products found.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <ProductRow
                          key={String(product._id)}
                          product={product}
                          reportCount={reportCountFor(product._id)}
                          onModerate={handleModerate}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Reports view ── */}
        {view === "reports" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      "Product",
                      "Reported By",
                      "Reason",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr
                        key={`rskeleton-${i}`}
                        className="border-b border-slate-100 animate-pulse"
                      >
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-3 bg-gray-100 rounded w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Flag size={32} className="text-gray-200" />
                          <p className="text-sm text-gray-400">
                            No reports yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <ReportRow
                        key={String(report._id)}
                        report={report}
                        onUpdate={handleReportUpdate}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
