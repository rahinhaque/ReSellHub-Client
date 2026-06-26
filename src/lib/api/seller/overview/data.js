import { serverFetch } from "../../server";

export const getSellerOverview = async (email) => {
  const [products, orders] = await Promise.all([
    serverFetch(`/api/sellerProducts/${email}`),
    serverFetch(`/api/orders/seller/${email}`),
  ]);

  const totalProducts = Array.isArray(products) ? products.length : 0;
  const allOrders = Array.isArray(orders) ? orders : [];

  const totalSales = allOrders.filter(
    (o) => o.orderStatus === "delivered",
  ).length;
  const totalRevenue = allOrders
    .filter((o) => o.orderStatus === "delivered")
    .reduce((sum, o) => sum + (o.price || 0), 0);
  const pendingOrders = allOrders.filter(
    (o) => o.orderStatus === "pending",
  ).length;
  const recentOrders = allOrders.slice(0, 5);

  return {
    totalProducts,
    totalSales,
    totalRevenue,
    pendingOrders,
    recentOrders,
  };
};
