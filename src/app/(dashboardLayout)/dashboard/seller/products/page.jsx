"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeader from "@/components/DashboardHeader";
import ProductList from "@/components/ProductCard";
import { serverFetch } from "@/lib/api/server";

const MyProductsPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [totalAll, setTotalAll] = useState(0); // total unfiltered count
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
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Also fetch total unfiltered count for display
    const fetchTotal = async () => {
      try {
        const data = await serverFetch(
          `/api/sellerProducts/${session.user.email}`,
        );
        setTotalAll(Array.isArray(data) ? data.length : 0);
      } catch {
        // ignore
      }
    };

    const debounce = setTimeout(() => {
      fetchProducts();
      if (filterCondition === "all" && !search) {
        fetchTotal();
      }
    }, 300);

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
          totalAll={totalAll || products.length}
        />
      </div>
    </div>
  );
};

export default MyProductsPage;
