import { serverFetch } from "../../server";

export const getAdminAnalytics = async () => {
  return serverFetch("/api/admin/analytics");
};
