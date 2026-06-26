import { serverFetch } from "../../server";

export const getSellerAnalytics = async (email) => {
  return serverFetch(`/api/seller/analytics/${email}`);
};
