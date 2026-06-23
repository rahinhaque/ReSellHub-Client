"use client";

import { Package, Users, ShoppingCart, CheckCircle } from "lucide-react";

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

export default function MarketplaceStatistics() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Marketplace Statistics
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            A quick snapshot of what’s happening across the platform in real
            time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition text-center"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full ${stat.bg}`}
                >
                  <Icon className={stat.color} size={24} />
                </div>

                {/* Value */}
                <h3 className="mt-5 text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="mt-2 text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
