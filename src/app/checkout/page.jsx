// app/checkout/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getProductById } from "@/lib/api/payment/data";
import { createCheckoutSession } from "@/lib/api/payment/action";
import Link from "next/link";
import {
  Package,
  Tag,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CreditCard,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";

const CONDITION_LABELS = {
  used: "Used",
  like_new: "Like New",
  refurbished: "Refurbished",
};

function Skeleton() {
  return (
    <div className="max-w-lg mx-auto py-10 px-4 animate-pulse flex flex-col gap-5">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <div className="w-full h-52 bg-gray-100 rounded-xl" />
        <div className="h-5 w-2/3 bg-gray-100 rounded" />
        <div className="h-8 w-1/3 bg-gray-100 rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const productId = searchParams.get("productId");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      router.push("/products");
      return;
    }
    const fetch = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  const handleProceed = async () => {
    if (!user) {
      router.push("/Login");
      return;
    }
    try {
      setPaying(true);
      setError("");

      const { url } = await createCheckoutSession({
        productId: product._id,
        productTitle: product.title || product.productTitle,
        productImage: Array.isArray(product.images)
          ? product.images[0]
          : product.productImage || "",
        price: product.price,
        buyerEmail: user.email,
        buyerName: user.name,
        buyerId: user.id,
        sellerId: product.sellerInfo?.userId || "",
        sellerName: product.sellerInfo?.name || "",
        sellerEmail: product.sellerInfo?.email || "",
      });

      window.location.href = url;
    } catch (err) {
      setError("Could not start checkout. Please try again.");
      setPaying(false);
    }
  };

  if (loading) return <Skeleton />;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Package size={24} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-500">Product not found.</p>
          <Link
            href="/products"
            className="text-sm text-emerald-600 hover:underline"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const image = Array.isArray(product.images)
    ? product.images[0]
    : product.productImage;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto flex flex-col gap-5">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Review your order
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Confirm the details before proceeding to payment.
          </p>
        </div>

        {/* ── Product card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {image && (
            <div className="w-full h-52 bg-gray-100 overflow-hidden">
              <img
                src={image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-5 flex flex-col gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {product.title || product.productTitle}
              </h2>
              {product.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                  <Tag size={11} />
                  {product.category}
                </span>
              )}
              {product.condition && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                  <Sparkles size={11} />
                  {CONDITION_LABELS[product.condition] || product.condition}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Order summary
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Product</span>
              <span className="text-gray-800 font-medium truncate max-w-[200px] text-right">
                {product.title || product.productTitle}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="text-gray-800 font-medium">1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Unit price</span>
              <span className="text-gray-800 font-medium">
                ${Number(product.price).toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-lg font-bold text-emerald-600">
                ${Number(product.price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Buyer info ── */}
        {user && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Your information
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <User size={14} className="text-emerald-500" />
                </div>
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Seller info ── */}
        {product.sellerInfo && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Seller
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
                {(product.sellerInfo.name || "S").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {product.sellerInfo.name}
                </p>
                <p className="text-xs text-gray-400">
                  {product.sellerInfo.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Trust badge ── */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secured by Stripe — your card details are never stored
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2.5 pb-10">
          <button
            onClick={handleProceed}
            disabled={paying}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2.5 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {paying ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Redirecting to payment…
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Proceed to Payment — ${Number(product.price).toLocaleString()}
              </>
            )}
          </button>

          <button
            onClick={() => router.back()}
            disabled={paying}
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
