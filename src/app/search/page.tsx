"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${BASE_URL}/api/v1/products?search=${encodeURIComponent(query)}`
        );

        if (!res.ok) throw new Error("Không thể tải kết quả tìm kiếm");

        const data = await res.json();

        // ✅ Đảm bảo lấy đúng mảng sản phẩm
        const productList = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.data)
          ? data.data
          : [];

        setProducts(productList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1000px] mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-green-600">{query}</span>
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Đang tải kết quả...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 ? (
          <ProductGrid products={products} title="Kết quả tìm kiếm" />
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )
        )}
      </div>
    </main>
  );
}
