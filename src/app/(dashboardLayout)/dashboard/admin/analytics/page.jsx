"use client";

import { useEffect, useState } from "react";
import { getAdminAnalytics } from "@/lib/api/admin/analytics/data";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  TrendingUp, Users, ShoppingBag, DollarSign,
  Package, BarChart2, PieChart,
} from "lucide-react";

// ── Colors ────────────────────────────────────────────────────────────────────
const BAR_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#f87171", "#06b6d4"];

const STATUS_COLORS = {
  pending:   "#facc15",
  accepted:  "#3b82f6",
  shipped:   "#a855f7",
  delivered: "#10b981",
  cancelled: "#f87171",
};

const ROLE_COLORS = {
  admin:  "#f59e0b",
  seller: "#10b981",
  buyer:  "#3b82f6",
};

// ── Shared Components ─────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconBg, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={15} className="text-emerald-500" />
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2.5 min-w-[120px]">
      <p className="text-xs font-semibold text-gray-600 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[11px] text-gray-500 capitalize">{p.name}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-700">
            {p.name === "revenue" ? `$${Number(p.value).toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ message = "No data yet." }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28" />
        ))}
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-64" />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminAnalytics();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusEntries = data
    ? Object.entries(data.orderStatusBreakdown).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        color: STATUS_COLORS[status] || "#9ca3af",
      }))
    : [];

  const roleEntries = data
    ? Object.entries(data.userRoles).map(([role, count]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count,
        color: ROLE_COLORS[role] || "#9ca3af",
      }))
    : [];

  const totalStatusCount = statusEntries.reduce((s, e) => s + e.count, 0);
  const totalRoleCount = roleEntries.reduce((s, e) => s + e.count, 0);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <BarChart2 size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Platform Analytics</h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">
          Overall business insights across users, products, and revenue.
        </p>
      </div>

      {loading ? <Skeleton /> : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="Total users"
              value={data.totalUsers.toLocaleString()}
              iconBg="bg-blue-500"
            />
            <StatCard
              icon={Package}
              label="Total products"
              value={data.totalProducts.toLocaleString()}
              iconBg="bg-purple-500"
            />
            <StatCard
              icon={ShoppingBag}
              label="Total orders"
              value={data.totalOrders.toLocaleString()}
              iconBg="bg-amber-500"
            />
            <StatCard
              icon={DollarSign}
              label="Total revenue"
              value={`$${data.totalRevenue.toLocaleString()}`}
              iconBg="bg-emerald-500"
              sub="From delivered orders"
            />
          </div>

          {/* ── User Growth Chart ── */}
          <SectionCard icon={Users} title="User Growth (Last 6 Months)">
            {data.monthly.every((m) => m.users === 0) ? (
              <EmptyChart message="No user registrations recorded yet." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3b82f6", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* ── Monthly Orders Chart ── */}
          <SectionCard icon={ShoppingBag} title="Monthly Orders (Last 6 Months)">
            {data.monthly.every((m) => m.orders === 0) ? (
              <EmptyChart message="No orders recorded yet." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* ── Monthly Revenue Chart ── */}
          <SectionCard icon={TrendingUp} title="Monthly Revenue Trend (Last 6 Months)">
            {data.monthly.every((m) => m.revenue === 0) ? (
              <EmptyChart message="No revenue from delivered orders yet." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* ── Category Performance Chart ── */}
          <SectionCard icon={BarChart2} title="Category Performance">
            {!data.categoryPerformance.length ? (
              <EmptyChart message="No products listed yet." />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.categoryPerformance}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="category"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                      tickFormatter={(v) => v.length > 14 ? v.slice(0, 14) + "…" : v}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(v) => <span className="text-xs text-gray-500 capitalize">{v}</span>}
                    />
                    <Bar dataKey="products" name="Total listed" radius={[0, 4, 4, 0]}>
                      {data.categoryPerformance.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                    <Bar dataKey="sold" name="Sold" fill="#10b981" radius={[0, 4, 4, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
                {/* Category legend */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.categoryPerformance.map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                      <span className="text-[10px] text-gray-500">{cat.category}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </SectionCard>

          {/* ── Order Status Breakdown ── */}
          <SectionCard icon={PieChart} title="Order Status Breakdown">
            {!statusEntries.length ? (
              <EmptyChart message="No orders yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {statusEntries.map(({ status, count, color }) => {
                  const pct = totalStatusCount ? Math.round((count / totalStatusCount) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs text-gray-600 font-medium">{status}</span>
                        </div>
                        <span className="text-xs text-gray-400">{count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* ── User Roles Breakdown ── */}
          <SectionCard icon={Users} title="User Roles Breakdown">
            {!roleEntries.length ? (
              <EmptyChart message="No users yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {roleEntries.map(({ role, count, color }) => {
                  const pct = totalRoleCount ? Math.round((count / totalRoleCount) * 100) : 0;
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs text-gray-600 font-medium">{role}</span>
                        </div>
                        <span className="text-xs text-gray-400">{count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}
