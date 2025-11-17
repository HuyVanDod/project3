
import { useCartContext } from "@/app/contexts/CartContext"; // ✅ đổi import

export const CartSummary = () => {
  const { totalPrice } = useCartContext();

  return (
    <div className="p-4 border-t">
      <div className="flex justify-between">
        <span>Tổng tiền:</span>
        <span className="font-bold">{totalPrice.toLocaleString()} đ</span>
      </div>
    </div>
  );
};