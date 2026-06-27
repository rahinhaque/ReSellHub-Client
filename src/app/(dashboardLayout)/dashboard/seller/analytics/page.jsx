"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getSellerAnalytics } from "@/lib/api/seller/analytics/data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  BarChart2,
} from "lucide-react";

const STATUS_COLORS = {
  pending: "#facc15",
  accepted: "#3b82f6",
  shipped: "#a855f7",
  delivered: "#10b981",
  cancelled: "#f87171",
};

const BAR_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#f87171"];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={15} className="text-emerald-500" />
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2">
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-gray-500">
          {p.name === "revenue" ? "$" : ""}
          {p.value.toLocaleString()}
          {p.name === "orders"
            ? " orders"
            : p.name === "revenue"
              ? " revenue"
              : ""}
        </p>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 h-28"
          />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 h-56"
        />
      ))}
    </div>
  );
}

export default function SellerAnalytics() {
  const { data: session } = useSession();
  const user = session?.user;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetch = async () => {
      try {
        const result = await getSellerAnalytics(user.email);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  const statusEntries = data
    ? Object.entries(data.statusBreakdown).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        color: STATUS_COLORS[status] || "#9ca3af",
      }))
    : [];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <BarChart2 size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          Your store performance at a glance.
        </p>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StatCard
              icon={DollarSign}
              label="Total revenue"
              value={`$${data.totalRevenue.toLocaleString()}`}
              color="bg-emerald-500"
            />
            <StatCard
              icon={ShoppingBag}
              label="Total orders"
              value={data.totalOrders}
              color="bg-blue-500"
            />
            <StatCard
              icon={TrendingUp}
              label="This month revenue"
              value={`$${(data.monthly.at(-1)?.revenue ?? 0).toLocaleString()}`}
              color="bg-purple-500"
            />
            <StatCard
              icon={Package}
              label="This month orders"
              value={data.monthly.at(-1)?.orders ?? 0}
              color="bg-amber-500"
            />
          </div>

          {/* Monthly revenue trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <SectionHeader icon={TrendingUp} title="Monthly Sales Trend" />
            {data.monthly.every((m) => m.revenue === 0) ? (
              <p className="text-xs text-gray-400 text-center py-10">
                No sales data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={data.monthly}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Monthly orders bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <SectionHeader icon={BarChart2} title="Monthly Orders" />
            {data.monthly.every((m) => m.orders === 0) ? (
              <p className="text-xs text-gray-400 text-center py-10">
                No orders data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data.monthly}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top selling products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <SectionHeader icon={Package} title="Top Selling Products" />
            {!data.topProducts.length ? (
              <p className="text-xs text-gray-400 text-center py-10">
                No sales yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data.topProducts}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                    tickFormatter={(v) =>
                      v.length > 12 ? v.slice(0, 12) + "…" : v
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
                    {data.topProducts.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <SectionHeader icon={ShoppingBag} title="Order Status Breakdown" />
            {!statusEntries.length ? (
              <p className="text-xs text-gray-400 text-center py-6">
                No orders yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {statusEntries.map(({ status, count, color }) => {
                  const total = statusEntries.reduce((s, e) => s + e.count, 0);
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-gray-600 font-medium">
                            {status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
