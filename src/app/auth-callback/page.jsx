"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return; // still loading
    if (!session?.user) return; // not logged in

    if (!session.user.roleSelected) {
      router.push("/choose-role");
    } else {
      router.push("/dashboard");
    }
  }, [session, isPending]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}
