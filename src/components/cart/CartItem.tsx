"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id: number;
    quantity: number;
    product: {
      id?: number;   // ⬅️ optional
      name: string;
      slug: string;
      price?: number;
      images?: string[];   // ⬅️ SỬA: product.images giờ là mảng string[]
    };
    variant?: {
      id: number;
      name: string;
      price?: number;
      sku?: string;
    } | null;
  };
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.png");

  // ✅ Luôn dùng ảnh product.images[0] (đã normalize bên useCart)
  useEffect(() => {
    const finalImage = item.product?.images?.[0] || "/placeholder.png";
    setImageSrc(finalImage);
  }, [item.product?.images]);

  // ✅ Giá ưu tiên variant nếu có
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
            (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-sm md:text-base">{item.product.name}</h3>

        {/* Hiển thị tên variant nếu có */}
        {item.variant?.name && (
          <p className="text-gray-500 text-sm">{item.variant.name}</p>
        )}

        {/* Giá sản phẩm */}
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
