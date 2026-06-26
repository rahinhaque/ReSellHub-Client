// lib/api/seller/orders/action.js
import { serverMutation } from "../../server";

export const updateOrderStatus = async (orderId, status) => {
  return serverMutation(`/api/orders/${orderId}/status`, "PATCH", { status });
};
