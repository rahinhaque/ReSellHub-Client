// lib/api/buyer/overview/data.js
import { serverFetch } from "../../server";

export const getBuyerSummary = async (email) => {
  return serverFetch(`/api/buyer/summary/${email}`);
};
