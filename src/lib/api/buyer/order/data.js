// lib/api/buyer/order/data.js
import { serverFetch } from "../../server";

export const getBuyerOrders = async (email) => {
  return serverFetch(`/api/orders/buyer/${email}`);
};

export const getOrderById = async (id) => {
  return serverFetch(`/api/orders/${id}`);
};
