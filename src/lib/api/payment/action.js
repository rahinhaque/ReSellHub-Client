// lib/api/payment/action.js

import { baseUrl } from "../baseUrl";

export const createCheckoutSession = async (data) => {
  const res = await fetch(`${baseUrl}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
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
