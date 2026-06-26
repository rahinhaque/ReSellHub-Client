// lib/api/buyer/payment-history/data.js
import { serverFetch } from "../../server";

export const getBuyerPayments = async (email) => {
  return serverFetch(`/api/payments/buyer/${email}`);
};
