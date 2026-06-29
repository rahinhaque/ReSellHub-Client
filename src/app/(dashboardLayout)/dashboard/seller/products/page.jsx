"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/DashboardHeader";
import ProductList from "@/components/ProductCard";
import { serverFetch } from "@/lib/api/server";

const MyProductsPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filterCondition !== "all") params.set("condition", filterCondition);

        const data = await serverFetch(
          `/api/sellerProducts/${session.user.email}?${params.toString()}`,
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ Debounce search so we don't fire on every keystroke
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [session?.user?.email, search, filterCondition]);

  const handleUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
    );
  };

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
          search={search}
          setSearch={setSearch}
          filterCondition={filterCondition}
          setFilterCondition={setFilterCondition}
        />
      </div>
    </div>
  );
};

export default MyProductsPage;
