export const wishlistKeys = {
  all: ["wishlist"],
  byUser: (userEmail) => ["wishlist", userEmail],
  byUserId: (userId) => ["wishlist", userId],
};

export const wishlistDefaultItem = {
  productId: "",
  userEmail: "",
  userId: "",
  title: "",
  price: 0,
  image: "",
  sellerInfo: null,
  createdAt: new Date(),
};
