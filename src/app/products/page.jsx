"use client";

import { useEffect, useState, useRef } from "react";
import { serverFetch } from "@/lib/api/server";
import Link from "next/link";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};
import {
  Search,
  SlidersHorizontal,
  Package,
  Tag,
  Clock,
  ChevronDown,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing & Fashion",
  "Furniture & Home",
  "Books & Media",
  "Sports & Outdoors",
  "Toys & Games",
];

const CONDITIONS = [
  { value: "", label: "All Conditions" },
  { value: "used", label: "Used" },
  { value: "like_new", label: "Like New" },
  { value: "refurbished", label: "Refurbished" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const conditionStyles = {
  used: "bg-orange-50 text-orange-700 border border-orange-200",
  like_new: "bg-teal-50 text-teal-700 border border-teal-200",
  refurbished: "bg-blue-50 text-blue-700 border border-blue-200",
};

const conditionLabels = {
  used: "Used",
  like_new: "Like New",
  refurbished: "Refurbished",
};

const LIMIT = 10;

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const coverImage = Array.isArray(product.images) ? product.images[0] : null;
  const conditionKey = product.condition || "used";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full flex w-full"
    >
      <Link
        href={`/products/${product._id}`}
        className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex flex-col overflow-hidden w-full"
      >
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        {coverImage && !imgError ? (
          <img
            src={coverImage}
            alt={product.title || "Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package size={32} className="text-gray-300" />
            <span className="text-xs text-gray-300">No image</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
          {product.title || "Untitled product"}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Tag size={11} />
          <span>{product.category || "—"}</span>
          <span className="text-gray-200">·</span>
          <Clock size={11} />
          <span>
            {product.createdAt ? timeAgo(product.createdAt) : "Recently"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionStyles[conditionKey] || conditionStyles["used"]}`}
          >
            {conditionLabels[conditionKey] || conditionKey}
          </span>
          <span className="text-base font-bold text-emerald-600">
            ৳{Number(product.price).toLocaleString()}
          </span>
        </div>
        {product.sellerInfo?.name && (
          <p className="text-xs text-gray-400 truncate">
            by{" "}
            <span className="text-gray-600 font-medium">
              {product.sellerInfo.name}
            </span>
          </p>
        )}
      </div>
    </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="flex justify-between mt-3 pt-2 border-t border-gray-50">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} className="text-gray-500" />
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-xs text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl text-xs font-semibold border transition-all ${
              p === page
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={15} className="text-gray-500" />
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const sortRef = useRef(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [category, condition, search, sort]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (category && category !== "All") params.set("category", category);
        if (condition) params.set("condition", condition);
        if (search) params.set("search", search);
        if (sort !== "newest") params.set("sort", sort);
        params.set("page", page);
        params.set("limit", LIMIT);

        const data = await serverFetch(`/api/products?${params.toString()}`);

        // Handle both old (array) and new (paginated object) response shapes
        if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
          setTotalPages(1);
        } else {
          const raw = Array.isArray(data.products) ? data.products : [];
          // Deduplicate just in case
          const seen = new Set();
          const deduped = raw.filter((p) => {
            if (seen.has(p._id)) return false;
            seen.add(p._id);
            return true;
          });
          setProducts(deduped);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, condition, search, sort, page]);

  // Scroll to top on page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const clearAll = () => {
    setCategory("All");
    setCondition("");
    clearSearch();
    setSort("newest");
    setPage(1);
  };

  const activeFilters = [
    category !== "All" && { label: category, clear: () => setCategory("All") },
    condition && {
      label: conditionLabels[condition],
      clear: () => setCondition(""),
    },
    search && { label: `"${search}"`, clear: clearSearch },
    sort !== "newest" && {
      label: SORT_OPTIONS.find((s) => s.value === sort)?.label,
      clear: () => setSort("newest"),
    },
  ].filter(Boolean);

  // Pagination range text e.g. "Showing 11–20 of 45"
  const rangeStart = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const rangeEnd = Math.min(page * LIMIT, total);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Search */}
      <div className="bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Browse Products
          </h1>
          <p className="text-sm text-gray-400 mb-5">
            {isLoading
              ? "Loading…"
              : total > 0
                ? `Showing ${rangeStart}–${rangeEnd} of ${total} products`
                : "No products found"}
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                  category === cat
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-emerald-400 transition"
            >
              {CONDITIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white hover:border-gray-300 transition"
              >
                <SlidersHorizontal size={12} />
                {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSort(value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                        sort === value
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full"
              >
                {f.label}
                <button onClick={f.clear} className="hover:text-emerald-900">
                  <X size={11} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Package size={24} className="text-emerald-400" />
            </div>
            <p className="text-sm text-gray-500">No products found.</p>
            <button
              onClick={clearAll}
              className="text-xs text-emerald-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* Range text below pagination */}
            {totalPages > 1 && (
              <p className="text-xs text-gray-400 text-center">
                Page {page} of {totalPages} · {total} products total
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
