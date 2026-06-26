"use client";

import { useState } from "react";
import { X, Flag, Loader2 } from "lucide-react";
import { serverMutation } from "@/lib/api/server";

const REASONS = [
  "Fake or misleading listing",
  "Prohibited item",
  "Spam or duplicate",
  "Inappropriate content",
  "Wrong category",
  "Other",
];

export default function ReportModal({ product, user, onClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await serverMutation("/api/reports", "POST", {
        productId: String(product._id),
        productTitle: product.title || "",
        reporterEmail: user.email,
        reason,
        details,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Flag size={15} className="text-red-500" />
            <h2 className="text-sm font-semibold text-gray-800">
              Report Listing
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Flag size={20} className="text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Report submitted
            </p>
            <p className="text-xs text-gray-400">
              Our team will review this listing shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 flex flex-col gap-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Reporting:{" "}
              <span className="font-medium text-gray-700">{product.title}</span>
            </p>

            {/* Reason */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`text-xs px-3 py-2 rounded-xl border text-left transition-all ${
                      reason === r
                        ? "bg-red-50 border-red-200 text-red-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Additional details{" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue…"
                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pb-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
