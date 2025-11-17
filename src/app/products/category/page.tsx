"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryPage() {
  const { categories, loading, error } = useCategories();

  if (loading) return <p className="text-center py-6">Đang tải danh mục...</p>;
  if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-green-600 text-center">
        Danh mục sản phẩm
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/category/${cat.slug}`}
            className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icon minh họa (tùy bạn có thể thay ảnh) */}
                <span className="w-10 h-10 flex items-center justify-center text-2xl">
                  🥭
                </span>
                <span className="text-base font-semibold">{cat.name}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
