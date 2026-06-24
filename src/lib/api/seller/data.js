import { serverFetch } from "../server";

export const getSellerProducts = async (email) => {
  const res = await serverFetch(`/api/sellerProducts/${email}`);
  return res;
};
