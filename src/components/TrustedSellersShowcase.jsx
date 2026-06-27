"use client";

import { Star, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const SELLERS = [
  {
    name: "Ayesha Rahman",
    username: "@ayesha_store",
    rating: "4.9",
    reviews: "325 Reviews",
    products: "148 Products Sold",
    badge: "Top Rated",
  },
  {
    name: "Rakib Hasan",
    username: "@rakib_market",
    rating: "5.0",
    reviews: "412 Reviews",
    products: "201 Products Sold",
    badge: "Verified Seller",
  },
  {
    name: "Nusrat Jahan",
    username: "@nusrat_resell",
    rating: "4.8",
    reviews: "286 Reviews",
    products: "123 Products Sold",
    badge: "Trusted Seller",
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

function Rating() {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={15} fill="currentColor" />
      ))}
    </div>
  );
}

export default function TrustedSellersShowcase() {
  return (
    <section className="w-full bg-gray-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            <ShieldCheck size={16} />
            Trusted Sellers
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-extrabold text-gray-900">
            Meet Our Top-Rated Sellers
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Buy with confidence from highly rated sellers known for quality
            products, quick responses, and excellent customer experiences.
          </p>
        </motion.div>

        {/* Seller Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {SELLERS.map((seller, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Badge */}
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <BadgeCheck size={14} />
                  {seller.badge}
                </span>
              </div>

              {/* Avatar */}
              <div className="mt-2 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700 cursor-pointer shadow-inner"
                >
                  {seller.name.charAt(0)}
                </motion.div>
              </div>

              {/* Info */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {seller.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">{seller.username}</p>

                <div className="mt-4 flex justify-center">
                  <Rating />
                </div>

                <p className="mt-2 text-sm font-medium text-gray-700">
                  ⭐ {seller.rating} Rating
                </p>

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p>{seller.reviews}</p>
                  <p>{seller.products}</p>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 shadow-sm"
              >
                View Profile
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-16 rounded-3xl bg-white border border-gray-100 p-10 text-center shadow-sm"
        >
          <h3 className="text-3xl font-bold text-gray-900">
            Become a Trusted Seller
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Build your reputation by providing quality products, maintaining
            great communication, and earning positive reviews from buyers.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 shadow-md"
          >
            Start Selling
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
