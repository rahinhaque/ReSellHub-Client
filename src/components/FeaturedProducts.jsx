"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setError("");

        const res = await fetch("http://localhost:5000/api/products?limit=6");

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data?.products) ? data.products : []);
      } catch (err) {
        console.error(err);
        setError("Could not load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Feature Latest Product
            </h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-emerald-500" />
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300"
          >
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <div className="h-56 bg-slate-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
                  <div className="h-5 w-1/3 rounded bg-slate-100 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No featured products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  {Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.title || "Product"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}

                  <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                    Latest
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                    {product.title ||
                      product.productTitle ||
                      "Untitled product"}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-emerald-600">
                      ৳{Number(product.price || 0).toLocaleString()}
                    </p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {product.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="mt-4 h-px w-full bg-slate-100" />

                  <p className="mt-3 text-sm text-slate-500">
                    {product.status || "available"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
