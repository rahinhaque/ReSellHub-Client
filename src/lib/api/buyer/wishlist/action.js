import { serverFetch, serverMutation } from "@/lib/api/server";

export const addToWishlist = (data) =>
  serverMutation("/api/wishlist", "POST", data);

export const removeFromWishlist = (wishlistId) =>
  serverMutation(`/api/wishlist/${wishlistId}`, "DELETE");

export const getWishlistByUser = (userEmail) =>
  serverFetch(`/api/wishlist/${encodeURIComponent(userEmail)}`);

export const getWishlistByUserId = (userId) =>
  serverFetch(`/api/wishlist/user/${encodeURIComponent(userId)}`);
