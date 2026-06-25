// app/payment/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmOrder } from "@/lib/api/payment/action";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Package,
  ArrowRight,
  XCircle,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const confirm = async () => {
      try {
        const data = await confirmOrder(sessionId);
        if (data.success) {
          setOrderId(data.orderId);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirm();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <Loader2 size={28} className="text-emerald-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-500">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-400">
            We couldn't confirm your payment. If you were charged, contact
            support with your session ID below.
          </p>
          {sessionId && (
            <p className="text-xs text-gray-300 font-mono break-all bg-gray-50 px-3 py-2 rounded-lg w-full">
              {sessionId}
            </p>
          )}
          <Link
            href="/products"
            className="mt-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold text-gray-900">
            Payment successful!
          </h1>
          <p className="text-sm text-gray-400">
            Your order has been placed and is now being processed by the seller.
          </p>
        </div>

        {orderId && (
          <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-left">
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 w-full mt-1">
          <Link
            href="/dashboard/buyer"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Package size={16} />
            View my orders
          </Link>
          <Link
            href="/products"
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            Continue shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
