"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f0f5ef]">
      {/* Background split — only visible on lg+ where layout is side-by-side */}
      <div className="absolute inset-0 hidden lg:flex">
        <div className="w-1/2 bg-[#f0f5ef]" />
        <div className="w-1/2 bg-[#c8dbc4]" />
      </div>
      {/* Mobile background */}
      <div className="absolute inset-0 lg:hidden bg-[#f0f5ef]" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 items-center min-h-[auto] lg:min-h-[85vh] gap-8 lg:gap-12 py-12 lg:py-16">

          {/* LEFT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-green-200 text-green-700 text-xs sm:text-sm font-medium mb-5 lg:mb-6"
            >
              <Leaf size={14} />
              Buy Smart. Sell Easy. Live Sustainable.
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900"
            >
              Buy, Sell &amp; Save
              <br />
              <span className="text-green-600">with ReSell Hub</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 lg:mt-5 text-gray-600 text-base sm:text-lg max-w-md mx-auto lg:mx-0"
            >
              Your trusted marketplace for pre-owned items. Great deals, real
              people, and a cleaner planet.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 sm:gap-4 mt-6 lg:mt-8 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold shadow-lg transition text-sm sm:text-base"
                >
                  <ShoppingBag size={16} />
                  Shop Now
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard/listings/new"
                  className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold transition text-sm sm:text-base"
                >
                  <Tag size={16} />
                  Sell Your Item
                </Link>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 sm:gap-6 mt-8 lg:mt-10 justify-center lg:justify-start"
            >
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-green-200 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-green-600" />
                  </div>
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[600px] h-[260px] sm:h-[380px] lg:h-[600px]"
            >
              <Image
                src="/images/hero-banner.png"
                alt="ReSell Hub Hero Banner"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 480px, 600px"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pb-10 lg:pb-14"
        >
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label, sub }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-gray-100 ${
                  i % 2 === 1 ? "border-l" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0`}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-green-600 sm:hidden" />
                  <Icon size={22} className="text-green-600 hidden sm:block" />
                </div>

                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 hidden sm:block">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
