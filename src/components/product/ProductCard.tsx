"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Heart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import ProductDetailModal from "@/components/product/ProductDetail";
import { createPortal } from "react-dom";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { useWishlist } from "@/app/contexts/WishlistContext";

// Ảnh fallback khi không có ảnh sản phẩm
const FALLBACK_IMAGE = "/images/no-image.png";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.some(
    (item) => Number(item.product.id) === Number(product.id)
  );

  // ❤️ Toggle wishlist
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await toggleWishlist(Number(product.id));
      toast.success(
        isWishlisted
          ? "Đã xóa khỏi danh sách yêu thích!"
          : "Đã thêm vào danh sách yêu thích!"
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật wishlist:", error);
      toast.error("Không thể cập nhật danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Làm sạch ảnh gallery để tránh src=""
  const validGallery =
    product.images?.gallery?.filter(
      (img: string | null | undefined) => img && img.trim() !== ""
    ) || [];

  // ✅ Lấy thumbnail fallback nếu có
  const thumbnail =
    product.images?.thumbnail && product.images.thumbnail.trim() !== ""
      ? product.images.thumbnail
      : validGallery[0] || FALLBACK_IMAGE;

  // ✅ Lấy variant mặc định
  const defaultVariantId =
    (product as any).variants?.length > 0
      ? Number((product as any).variants[0].id)
      : null;

  const getDisplayPrice = () => {
    if ((product as any).variants?.length > 0) {
      const prices = (product as any).variants.map(
        (v: any) => Number(v.price) || 0
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max
        ? `${min.toLocaleString("vi-VN")} đ`
        : `${min.toLocaleString("vi-VN")} đ`;
    }
    return `${parseFloat(product.price).toLocaleString("vi-VN")} đ`;
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="relative w-[202px] h-[353px] bg-white border border-[#E5E7EB] rounded-xl 
                   shadow-sm hover:shadow-md transition flex flex-col items-center p-4 cursor-pointer"
      >
        {/* ❤️ Nút yêu thích */}
        <button
          disabled={loading}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-30 p-2 rounded-full transition ${
            isWishlisted
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>

        {/* Ảnh sản phẩm */}
        <div
          className="relative w-[152.5px] h-[152.5px] bg-gray-100 rounded-lg 
                     overflow-hidden flex items-center justify-center mb-3 z-10"
        >
          {validGallery.length > 1 ? (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {validGallery.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={img}
                    alt={product.name}
                    width={152}
                    height={152}
                    className="object-contain w-full h-full"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src={thumbnail}
              alt={product.name}
              width={152}
              height={152}
              className="object-contain w-full h-full"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)
              }
            />
          )}
        </div>

        {/* Tên sản phẩm */}
        <h3 className="font-semibold mb-2 text-gray-800 text-sm text-center line-clamp-2">
          {product.name}
        </h3>

        {/* Giá + nút giỏ hàng */}
        <div className="flex items-center justify-between w-full mb-2">
          <p className="text-red-600 font-bold text-lg">{getDisplayPrice()}</p>

          <div onClick={(e) => e.stopPropagation()}>
            <AddToCartButton
              productId={parseInt(product.id, 10)}
              variantId={defaultVariantId}
              quantity={1}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 w-full text-left">
          Danh mục: {product.category_name || "Chưa rõ"}
        </p>
      </div>

      {/* Modal chi tiết sản phẩm */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <ProductDetailModal
              product={product}
              onClose={() => setOpen(false)}
            />
          </div>,
          document.body
        )}
    </>
  );
}
