// lib/hooks/useJwt.js
"use client";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { fetchJwtToken } from "@/lib/api/auth/token";

// Resolves with the token, waiting up to 5s if it's still being fetched
export async function waitForToken(timeoutMs = 5000) {
  const existing = localStorage.getItem("jwt_token");
  if (existing) return existing;

  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const interval = setInterval(() => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        clearInterval(interval);
        resolve(token);
      } else if (Date.now() > deadline) {
        clearInterval(interval);
        reject(new Error("JWT token not available"));
      }
    }, 100);
  });
}

export function useJwt() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) {
      localStorage.removeItem("jwt_token");
      document.cookie = "jwt_token=; path=/; max-age=0";
      return;
    }
    const getToken = async () => {
      try {
        const { token } = await fetchJwtToken(user.email, user.role);
        localStorage.setItem("jwt_token", token);
        document.cookie = `jwt_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      } catch (err) {
        console.error("JWT fetch failed:", err);
      }
    };
    getToken();
  }, [user?.email, user?.role, isPending]);
}
