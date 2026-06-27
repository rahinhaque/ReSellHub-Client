// lib/api/server.js
import { baseUrl } from "./baseUrl";
import { waitForToken } from "@/lib/hooks/useJwt";

export const serverMutation = async (path, method, data) => {
  const token = await waitForToken().catch(() => null);

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export const serverFetch = async (path) => {
  const token = await waitForToken().catch(() => null);

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};
