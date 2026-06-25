// components/PurchaseButton.jsx
"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { createCheckoutSession } from "@/lib/api/payment/action";
import { Loader2, ShoppingCart } from "lucide-react";

export default function PurchaseButton({ product }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    try {
      setLoading(true);
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
      console.error("Checkout error:", err);
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Redirecting to payment…
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Purchase Now
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
