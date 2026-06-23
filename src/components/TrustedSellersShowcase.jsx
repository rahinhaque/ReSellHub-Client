"use client";

import { Star, ShieldCheck, BadgeCheck, ArrowRight } from "lucide-react";

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
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-14">
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
        </div>

        {/* Seller Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SELLERS.map((seller, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                  {seller.name.charAt(0)}
                </div>
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
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800">
                View Profile
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl bg-white border border-gray-100 p-10 text-center shadow-sm">
          <h3 className="text-3xl font-bold text-gray-900">
            Become a Trusted Seller
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Build your reputation by providing quality products, maintaining
            great communication, and earning positive reviews from buyers.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800">
            Start Selling
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
