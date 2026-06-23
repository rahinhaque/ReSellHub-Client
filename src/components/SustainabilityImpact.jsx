"use client";

import { Leaf, Recycle, Trees, Earth, ArrowRight } from "lucide-react";

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

export default function SustainabilityImpact() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-semibold">
            <Leaf size={16} />
            Sustainability Impact
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-extrabold text-gray-900">
            Every Purchase Makes a Difference
          </h2>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Choosing second-hand products isn't just good for your wallet—it's
            one of the easiest ways to reduce waste, conserve resources, and
            help build a more sustainable future.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {IMPACTS.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
                >
                  <Icon className={item.color} size={26} />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-16 rounded-3xl bg-green-700 px-8 py-10 text-center text-white">
          <h3 className="text-3xl font-bold">
            Small Choices. Big Environmental Impact.
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-green-100 text-lg leading-relaxed">
            Every item bought or sold on ReSell Hub helps extend a product's
            lifecycle, reducing unnecessary waste and supporting a circular
            economy where resources are reused instead of discarded.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
            Start Shopping Sustainably
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
