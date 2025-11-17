"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilter from "@/components/product/ProductFilter";
import { useProducts } from "@/hooks/useProducts";
import { Filters } from "@/lib/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId") || undefined;

  // ✅ Memo hóa initialFilters
  const initialFilters = useMemo<Filters>(() => ({
    search: "",
    categoryId: categoryIdParam,
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
    limit: 12,
    sort: "latest",
  }), [categoryIdParam]);

  const { products, loading, error, filters, setFilters } = useProducts(initialFilters);

  // ✅ Cập nhật category, chỉ khi khác
  useEffect(() => {
    setFilters(prev => {
      if (prev.categoryId !== categoryIdParam) {
        return { ...prev, categoryId: categoryIdParam, page: 1 };
      }
      return prev;
    });
  }, [categoryIdParam, setFilters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (loading)
    return <div className="text-center text-gray-600 py-10">Đang tải sản phẩm...</div>;

  if (error)
    return <div className="text-center text-red-500 py-10">Lỗi: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <ProductFilter filters={filters} onChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4 flex flex-col gap-3">
          {/* Banner */}
          <div className="relative rounded-md overflow-hidden shadow-md border border-gray-200">
            <Image
              src="/assets/images/banner.jpg"
              alt="Grocery Banner"
              width={1012}
              height={276}
              className="w-full h-[276px] object-cover rounded-md"
              priority
            />
          </div>
          {/* Sort */}
          <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-2 mt-1">
            <p>
              Showing all <span className="font-semibold text-gray-800">{products.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-gray-700 font-medium">Sort:</label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={filters.sort || "latest"}
                onChange={(e) =>
                  handleFilterChange({ sort: e.target.value as Filters["sort"] })
                }
              >
                <option value="latest">Sort by latest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
            </div>
          </div>
          {/* Product list */}
          <div className="mt-1">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <p className="text-gray-500 text-center py-10">Không có sản phẩm nào phù hợp.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
