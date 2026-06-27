"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api/server";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
} from "@/lib/api/buyer/wishlist/action";
import PurchaseButton from "@/components/PurchaseButton";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Tag,
  Clock,
  Layers,
  Phone,
  Mail,
  User,
  BadgeCheck,
  MessageCircle,
  Share2,
  Shield,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Flag,
} from "lucide-react";
import ReportModal from "@/components/ReportModal";

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
  sold: "bg-red-50 text-red-600 border border-red-200",
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

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 animate-pulse">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="w-full h-80 bg-gray-100" />
            <div className="flex gap-2 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              <div className="h-6 w-3/4 bg-gray-100 rounded" />
              <div className="h-8 w-1/3 bg-gray-100 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const role = user?.role ?? null;

  const isBuyer = role === "buyer";
  const canInteract = isBuyer;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await serverFetch(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadWishlistState = async () => {
      if (!user?.email || !product?._id || !canInteract) return;

      try {
        const items = await getWishlistByUser(user.email);
        const found = Array.isArray(items)
          ? items.find((item) => String(item.productId) === String(product._id))
          : null;

        if (found) {
          setWishlisted(true);
          setWishlistId(found._id);
        } else {
          setWishlisted(false);
          setWishlistId(null);
        }
      } catch (error) {
        console.error("Failed to load wishlist state:", error);
      }
    };

    loadWishlistState();
  }, [user?.email, product?._id, canInteract]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user) {
      router.push("/Login");
      return;
    }

    if (!canInteract || !product) return;

    setWishlistLoading(true);
    try {
      if (wishlisted && wishlistId) {
        await removeFromWishlist(wishlistId);
        setWishlisted(false);
        setWishlistId(null);
        return;
      }

      const payload = {
        productId: String(product._id),
        userId: user.id || "",
        userEmail: user.email || "",
        title: product.title || product.productTitle || "Untitled product",
        price: Number(product.price) || 0,
        image:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.productImage || "",
        sellerInfo: product.sellerInfo || null,
      };

      const result = await addToWishlist(payload);
      setWishlisted(true);
      if (result?._id) setWishlistId(result._id);
    } catch (error) {
      console.error("Wishlist update failed:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const openReportModal = () => {
    if (!user) {
      router.push("/Login");
      return;
    }
    if (!canInteract) return;
    setShowReportModal(true);
  };

  if (isLoading) return <Skeleton />;

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Package size={28} className="text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm">Product not found.</p>
        <Link
          href="/products"
          className="text-sm text-emerald-600 hover:underline"
        >
          Browse all products
        </Link>
      </div>
    );

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.productImage
        ? [product.productImage]
        : [];

  const conditionKey = product.condition || "used";
  const statusKey = product.status || "available";
  const isSold = statusKey === "sold";
  const isSeller = role === "seller";
  const isGuest = !user;

  const prevImage = () =>
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () =>
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));

  const renderCTA = () => {
    if (!canInteract) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        >
          <Lock size={15} />
          Only buyers can purchase or save items
        </button>
      );
    }

    if (isSold) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          <Package size={16} />
          This item is sold
        </button>
      );
    }

    if (isGuest) {
      return (
        <Link
          href="/Login"
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
        >
          <Package size={16} />
          Log in to Purchase
        </Link>
      );
    }

    return <PurchaseButton product={product} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-emerald-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">
            {product.title || "Product"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative w-full h-80 bg-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <Package size={48} className="text-gray-300" />
                    <span className="text-sm text-gray-300">No image</span>
                  </div>
                )}

                {isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold tracking-widest rotate-[-15deg] border-4 border-white px-6 py-2 rounded-xl opacity-90">
                      SOLD
                    </span>
                  </div>
                )}

                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading || !canInteract || isSold}
                  title={
                    !canInteract
                      ? "Only buyers can add to wishlist"
                      : wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                  }
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
                    !canInteract || isSold
                      ? "bg-white/60 cursor-not-allowed"
                      : wishlisted
                        ? "bg-red-50 border border-red-200 hover:bg-red-100"
                        : "bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  <Heart
                    size={16}
                    className={
                      !canInteract || isSold
                        ? "text-gray-300"
                        : wishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                    }
                  />
                </button>

                {canInteract && (
                  <button
                    onClick={openReportModal}
                    className="absolute bottom-3 right-3 py-2 px-3 rounded-xl text-xs font-medium border border-gray-100 bg-white/95 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Flag size={12} />
                    Report listing
                  </button>
                )}

                {showReportModal && (
                  <ReportModal
                    product={product}
                    user={user}
                    onClose={() => setShowReportModal(false)}
                  />
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeImage + 1} / {images.length}
                  </div>
                )}
              </div>

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

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield size={13} className="text-emerald-500" />
                  Secure transaction
                </div>
                <span className="text-gray-200">·</span>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-emerald-500" />
                  Verified seller
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg font-bold text-gray-800 leading-snug flex-1">
                  {product.title || product.productTitle || "Untitled product"}
                </h1>
                <button
                  onClick={handleShare}
                  title="Copy link"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex-shrink-0"
                >
                  <Share2
                    size={14}
                    className={copied ? "text-emerald-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {copied && (
                <p className="text-xs text-emerald-600 -mt-1">Link copied!</p>
              )}

              <div className="text-3xl font-bold text-emerald-600">
                ৳{Number(product.price).toLocaleString()}
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    conditionStyles[conditionKey] || conditionStyles.used
                  }`}
                >
                  {conditionLabels[conditionKey] || conditionKey}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                    statusStyles[statusKey] || statusStyles.available
                  }`}
                >
                  {statusKey}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1.5">
                  <Tag size={12} />
                  {product.category || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers size={12} />
                  {product.quantity > 0
                    ? `${product.quantity} in stock`
                    : "Out of stock"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {product.createdAt ? timeAgo(product.createdAt) : "Recently"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              {renderCTA()}

              {canInteract && !isSold && product.sellerInfo?.phone && (
                <a
                  href={`https://wa.me/${product.sellerInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi! I'm interested in your listing: ${product.title}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle size={16} />
                  Contact Seller on WhatsApp
                </a>
              )}

              {canInteract && !isSold && product.sellerInfo?.email && (
                <a
                  href={`mailto:${product.sellerInfo.email}?subject=${encodeURIComponent(
                    `Interested in: ${product.title}`,
                  )}`}
                  className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 transition-all"
                >
                  <Mail size={16} />
                  Contact Seller via Email
                </a>
              )}

              {canInteract && !isSold && (
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
                    wishlisted
                      ? "border-red-200 text-red-500 bg-red-50 hover:bg-red-100"
                      : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart
                    size={15}
                    className={wishlisted ? "fill-red-500 text-red-500" : ""}
                  />
                  {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              )}

              {canInteract && (
                <button
                  onClick={openReportModal}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 transition-all"
                >
                  <Flag size={15} />
                  Report this listing
                </button>
              )}
            </div>

            {product.sellerInfo && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User size={14} className="text-emerald-500" />
                  Seller Information
                </h2>
                <div className="flex flex-col gap-2.5">
                  {product.sellerInfo.name && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                        {product.sellerInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {product.sellerInfo.name}
                        </p>
                        <p className="text-xs text-gray-400">Seller</p>
                      </div>
                    </div>
                  )}

                  {product.sellerInfo.email && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Mail size={13} className="text-blue-500" />
                      </div>
                      <a
                        href={`mailto:${product.sellerInfo.email}`}
                        className="text-gray-500 hover:text-blue-600 transition-colors text-xs"
                      >
                        {product.sellerInfo.email}
                      </a>
                    </div>
                  )}

                  {product.sellerInfo.phone && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Phone size={13} className="text-emerald-500" />
                      </div>
                      <a
                        href={`tel:${product.sellerInfo.phone}`}
                        className="text-gray-500 hover:text-emerald-600 transition-colors text-xs"
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

        {product.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BadgeCheck size={15} className="text-emerald-400" />
              Product Description
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-600 transition-colors w-fit pb-6"
        >
          <ArrowLeft size={15} />
          Back to products
        </button>
      </div>
    </div>
  );
}
