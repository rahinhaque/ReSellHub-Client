"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client"; // adjust to your better-auth path
import DashboardHeader from "@/components/DashboardHeader";
import ProductList from "@/components/ProductCard";
import { serverFetch } from "@/lib/api/server";


const MyProductsPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await serverFetch(
          `/api/sellerProducts/${session.user.email}`,
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [session?.user?.email]);

  // Called by EditProductModal after a successful update
  const handleUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
    );
  };

  // Called by DeleteConfirmModal after a successful delete
  const handleDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div>
      <DashboardHeader
        title="My Products"
        description="Manage your products here"
      />
      <div className="p-6">
        <ProductList
          products={products}
          isLoading={isLoading}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      </div>
    </div>
  );
};

export default MyProductsPage;
