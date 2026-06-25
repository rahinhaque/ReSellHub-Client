"use client";

import { useState } from "react";
import { Pencil, Trash2, Tag, Clock, Package } from "lucide-react";
import DeleteConfirmModal from "./Deleteconfirmmodal";
import EditProductModal from "./Editproductmodal ";

// ─── Condition pill styles ───────────────────────────────────────────────────
const conditionStyles = {
  new: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "like new": "bg-teal-50 text-teal-700 border border-teal-200",
  good: "bg-green-50 text-green-700 border border-green-200",
  fair: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  poor: "bg-red-50 text-red-600 border border-red-200",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Single management card ──────────────────────────────────────────────────
export function ProductCard({ product, onUpdated, onDeleted }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {
    _id,
    title,
    images,
    price,
    category,
    condition,
    quantity,
    createdAt,
  } = product;

  const coverImage = Array.isArray(images) ? images[0] : images;
  const conditionKey = condition?.toLowerCase().replace("_", " ") || "good";

  return (
    <>
      <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200 flex gap-4 p-4 items-start">
        {/* Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={coverImage || "/placeholder-product.png"}
            alt={title || "Product"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {title || "Untitled product"}
            </h3>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 px-3 py-1.5 rounded-lg transition-all duration-150"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-red-500 border border-red-100 bg-red-50 hover:bg-red-500 hover:text-white hover:border-red-500 px-3 py-1.5 rounded-lg transition-all duration-150"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Tag size={11} />
              {category || "—"}
            </span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1">
              <Package size={11} />
              Qty: {quantity ?? "—"}
            </span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {createdAt ? timeAgo(createdAt) : "Recently"}
            </span>
          </div>

          {/* Bottom row: condition + price */}
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                conditionStyles[conditionKey] || conditionStyles["good"]
              }`}
            >
              {conditionKey}
            </span>
            <span className="text-base font-bold text-emerald-600">
              {price ? `৳${Number(price).toLocaleString()}` : "No price set"}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEdit && (
        <EditProductModal
          product={product}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            setShowEdit(false);
            onUpdated?.(updated);
          }}
        />
      )}
      {showDelete && (
        <DeleteConfirmModal
          productTitle={title}
          productId={_id}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            setShowDelete(false);
            onDeleted?.(_id);
          }}
        />
      )}
    </>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex gap-4 p-4 animate-pulse">
      <div className="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 py-1">
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="h-3 w-1/3 bg-gray-100 rounded" />
        <div className="flex justify-between mt-auto">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Full list with search, filter, loading & empty states ───────────────────
export default function ProductList({
  products = [],
  isLoading = false,
  onUpdated,
  onDeleted,
}) {
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");

  const conditions = ["all", "new", "like new", "good", "fair", "poor"];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCondition =
      filterCondition === "all" ||
      p.condition?.toLowerCase().replace("_", " ") === filterCondition;
    return matchSearch && matchCondition;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-300"
        />
        <div className="flex gap-2 flex-wrap">
          {conditions.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCondition(c)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border capitalize transition-all duration-150 ${
                filterCondition === c
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && products.length > 0 && (
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-600">{products.length}</span>{" "}
          products
        </p>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <Package size={24} className="text-emerald-400" />
          </div>
          <p className="text-sm text-gray-500">
            {products.length === 0
              ? "You haven't added any products yet."
              : "No products match your search."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
