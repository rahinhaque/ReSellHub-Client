// app/payment/success/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmOrder } from "@/lib/api/payment/action";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Package,
  ArrowRight,
  XCircle,
  Receipt,
  CalendarDays,
  Hash,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading");
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const confirm = async () => {
      try {
        const data = await confirmOrder(sessionId);
        if (data.success) {
          setOrderData(data);
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

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <Loader2 size={28} className="text-emerald-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Confirming your payment…
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This will only take a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={28} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              We couldn't confirm your payment. If you were charged, please
              contact support with your session ID below.
            </p>
          </div>
          {sessionId && (
            <div className="w-full bg-gray-50 rounded-xl px-4 py-3 text-left">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                Session ID
              </p>
              <p className="text-xs font-mono text-gray-500 break-all">
                {sessionId}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2 w-full mt-1">
            <Link
              href="/products"
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-md w-full flex flex-col gap-4">
        {/* Success hero */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Payment successful!
            </h1>
            <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
              Your order has been placed and the seller has been notified.
              You'll receive updates as your order progresses.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Receipt size={12} />
            Order summary
          </p>

          <div className="flex flex-col gap-3">
            {/* Order ID */}
            {orderData?.orderId && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Hash size={13} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-xs font-mono text-gray-700 break-all mt-0.5">
                    {orderData.orderId}
                  </p>
                </div>
              </div>
            )}

            {/* Transaction ID */}
            {sessionId && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Receipt size={13} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </p>
                  <p className="text-xs font-mono text-gray-500 break-all mt-0.5">
                    {sessionId}
                  </p>
                </div>
              </div>
            )}

            {/* Payment date */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays size={13} className="text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Payment date
                </p>
                <p className="text-xs text-gray-700 mt-0.5">
                  {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>

            {/* Payment status */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <DollarSign size={13} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Payment status
                </p>
                <span className="inline-flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {orderData?.orderId && (
            <Link
              href={`/dashboard/buyer/orders`}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Package size={16} />
              View order details
            </Link>
          )}

          <Link
            href="/dashboard/buyer/orders"
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag size={15} />
            Go to my orders
          </Link>

          <Link
            href="/products"
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            Continue shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Default export wraps in Suspense for static generation ────────────────────
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
