"use client";

import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCartContext } from "@/app/contexts/CartContext"; // ✅ dùng context
import type { ProductInfo } from "@/hooks/useCart";

interface AddToCartButtonProps {
  productId: number;
  variantId?: number | null;
  quantity?: number;
  productInfo?: ProductInfo; // Optional
}

export const AddToCartButton = ({
  productId,
  variantId = null,
  quantity = 1,
  productInfo,
}: AddToCartButtonProps) => {
  const { addToCart, loading } = useCartContext(); // ✅ lấy từ context

  const handleAdd = async () => {
    try {
      await addToCart(productId, variantId, quantity, productInfo);
      toast.success("Thành công", {
        description: "Sản phẩm đã được thêm vào giỏ hàng.",
      });
    } catch (error: any) {
      toast.error("Không thể thêm sản phẩm", {
        description: error.message || "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
    </Button>
  );
};
