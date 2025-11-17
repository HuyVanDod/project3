"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products?: Product[];
  title?: string;
}

export default function ProductGrid({ products = [], title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Không có sản phẩm nào phù hợp.
      </p>
    );
  }

  return (
    <section className="max-w-[1000px] mx-auto mt-10 px-6">
      {/* --- Tiêu đề danh mục --- */}
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h2>
      )}

      {/* --- Swiper sản phẩm --- */}
      <div className="relative">
        <Swiper
          className="product-swiper overflow-hidden relative"
          modules={[Navigation, Pagination]}
          spaceBetween={15}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 15 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
