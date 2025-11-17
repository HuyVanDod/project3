"use client";

import Image from "next/image";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CartItemProps {
  item: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      slug: string;
      price?: number;
      images?: {
        gallery?: string[];
        thumbnail?: string;
      };
    };
    variant?: {
      id: number;
      name: string;
      price?: number;
      image?: string;
      sku?: string;
    } | null;
  };
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.png");

  useEffect(() => {
    // ✅ Ưu tiên ảnh theo thứ tự: variant → product.gallery[0] → product.thumbnail
    const variantImage = item.variant?.image?.trim();
    const galleryImage = item.product?.images?.gallery?.[0]?.trim();
    const thumbnail = item.product?.images?.thumbnail?.trim();

    const finalImage =
      (variantImage && variantImage !== "")
        ? variantImage
        : galleryImage || thumbnail || "/placeholder.png";

    console.log("🧺 Ảnh được chọn:", {
      variantImage,
      galleryImage,
      thumbnail,
      finalImage,
    });

    setImageSrc(finalImage);
  }, [item.variant?.image, item.product?.images]);

  // ✅ Ưu tiên giá của variant → product
  const price = item.variant?.price ?? item.product.price ?? 0;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      {/* Ảnh sản phẩm */}
      <div className="flex-shrink-0">
        <Image
          src={imageSrc}
          alt={item.product.name}
          width={64}
          height={64}
          className="object-cover rounded"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/placeholder.png";
          }}
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-sm md:text-base">
          {item.product.name}
        </h3>

        {/* ✅ Hiển thị tên biến thể nếu có */}
        {item.variant?.name && (
          <p className="text-gray-500 text-sm">{item.variant.name}</p>
        )}

        {/* ✅ Hiển thị giá */}
        <p className="text-red-600 text-sm font-semibold">
          {price.toLocaleString("vi-VN")} đ
        </p>

        <div className="mt-1">
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => onUpdateQuantity(item.id, q)}
          />
        </div>
      </div>

      {/* Nút xóa */}
      <Button
        variant="ghost"
        onClick={() => onRemove(item.id)}
        className="text-gray-500 hover:text-red-600"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};
