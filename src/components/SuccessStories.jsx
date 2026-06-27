"use client";

import { Star, Quote, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const STORIES = [
  {
    name: "Ayesha Rahman",
    role: "Buyer",
    message:
      "I found a near-new laptop at almost half the price. The seller was super responsive and the whole process was smooth.",
    rating: 5,
    type: "buyer",
  },
  {
    name: "Rakib Hasan",
    role: "Seller",
    message:
      "I sold my unused camera within 2 days. The platform made it really easy to connect with real buyers.",
    rating: 5,
    type: "seller",
  },
  {
    name: "Nusrat Jahan",
    role: "Buyer",
    message:
      "Love how easy it is to find affordable items. It also feels good knowing I’m reducing waste.",
    rating: 5,
    type: "buyer",
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
  hidden: { opacity: 0, y: 30 },
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

function Stars({ count }) {
  return (
    <div className="flex gap-1 text-yellow-500">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </div>
  );
}

export default function SuccessStories() {
  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Success Stories
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from people who buy and sell on ReSell Hub every
            day.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {STORIES.map((story, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-5 right-5 text-green-200"
                size={40}
              />

              {/* Role badge */}
              <div
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                  story.type === "buyer"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {story.role}
              </div>

              {/* Message */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {story.message}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{story.name}</p>
                  <Stars count={story.rating} />
                </div>

                <ArrowRight className="text-gray-400" size={18} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mt-14"
        >
          <p className="text-gray-600 mb-4">Want to share your experience?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold transition shadow-md"
          >
            Share Your Story
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
