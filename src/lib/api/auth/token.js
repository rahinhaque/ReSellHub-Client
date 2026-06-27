// lib/api/auth/token.js
import { baseUrl } from "../baseUrl";

export const fetchJwtToken = async (email, role) => {
  const res = await fetch(`${baseUrl}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });
  if (!res.ok) throw new Error("Failed to get token");
  return res.json(); // { token }
};
