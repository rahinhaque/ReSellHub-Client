"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { serverMutation } from "@/lib/api/server";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Furniture",
  "Books",
  "Sports",
  "Toys",
  "Vehicles",
  "Home & Garden",
  "Music",
  "Other",
];
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({
    productTitle: product.productTitle || "",
    category: product.category || "",
    condition: product.condition || "",
    price: product.price || "",
    quantity: product.quantity || "",
    description: product.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.productTitle.trim()) {
      setError("Product title is required.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const updated = await serverMutation(
        `/api/sellerProducts/${product._id}`,
        "PUT",
        form,
      );
      onUpdated({ ...product, ...form, ...updated });
    } catch (err) {
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* Title */}
          <Field label="Product Title">
            <input
              name="productTitle"
              value={form.productTitle}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. iPhone 13 Pro"
            />
          </Field>

          {/* Category + Condition */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Condition">
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select…</option>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (৳)">
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={inputCls}
                placeholder="0"
                min={0}
              />
            </Field>
            <Field label="Quantity">
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className={inputCls}
                placeholder="1"
                min={1}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Describe your product…"
            />
          </Field>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 text-sm font-semibold text-white bg-emerald-500 rounded-xl py-2.5 hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all w-full";
