"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  getWishlistByUser,
  removeFromWishlist,
} from "@/lib/api/buyer/wishlist/action";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Clock3,
  User,
  ArrowRight,
} from "lucide-react";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function BuyerWishList() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await getWishlistByUser(user.email);
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user?.email]);

  const handleRemove = async (wishlistId) => {
    try {
      setRemovingId(wishlistId);
      await removeFromWishlist(wishlistId);
      setItems((prev) => prev.filter((item) => item._id !== wishlistId));
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Heart className="text-gray-300" size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Login required</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Please log in to view your wishlist.
        </p>
        <button
          onClick={() => router.push("/Login")}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Go to login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="animate-pulse flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100" />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-4 w-2/3 bg-gray-100 rounded" />
                  <div className="h-4 w-1/3 bg-gray-100 rounded" />
                  <div className="h-8 w-32 bg-gray-100 rounded-xl mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="text-gray-300" size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          Save products you like so you can find them quickly later.
        </p>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500">
            Saved products you want to revisit later
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {items.length} saved
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href={`/products/${item.productId}`}
                className="w-full md:w-28 h-56 md:h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="text-gray-300" size={26} />
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-base md:text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                      >
                        {item.title || "Untitled product"}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        ৳{Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-60"
                      title="Remove from wishlist"
                    >
                      <Trash2
                        size={15}
                        className={
                          removingId === item._id
                            ? "text-red-300"
                            : "text-red-500"
                        }
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <User size={12} />
                      {item.sellerInfo?.name || "Unknown seller"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={12} />
                      {item.createdAt ? timeAgo(item.createdAt) : "Recently"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    View details
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href={`/products/${item.productId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Open page
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
