"use client";

import { useEffect, useMemo, useState } from "react";
import getAllUsers from "@/lib/api/adminUsers/data";
import { updateUserStatus, deleteUser } from "@/lib/api/adminUsers/action";
import { toast } from "sonner";
import {
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import { Loader2, RefreshCw, UserRound, ShieldCheck, X, AlertTriangle } from "lucide-react";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
      setFiltered(data || []);
      if (!silent) toast.success("Users loaded");
    } catch (error) {
      toast.error(error?.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const summary = useMemo(() => {
    const total = users.length;
    const blocked = users.filter((u) => u.status === "blocked").length;
    const active = total - blocked;
    return { total, active, blocked };
  }, [users]);

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";

    try {
      setMutatingId(user._id);

      await updateUserStatus(user._id, newStatus);

      toast.success(
        newStatus === "blocked"
          ? "User blocked successfully."
          : "User unblocked successfully.",
      );

      await fetchUsers(true);
    } catch (error) {
      toast.error(error?.message || "Failed to update user status");
    } finally {
      setMutatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setMutatingId(id);
      await toast.promise(deleteUser(id), {
        loading: "Deleting user...",
        success: "User deleted successfully!",
        error: "Failed to delete user",
      });
      await fetchUsers(true);
    } catch (error) {
      console.error(error);
    } finally {
      setMutatingId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(true);
    toast.success("Refreshed users");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Admin users
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor and control platform users.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-indigo-500/15 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Users
              </span>
              <div className="rounded-2xl bg-indigo-500/10 p-3">
                <FaUsers className="text-lg text-indigo-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary.total}</p>
          </div>

          <div className="rounded-3xl border border-emerald-500/15 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Active Users
              </span>
              <div className="rounded-2xl bg-emerald-500/10 p-3">
                <ShieldCheck className="text-lg text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {summary.active}
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/15 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Blocked Users
              </span>
              <div className="rounded-2xl bg-red-500/10 p-3">
                <FaBan className="text-lg text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {summary.blocked}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium text-slate-500">
                Loading users...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user) => {
                    const blocked = user.status === "blocked";
                    const busy = mutatingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                              <UserRound className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {user.name || "—"}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                            {user.role || "user"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              blocked
                                ? "border border-red-500/15 bg-red-500/10 text-red-600"
                                : "border border-emerald-500/15 bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            {blocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatusToggle(user)}
                              disabled={busy}
                              title={blocked ? "Unblock" : "Block"}
                              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                blocked
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-rose-600 text-white hover:bg-rose-700"
                              }`}
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : blocked ? (
                                <>
                                  <FaCheckCircle className="mr-2" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <FaBan className="mr-2" />
                                  Block
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setUserToDelete(user)}
                              disabled={busy}
                              title="Delete user"
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <FaTrash className="mr-2" />
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            <FaUsers className="text-2xl text-slate-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              No users found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Try a different name, email, or role.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                Delete User
              </h2>
              <button
                onClick={() => setUserToDelete(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="px-6 py-5 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <p className="text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  {userToDelete.name || userToDelete.email}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl py-2.5 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = userToDelete._id;
                  setUserToDelete(null);
                  handleDelete(id);
                }}
                className="flex-1 text-sm font-semibold text-white bg-red-500 rounded-xl py-2.5 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
