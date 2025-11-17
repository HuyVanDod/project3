"use client";

import { useState, useEffect } from "react";
import { useCategories, Category } from "@/hooks/useCategories";

interface Filters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Props {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}

export default function ProductFilter({ filters, onChange }: Props) {
  const { categories, loading, error } = useCategories();

  // Local state cho min/max price
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? 3000000);

  // Đồng bộ khi filters từ parent thay đổi (ví dụ reset từ bên ngoài)
  useEffect(() => {
    setMinPrice(filters.minPrice ?? 0);
    setMaxPrice(filters.maxPrice ?? 3000000);
  }, [filters.minPrice, filters.maxPrice]);

  // --- Xử lý Apply filter ---
  const handleApplyFilter = () => {
    onChange({
      minPrice,
      maxPrice,
      categoryId: filters.categoryId,
      search: filters.search,
    });
  };

  // --- Xử lý Reset filter ---
  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(3000000);
    onChange({
      search: "",
      categoryId: undefined,
      minPrice: 0,
      maxPrice: 3000000,
    });
  };

  return (
    <aside className="product-filter w-[259px] border border-gray-200 rounded-lg bg-white shadow-sm p-4 text-sm font-inter text-gray-800">
      {/* Bộ lọc giá */}
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 text-[15px]">
          Lọc theo giá
        </h3>

        <div className="flex items-center gap-3 text-gray-700 mb-3">
          <input
            type="number"
            value={minPrice / 1000}
            onChange={(e) => setMinPrice(Number(e.target.value) * 1000)}
            className="w-1/2 border border-gray-300 rounded-md p-2 text-center text-[14px] focus:ring-1 focus:ring-black focus:border-black"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number"
            value={maxPrice / 1000}
            onChange={(e) => setMaxPrice(Number(e.target.value) * 1000)}
            className="w-1/2 border border-gray-300 rounded-md p-2 text-center text-[14px] focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        <input
          type="range"
          min={0}
          max={3000000}
          step={10000}
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="w-full mb-2"
        />
        <input
          type="range"
          min={0}
          max={3000000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />

        <div className="mt-3 flex justify-between text-gray-600 text-xs">
          <span>{minPrice.toLocaleString("vi-VN")}₫</span>
          <span>{maxPrice.toLocaleString("vi-VN")}₫</span>
        </div>

        <button
          onClick={handleApplyFilter}
          className="mt-4 w-full py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Lọc
        </button>
      </div>

      {/* Danh mục sản phẩm */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-[15px]">
          Danh mục sản phẩm
        </h3>

        {loading && <p className="text-gray-500 text-xs">Đang tải...</p>}
        {error && <p className="text-red-500 text-xs">{error}</p>}

        {!loading && !error && categories.length > 0 && (
          <div className="space-y-2">
            {categories.map((cat: Category) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-black transition"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === cat.id}
                  onChange={() =>
                    onChange({
                      categoryId: cat.id,
                      minPrice,
                      maxPrice,
                      search: filters.search,
                    })
                  }
                  className="accent-black"
                />
                <span>{cat.name}</span>
              </label>
            ))}

            <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-black transition">
              <input
                type="radio"
                name="category"
                checked={!filters.categoryId}
                onChange={() =>
                  onChange({
                    categoryId: undefined,
                    minPrice,
                    maxPrice,
                    search: filters.search,
                  })
                }
                className="accent-black"
              />
              <span>Tất cả</span>
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleReset}
        className="mt-6 w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-md text-xs transition"
      >
        Xóa bộ lọc
      </button>
    </aside>
  );
}
