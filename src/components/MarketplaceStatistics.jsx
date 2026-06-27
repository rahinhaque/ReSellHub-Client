"use client";

import { Package, Users, ShoppingCart, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  {
    icon: Package,
    label: "Total Products",
    value: "12,500+",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Users,
    label: "Total Sellers",
    value: "3,200+",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Users,
    label: "Total Buyers",
    value: "18,400+",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: CheckCircle,
    label: "Completed Orders",
    value: "9,750+",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function MarketplaceStatistics() {
  return (
    <section className="w-full bg-gray-50 py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Marketplace Statistics
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            A quick snapshot of what&apos;s happening across the platform in real
            time.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 mx-auto flex items-center justify-center rounded-full ${stat.bg}`}
                >
                  <Icon className={stat.color} size={20} />
                </div>

                {/* Value */}
                <h3 className="mt-3 sm:mt-5 text-xl sm:text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="mt-1 sm:mt-2 text-gray-600 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
