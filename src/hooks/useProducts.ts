"use client";
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { fetchProductsApi, Filters, Pagination } from "@/lib/product";

export function useProducts(initialFilters: Filters = {}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Memo hóa filters để tránh trigger useEffect không cần thiết
  const activeFilters = useMemo(() => {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    );
    return cleaned;
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, pagination } = await fetchProductsApi(activeFilters, controller.signal);

        setProducts(data);
        setPagination(pagination);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tải sản phẩm");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [activeFilters]);

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    setFilters, // 🧩 Giúp bạn có thể cập nhật filters từ component ngoài
  };
}
