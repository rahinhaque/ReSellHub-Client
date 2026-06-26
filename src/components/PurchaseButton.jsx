// components/PurchaseButton.jsx
"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function PurchaseButton({ product }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/checkout?productId=${product._id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all"
    >
      <ShoppingCart size={16} />
      Purchase Now
    </button>
  );
}
