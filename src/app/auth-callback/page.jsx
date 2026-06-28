// app/auth-callback/page.jsx
"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;

    console.log("roleSelected:", session.user.roleSelected); // debug

    // roleSelected is false OR undefined → go choose role
    if (!session.user.roleSelected) {
      router.push("/choose-role");
    } else {
      // Already has a role → go to their dashboard
      const role = session.user.role || "buyer";
      router.push(`/dashboard/${role}`);
    }
  }, [session, isPending]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}
