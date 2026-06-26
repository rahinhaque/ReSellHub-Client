import { serverFetch } from "../server";
import { serverMutation } from "../server";

export const getAllProductsAdmin = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.moderation) params.set("moderation", filters.moderation);
  if (filters.search) params.set("search", filters.search);
  return serverFetch(`/api/admin/products?${params.toString()}`);
};

export const moderateProduct = async (id, moderationStatus) => {
  return serverMutation(`/api/admin/products/${id}/moderate`, "PATCH", {
    moderationStatus,
  });
};

export const deleteProductAdmin = async (id) => {
  return serverMutation(`/api/admin/products/${id}`, "DELETE", {});
};

export const getAllReports = async () => {
  return serverFetch("/api/reports");
};

export const updateReportStatus = async (id, status) => {
  return serverMutation(`/api/reports/${id}`, "PATCH", { status });
};
