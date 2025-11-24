"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { ServiceInfo } from "@/components/common/ServiceInfo";
import { BASE_URL } from "@/lib/api";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"featured" | "newest">("featured");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Banner slider state
  const banners = [
    "/assets/images/banner11.png",
    "/assets/images/banner10.png",
    "/assets/images/banner12.png",
    "/assets/images/banner13.png",
  ];
  const [currentBanner, setCurrentBanner] = useState(0);

  // 🔹 Fetch sản phẩm nổi bật và mới nhất
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featuredRes, newestRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/products?isFeatured=true`),
          fetch(`${BASE_URL}/api/v1/products?sortBy=created_at&sortOrder=desc`),
        ]);
        if (!featuredRes.ok || !newestRes.ok)
          throw new Error("Không thể tải sản phẩm");
        const featuredData = await featuredRes.json();
        const newestData = await newestRes.json();

        setFeaturedProducts(
          Array.isArray(featuredData.data)
            ? featuredData.data
            : featuredData.products || []
        );
        setNewestProducts(
          Array.isArray(newestData.data)
            ? newestData.data
            : newestData.products || []
        );
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Tự động chuyển banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full font-ibm text-gray-800">
      {/* 🔹 Hero Banner Slider – GIỮ TỈ LỆ 16:7 */}
      {/* 🔹 Hero Banner Slider */}
<section className="relative w-full aspect-[13/6] bg-white flex items-center justify-center">
  <Image
    src={banners[currentBanner]}
    alt={`Banner ${currentBanner}`}
    fill
    priority
    className="object-contain"
  />
</section>


      {/* 🔹 Thông tin dịch vụ */}
      <ServiceInfo />

      {/* 🔹 Tabs chọn loại sản phẩm */}
      <section className="max-w-[1200px] mx-auto mt-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 tracking-wide">- Sản Phẩm -</h2>
        <div className="flex justify-center space-x-8 mb-8">
          <button
            onClick={() => setActiveTab("featured")}
            className={`transition ${
              activeTab === "featured"
                ? "text-green-600 font-semibold underline underline-offset-4"
                : "text-gray-700 hover:text-green-600 hover:underline"
            }`}
          >
            Sản phẩm nổi bật
          </button>
          <button
            onClick={() => setActiveTab("newest")}
            className={`transition ${
              activeTab === "newest"
                ? "text-green-600 font-semibold underline underline-offset-4"
                : "text-gray-700 hover:text-green-600 hover:underline"
            }`}
          >
            Sản phẩm mới
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-10">Đang tải sản phẩm...</p>
        )}
        {error && <p className="text-center text-red-500 py-10">Lỗi: {error}</p>}

        {!loading && !error && (
          <ProductGrid
            products={activeTab === "featured" ? featuredProducts : newestProducts}
          />
        )}
      </section>

      {/* 🔹 Banner giữa – GIỮ TỈ LỆ */}
      <section className="mt-12 w-full aspect-[16/7] relative">
        <Image
          src="/assets/images/image7.png"
          alt="Banner giữa"
          fill
          className="object-cover"
        />
      </section>

      {/* 🔹 Sản phẩm nổi bật (dưới banner) */}
      <section className="max-w-[1200px] mx-auto mt-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 tracking-wide">
          - Best Seller -
        </h2>
        {!loading && !error && featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p className="text-gray-500">Không có sản phẩm nổi bật nào.</p>
        )}
      </section>

      {/* 🔹 Banner nhóm 3 ảnh – GIỮ TỈ LỆ NHƯ BANNER  */}
      <section className="max-w-[1200px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {[
          "/assets/images/banner1.png",
          "/assets/images/banner2.png",
          "/assets/images/banner3.png",
        ].map((img, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative aspect-[16/7]"
          >
            <Image
              src={img}
              alt={`Banner ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
