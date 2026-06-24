"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Package,
  FileText,
  Tag,
  Sparkles,
  DollarSign,
  Layers,
  ImagePlus,
  ChevronDown,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Clothing & Fashion",
  "Furniture & Home",
  "Books & Media",
  "Sports & Outdoors",
  "Toys & Games",
];

const CONDITIONS = [
  {
    value: "used",
    label: "Used",
    desc: "Shows signs of wear",
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    value: "like_new",
    label: "Like New",
    desc: "Barely used, no defects",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    value: "refurbished",
    label: "Refurbished",
    desc: "Professionally restored",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// ── Upload image file to ImgBB, returns the direct image URL ────────
async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("ImgBB upload failed");

  const data = await res.json();

  if (!data.success) throw new Error(data.error?.message || "ImgBB upload failed");

  // data.data.url        → direct image link  (use this for <img src>)
  // data.data.display_url → same but always .png extension
  // data.data.delete_url → one-click delete link
  return data.data.url;
}

export default function AddProductForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    stock: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    setUploadError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setUploadError("Please upload a product image.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadError("");

      // 1. Upload image → get hosted URL
      const imageUrl = await uploadToImgBB(image);

      // 2. Build the final product payload
      const productData = {
        title: form.title,
        description: form.description,
        category: form.category,
        condition: form.condition,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        imageUrl,
      };

      console.log("✅ Product data ready:", productData);

      // 3. TODO: send productData to your Express API
      // await fetch(`${process.env.NEXT_PUBLIC_API}/products`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(productData),
      // });

    } catch (err) {
      console.error("Submit error:", err);
      setUploadError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Add product</h1>
          </div>
          <p className="text-sm text-gray-500 ml-12">
            Fill in the details below to list your item for sale.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Image upload ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <ImagePlus size={15} className="text-gray-400" />
              Product image
            </label>

            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X size={14} />
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                  {image?.name}
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                  ${dragOver
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40"
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-emerald-100" : "bg-white border border-gray-200"}`}>
                  <Upload size={20} className={dragOver ? "text-emerald-500" : "text-gray-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Drop your image here, or{" "}
                    <span className="text-emerald-600">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />

            {/* Upload error */}
            {uploadError && (
              <p className="mt-2.5 text-xs text-red-500 flex items-center gap-1.5">
                <X size={12} />
                {uploadError}
              </p>
            )}
          </div>

          {/* ── Title ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Package size={15} className="text-gray-400" />
              Product title
            </label>
            <input
              type="text"
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          </div>

          {/* ── Description ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <FileText size={15} className="text-gray-400" />
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the item — include any wear, accessories included, reason for selling…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">
              {form.description.length} characters
            </p>
          </div>

          {/* ── Category ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Tag size={15} className="text-gray-400" />
              Category
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition
                  ${form.category
                    ? "border-emerald-300 text-gray-900 bg-white"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
              >
                {form.category || "Select a category"}
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform ${catOpen ? "rotate-180" : ""}`}
                />
              </button>

              {catOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-lg z-20 py-1 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleChange("category", cat);
                        setCatOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${form.category === cat
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Condition ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Sparkles size={15} className="text-gray-400" />
              Condition
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CONDITIONS.map(({ value, label, desc, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange("condition", value)}
                  className={`flex flex-col gap-1 px-3 py-3 rounded-xl border text-left transition-all
                    ${form.condition === value
                      ? `${color} border`
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-[11px] leading-tight opacity-70">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Price & Stock ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <DollarSign size={15} className="text-gray-400" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Layers size={15} className="text-gray-400" />
                  Stock quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-1 pb-10">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                "List product"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
