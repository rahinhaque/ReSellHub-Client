"use client";

import { useState } from "react";
import { Trash2, X, Loader2, AlertTriangle } from "lucide-react";
import { serverMutation } from "@/lib/api/server";


export default function DeleteConfirmModal({
  productTitle,
  productId,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      await serverMutation(`/api/sellerProducts/${productId}`, "DELETE");
      onDeleted();
    } catch (err) {
      setError("Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Delete Product
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">
              "{productTitle}"
            </span>
            ? This action cannot be undone.
          </p>
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full">
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
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 text-sm font-semibold text-white bg-red-500 rounded-xl py-2.5 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
