"use client";

import { Star, Quote, ArrowRight } from "lucide-react";

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
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Success Stories
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from people who buy and sell on ReSell Hub every
            day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {STORIES.map((story, index) => (
            <div
              key={index}
              className="relative bg-gray-50 border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition"
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
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-600 mb-4">Want to share your experience?</p>
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold transition">
            Share Your Story
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
