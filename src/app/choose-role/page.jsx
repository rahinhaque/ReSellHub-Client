"use client";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChooseRolePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If already selected a role, skip this page
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/Login");
      return;
    }
    if (session.user.roleSelected === true) {
      router.push("/dashboard");
    }
  }, [session, isPending]);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      const email = session.user.email;

      // ── Step 1: Get JWT from Express ──────────────────────────────────────
      const tokenRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const { token } = await tokenRes.json();

      // ── Step 2: Update role in your Express/MongoDB ───────────────────────
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/set-role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role, roleSelected: true }),
      });

      // ── Step 3: Also update better-auth's own user record ─────────────────
      // This makes session.user.role and session.user.roleSelected reflect
      // the new values immediately
      await authClient.updateUser({
        role,
        roleSelected: true,
      });

      // ── Step 4: Redirect based on chosen role ─────────────────────────────
      router.push(role === "seller" ? "/dashboard/seller" : "/dashboard/buyer");
    } catch (err) {
      console.error("Role selection failed:", err);
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
