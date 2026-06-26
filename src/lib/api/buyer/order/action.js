// lib/api/buyer/order/action.js
import { serverMutation } from "../../server";

export const cancelOrder = async (orderId) => {
  return serverMutation(`/api/orders/${orderId}/cancel`, "PATCH");
};
