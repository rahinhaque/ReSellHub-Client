"use client";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { baseUrl } from "@/lib/api/baseUrl";

export default function ChooseRolePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/Login");
      return;
    }
    // Already chose role → go to their dashboard
    if (session.user.roleSelected === true) {
      const role = session.user.role || "buyer";
      router.push(`/dashboard/${role}`); // ✅ dynamic
    }
  }, [session, isPending]);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const email = session.user.email;

      console.log("Using baseUrl:", baseUrl);
      console.log("Selecting role:", role, "for:", email);

      // ── Step 1: Get JWT from Express ──────────────────────────────────────
      const tokenRes = await fetch(`${baseUrl}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!tokenRes.ok) {
        const text = await tokenRes.text();
        throw new Error(`Token fetch failed: ${tokenRes.status} - ${text}`);
      }

      const { token } = await tokenRes.json();
      console.log("Got token:", !!token);

      // ── Step 2: Update role in Express/MongoDB ────────────────────────────
      const roleRes = await fetch(`${baseUrl}/api/user/set-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role, roleSelected: true }),
      });

      if (!roleRes.ok) {
        const text = await roleRes.text();
        throw new Error(`Role update failed: ${roleRes.status} - ${text}`);
      }

      console.log("Express role updated ✅");

      // ── Step 3: Update better-auth session ───────────────────────────────
      const updateRes = await authClient.updateUser({
        role,
        roleSelected: true,
      });

      console.log("better-auth user updated ✅", updateRes);

      // ── Step 4: Redirect to correct dashboard ─────────────────────────────
      router.push(`/dashboard/${role}`); // ✅ dynamic: /dashboard/seller or /dashboard/buyer
    } catch (err) {
      console.error("Role selection failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">How will you use ReSelll Hub?</h1>
      <p className="text-gray-500">Choose your account type to get started</p>

      {/* ── Error message ── */}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => handleRoleSelect("buyer")}
          disabled={loading}
          className="px-8 py-6 border-2 rounded-xl hover:border-blue-500 disabled:opacity-50"
        >
          🛒 <br /> <strong>Buyer</strong>
          <p className="text-sm text-gray-400">Browse & purchase items</p>
        </button>

        <button
          onClick={() => handleRoleSelect("seller")}
          disabled={loading}
          className="px-8 py-6 border-2 rounded-xl hover:border-green-500 disabled:opacity-50"
        >
          🏪 <br /> <strong>Seller</strong>
          <p className="text-sm text-gray-400">List & sell your items</p>
        </button>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm">Setting up your account...</p>
      )}
    </div>
  );
}
