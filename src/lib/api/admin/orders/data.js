import { serverFetch } from "../../server";

export const getAdminOrders = async ({ status, search } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return serverFetch(`/api/admin/orders?${params.toString()}`);
};
