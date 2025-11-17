"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartContext } from "@/app/contexts/CartContext"; // ✅ thay đổi
import { useEffect } from "react";

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon = ({ onClick }: CartIconProps) => {
  const { totalItems, fetchCart } = useCartContext(); // ✅ dùng context

  // Optional: refetch lại khi component mount (nếu tab bị inactive lâu)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2">{totalItems}</Badge>
      )}
    </div>
  );
};
