"use client";

import { useEffect, useState } from "react";
import { BarChart2, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const BAR_COLORS = [
  "#10b981",
  "#22c55e",
  "#34d399",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

function SectionCard({ children }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function EmptyChart({ message = "No data yet." }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

export default function PopularCategory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products?limit=100");
        const json = await res.json();

        const products = Array.isArray(json?.products) ? json.products : [];

        const counts = products.reduce((acc, product) => {
          const category = product.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = { category, products: 0, sold: 0 };
          }
          acc[category].products += 1;
          if (product.status === "sold") acc[category].sold += 1;
          return acc;
        }, {});

        const list = Object.values(counts)
          .sort((a, b) => b.products - a.products)
          .slice(0, 6);

        setData(list);
      } catch (error) {
        console.error("Failed to load category data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionCard>
          <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 px-6 py-5 border-b border-emerald-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Sparkles size={12} />
                  Trending Insights
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                  Popular Category
                </h2>

                <p className="mt-2 text-sm text-slate-500 max-w-lg">
                  Discover the categories with the most products right now. These
                  are the most active and trending categories on your platform.
                </p>
              </div>

              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-sm">
                <TrendingUp size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-4 w-16 rounded bg-gray-200" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : !data.length ? (
              <EmptyChart message="No products listed yet." />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-4"
              >
                {data.map((cat, i) => {
                  const max = data[0]?.products || 1;
                  const pct = Math.round((cat.products / max) * 100);

                  return (
                    <motion.div
                      key={cat.category}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 transition hover:bg-emerald-50"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                            style={{
                              backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                            }}
                          >
                            <BarChart2 size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {cat.category}
                            </p>
                            <p className="text-xs text-slate-500">
                              {cat.products} products listed
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-700">
                            {pct}%
                          </p>
                          <p className="text-[11px] text-slate-400">Trending</p>
                        </div>
                      </div>

                      <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-emerald-100">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                          style={{
                            backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Most active category</span>
                        <span>Sold: {cat.sold}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </SectionCard>
      </motion.div>
    </div>
  );
}
