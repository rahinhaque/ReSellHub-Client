// lib/api/payment/data.js
import { serverFetch } from "../server";

export const getProductById = async (id) => {
  return serverFetch(`/api/products/${id}`);
};
