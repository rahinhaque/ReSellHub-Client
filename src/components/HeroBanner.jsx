"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Tag,
  ShieldCheck,
  MessageCircle,
  Leaf,
  Users,
  PackageCheck,
} from "lucide-react";

const STATS = [
  {
    icon: ShoppingBag,
    value: "25K+",
    label: "Active Listings",
    sub: "Amazing items listed every day",
  },
  {
    icon: Users,
    value: "18K+",
    label: "Happy Users",
    sub: "Join our growing community",
  },
  {
    icon: PackageCheck,
    value: "12K+",
    label: "Items Sold",
    sub: "Successfully sold & delivered",
  },
  {
    icon: Leaf,
    value: "500+",
    label: "Tons Saved",
    sub: "Together we reduce waste",
  },
];

const FEATURES = [
  { icon: ShieldCheck, label: "Safe & Secure Transactions" },
  { icon: MessageCircle, label: "Chat Directly with Sellers" },
  { icon: Leaf, label: "Sustainable & Eco-friendly" },
];

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f0f5ef]">
      {/* Background split */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-[#f0f5ef]" />
        <div className="w-1/2 bg-[#c8dbc4]" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 items-center min-h-[85vh] gap-12 py-16">

          {/* LEFT CONTENT */}
          <div className="z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-green-200 text-green-700 text-sm font-medium mb-6">
              <Leaf size={14} />
              Buy Smart. Sell Easy. Live Sustainable.
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Buy, Sell & Save
              <br />
              <span className="text-green-600">with ReSell Hub</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg max-w-md">
              Your trusted marketplace for pre-owned items. Great deals, real
              people, and a cleaner planet.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg transition"
              >
                <ShoppingBag size={16} />
                Shop Now
              </Link>

              <Link
                href="/dashboard/listings/new"
                className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 px-7 py-3.5 rounded-full font-semibold transition"
              >
                <Tag size={16} />
                Sell Your Item
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mt-10">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center">
                    <Icon size={15} className="text-green-600" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE (CLEAN VERSION - FIXED QUALITY) */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] h-[520px] lg:h-[600px]">
              <Image
                src="/images/hero-banner.png"
                alt="ReSell Hub Hero Banner"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="pb-14">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-5 border-r last:border-r-0 border-gray-100"
              >
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                  <Icon size={22} className="text-green-600" />
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 hidden sm:block">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
