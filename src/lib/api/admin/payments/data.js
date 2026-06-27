import { serverFetch } from "../../server";

export const getAdminPayments = async ({ status, search } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return serverFetch(`/api/admin/payments?${params.toString()}`);
};
