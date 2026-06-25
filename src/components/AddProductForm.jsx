"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { addProducts } from "@/lib/api/seller/action";
import {
  Upload, X, Package, FileText, Tag, Sparkles,
  DollarSign, Layers, ImagePlus, ChevronDown, Loader2, Phone, User,
} from "lucide-react";

const CATEGORIES = [
  "Electronics", "Clothing & Fashion", "Furniture & Home",
  "Books & Media", "Sports & Outdoors", "Toys & Games",
];

const CONDITIONS = [
  { value: "used", label: "Used", desc: "Shows signs of wear", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "like_new", label: "Like New", desc: "Barely used, no defects", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "refurbished", label: "Refurbished", desc: "Professionally restored", color: "text-blue-600 bg-blue-50 border-blue-200" },
];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST", body: formData,
  });
  if (!res.ok) throw new Error("ImgBB upload failed");
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "ImgBB upload failed");
  return data.data.url;
}

export default function AddProductForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session } = useSession();

  // Pull seller info from session
  const sellerInfo = {
    userId: session?.user?.id || "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",   // filled by seller below
  };

  const [images, setImages] = useState([]);        // { file, preview }[]
  const [dragOver, setDragOver] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [phone, setPhone] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    quantity: "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageFiles = (files) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const oversized = incoming.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) { setUploadError("Each image must be under 5MB."); return; }
    if (images.length + incoming.length > 5) { setUploadError("Max 5 images allowed."); return; }
    setUploadError("");
    const newEntries = incoming.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newEntries]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { setUploadError("Please upload at least one image."); return; }

    try {
      setSubmitting(true);
      setUploadError("");

      // Upload all images to ImgBB in parallel
      const uploadedUrls = await Promise.all(images.map((img) => uploadToImgBB(img.file)));

      const productData = {
        title: form.title,
        description: form.description,
        category: form.category,
        condition: form.condition,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        images: uploadedUrls,
        sellerInfo: { ...sellerInfo, phone },
        status: "available",
      };

      await addProducts(productData);
      router.push("/dashboard/seller");
      router.refresh();
    } catch (err) {
      console.error("❌ Submit error:", err);
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

          {/* ── Multi-image upload ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <ImagePlus size={15} className="text-gray-400" />
              Product images
              <span className="text-xs text-gray-400 font-normal">(up to 5)</span>
            </label>

            {/* Previews grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="p-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {/* Add more slot */}
                {images.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
                  >
                    <Upload size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Add more</span>
                  </div>
                )}
              </div>
            )}

            {/* Drop zone (shown when no images yet) */}
            {images.length === 0 && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                  ${dragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40"}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-emerald-100" : "bg-white border border-gray-200"}`}>
                  <Upload size={20} className={dragOver ? "text-emerald-500" : "text-gray-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Drop images here, or <span className="text-emerald-600">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5MB each · up to 5 images</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />

            {uploadError && (
              <p className="mt-2.5 text-xs text-red-500 flex items-center gap-1.5">
                <X size={12} /> {uploadError}
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
            <p className="text-xs text-gray-400 mt-2 text-right">{form.description.length} characters</p>
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
                  ${form.category ? "border-emerald-300 text-gray-900 bg-white" : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
              >
                {form.category || "Select a category"}
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-lg z-20 py-1 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat} type="button"
                      onClick={() => { handleChange("category", cat); setCatOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${form.category === cat ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
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
                  key={value} type="button"
                  onClick={() => handleChange("condition", value)}
                  className={`flex flex-col gap-1 px-3 py-3 rounded-xl border text-left transition-all
                    ${form.condition === value ? `${color} border` : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}
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
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    type="number" min="0" step="0.01" placeholder="0.00"
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
                  type="number" min="1" step="1" placeholder="1"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                />
              </div>
            </div>
          </div>

          {/* ── Seller Info ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <User size={15} className="text-gray-400" />
              Seller info
            </label>
            <div className="space-y-3">
              {/* Name & Email are read-only from session */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Name</p>
                  <div className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-600">
                    {session?.user?.name || "—"}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <div className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-600 truncate">
                    {session?.user?.email || "—"}
                  </div>
                </div>
              </div>
              {/* Phone — editable */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Phone number</p>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-1 pb-10">
            <button
              type="button" onClick={() => router.back()} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (<><Loader2 size={15} className="animate-spin" />Uploading…</>) : "List product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
