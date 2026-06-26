import { serverMutation } from "../server";

export const updateUserStatus = async (id, status) => {
  const res = await serverMutation(`/api/admin/users/${id}/status`, "PATCH", {
    status,
  });
  return res;
};

export const deleteUser = async (id) => {
  const res = await serverMutation(`/api/admin/users/${id}`, "DELETE", {});
  return res;
};
