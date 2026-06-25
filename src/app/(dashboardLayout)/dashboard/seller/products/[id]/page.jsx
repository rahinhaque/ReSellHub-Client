"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { serverFetch } from "@/lib/api/server";
import {
  ArrowLeft, Tag, Package, Clock,
  Phone, Mail, User, Layers, BadgeCheck,
} from "lucide-react";

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

const statusStyles = {
  available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  sold: "bg-gray-100 text-gray-500 border border-gray-200",
  reserved: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await serverFetch(`/api/sellerProducts/product/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) return <ProductDetailsSkeleton />;

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Package size={40} className="text-gray-300" />
      <p className="text-gray-400 text-sm">Product not found.</p>
      <button
        onClick={() => router.back()}
        className="text-sm text-emerald-600 hover:underline"
      >
        Go back
      </button>
    </div>
  );

  const images = Array.isArray(product.images)
    ? product.images
    : product.productImage
    ? [product.productImage]
    : [];

  const conditionKey = product.condition || "used";
  const statusKey = product.status || "available";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>

        {/* Image gallery */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Main image */}
          <div className="w-full h-72 bg-gray-100">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={product.title || "Product"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-emerald-400"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title + badges */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold text-gray-800 leading-snug">
              {product.title || product.productTitle || "Untitled product"}
            </h1>
            <span className="text-xl font-bold text-emerald-600 whitespace-nowrap">
              ৳{Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                conditionStyles[conditionKey] || conditionStyles["used"]
              }`}
            >
              {conditionLabels[conditionKey] || conditionKey}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                statusStyles[statusKey] || statusStyles["available"]
              }`}
            >
              {statusKey}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <Tag size={12} />
              {product.category || "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers size={12} />
              Stock: {product.quantity ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {product.createdAt ? timeAgo(product.createdAt) : "Recently"}
            </span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BadgeCheck size={15} className="text-emerald-400" />
              Description
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* Seller info */}
        {product.sellerInfo && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User size={15} className="text-emerald-400" />
              Seller Info
            </h2>
            <div className="flex flex-col gap-2.5">
              {product.sellerInfo.name && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <User size={13} className="text-emerald-500" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {product.sellerInfo.name}
                  </span>
                </div>
              )}

              {product.sellerInfo.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={13} className="text-blue-500" />
                  </div>

                  <a
                    href={`mailto:${product.sellerInfo.email}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {product.sellerInfo.email}
                  </a>
                </div>
              )}

              {product.sellerInfo.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-emerald-500" />
                  </div>

                  <a
                    href={`tel:${product.sellerInfo.phone}`}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    {product.sellerInfo.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-pulse">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="w-full h-72 bg-gray-100" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <div className="h-5 w-2/3 bg-gray-100 rounded" />
          <div className="h-4 w-1/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-3 w-4/6 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100" />
              <div className="h-3 w-44 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
