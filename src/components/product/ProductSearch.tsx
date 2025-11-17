"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

export default function ProductSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Lỗi khi tải sản phẩm");
        const data = await res.json();
        setProducts(data.data || []); // Tùy backend trả về
      } catch (err) {
        setError("Không thể tải sản phẩm tìm kiếm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Kết quả tìm kiếm cho: <span className="text-green-600">{query}</span>
      </h1>

      {loading && <p>Đang tải sản phẩm...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
