// lib/api/seller/orders/data.js
import { serverFetch } from "../../server";

export const getSellerOrders = async (email) => {
  return serverFetch(`/api/orders/seller/${email}`);
};
