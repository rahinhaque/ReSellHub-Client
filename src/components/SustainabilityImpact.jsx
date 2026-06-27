"use client";

import { Leaf, Recycle, Trees, Earth, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const IMPACTS = [
  {
    icon: Recycle,
    title: "Reduce Waste",
    description:
      "Every second-hand purchase gives products a longer life and keeps usable items out of landfills.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Leaf,
    title: "Lower Carbon Footprint",
    description:
      "Buying pre-owned products reduces the demand for manufacturing new goods, saving energy and resources.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Trees,
    title: "Protect Natural Resources",
    description:
      "Reusing existing products helps conserve raw materials like wood, metals, plastics, and water.",
    color: "text-lime-600",
    bg: "bg-lime-50",
  },
  {
    icon: Earth,
    title: "Support a Greener Future",
    description:
      "Small sustainable choices made by thousands of people create a cleaner and healthier planet.",
    color: "text-blue-600",
    bg: "bg-blue-50",
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
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

export default function SustainabilityImpact() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-semibold">
            <Leaf size={16} />
            Sustainability Impact
          </span>

          <h2 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Every Purchase Makes a Difference
          </h2>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Choosing second-hand products isn&apos;t just good for your wallet—it&apos;s
            one of the easiest ways to reduce waste, conserve resources, and
            help build a more sustainable future.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {IMPACTS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8 shadow-sm transition-shadow"
              >
                <div
                  className={`mb-5 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full ${item.bg}`}
                >
                  <Icon className={item.color} size={24} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 sm:mt-16 rounded-3xl bg-green-700 px-6 sm:px-8 py-8 sm:py-10 text-center text-white shadow-lg"
        >
          <h3 className="text-2xl sm:text-3xl font-bold">
            Small Choices. Big Environmental Impact.
          </h3>

          <p className="mx-auto mt-3 sm:mt-4 max-w-3xl text-green-100 text-sm sm:text-lg leading-relaxed">
            Every item bought or sold on ReSell Hub helps extend a product&apos;s
            lifecycle, reducing unnecessary waste and supporting a circular
            economy where resources are reused instead of discarded.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 sm:px-6 py-3 font-semibold text-green-700 transition shadow-md text-sm sm:text-base"
          >
            Start Shopping Sustainably
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
