import { serverMutation } from "../server"

export const addProducts = async (data) => {
   const res = await serverMutation("/api/addedProduct", "POST", data);
   return res;
}
