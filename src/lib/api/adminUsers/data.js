import { serverFetch } from "../server";

const getAllUsers = async () => {
  const res = await serverFetch("/api/admin/users");
  return res;
};

export default getAllUsers;
