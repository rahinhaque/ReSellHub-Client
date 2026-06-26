"use client";

import { useEffect, useMemo, useState } from "react";
import { serverFetch } from "@/lib/api/server";
import { toast } from "sonner";
import { FaUsers, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { Loader2, RefreshCw } from "lucide-react";

const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await serverFetch("/api/admin/overview");
      setStats(data);
      toast.success("Dashboard stats loaded");
    } catch (error) {
      toast.error(error?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Total Users",
        value: stats?.totalUsers,
        icon: <FaUsers className="text-xl text-indigo-500" />,
        ring: "from-indigo-500/20 to-indigo-500/5",
        accent: "border-indigo-500/20",
        bg: "bg-indigo-500/5",
      },
      {
        label: "Total Products",
        value: stats?.totalProducts,
        icon: <FaBoxOpen className="text-xl text-pink-500" />,
        ring: "from-pink-500/20 to-pink-500/5",
        accent: "border-pink-500/20",
        bg: "bg-pink-500/5",
      },
      {
        label: "Total Orders",
        value: stats?.totalOrders,
        icon: <FaShoppingCart className="text-xl text-emerald-500" />,
        ring: "from-emerald-500/20 to-emerald-500/5",
        accent: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
      },
    ],
    [stats],
  );

  const handleRefresh = async () => {
    setRetrying(true);
    await fetchStats();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Admin overview
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Full platform control and statistics in one place.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={retrying || loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {retrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium text-slate-500">
                Loading dashboard stats...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`relative overflow-hidden rounded-3xl border ${card.accent} bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.ring} opacity-100`}
                />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`rounded-2xl ${card.bg} p-3`}>
                      {card.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      Live stats
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                    {card.value ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
