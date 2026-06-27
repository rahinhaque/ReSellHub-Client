import { baseUrl } from "../baseUrl";

async function getAuthToken() {
  if (typeof window === "undefined") return null;

  // Fast path — token already cached
  const cached = localStorage.getItem("jwt_token");
  if (cached) return cached;

  // Race condition fallback — fetch fresh token using the active session
  try {
    const sessionRes = await fetch("/api/auth/get-session", {
      credentials: "include",
    });
    if (!sessionRes.ok) return null;

    const { user } = await sessionRes.json(); // { session: {...}, user: {...} }
    if (!user?.email) return null;

    const tokenRes = await fetch(`${baseUrl}/api/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    if (!tokenRes.ok) return null;

    const { token } = await tokenRes.json();

    // Cache for subsequent calls
    localStorage.setItem("jwt_token", token);
    document.cookie = `jwt_token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`;

    return token;
  } catch {
    return null;
  }
}

export const createCheckoutSession = async (data) => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${baseUrl}/api/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
};

export const confirmOrder = async (sessionId) => {
  const res = await fetch(`${baseUrl}/api/orders/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error("Failed to confirm order");
  return res.json();
};
