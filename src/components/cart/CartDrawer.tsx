"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";
import { useCartContext } from "@/app/contexts/CartContext"; // ✅ dùng context thay vì hook riêng

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeItem, updateQuantity, clearCart } = useCartContext();
  const isEmpty = cart.length === 0;
  const router = useRouter();

  const handleGoHome = () => {
    onClose();
    setTimeout(() => {
      router.push("/");
    }, 200);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-[85vh]">
        {/* Header */}
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold text-center">
            🛒 Giỏ hàng của bạn
          </DrawerTitle>
        </DrawerHeader>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Image
                src="/assets/icons/Iconempty.png"
                alt="Empty Cart"
                width={250}
                height={180}
                className="mb-4"
              />
              <p className="text-red-600 font-semibold mb-4">
                HÃY THÊM SẢN PHẨM VÀO GIỎ HÀNG CỦA BẠN
              </p>

              {/* Nút kiểu Bootstrap primary */}
              <Button
                onClick={handleGoHome}
                className="btn btn-primary w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition-all"
              >
                Quay lại
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <DrawerFooter className="flex flex-col gap-2 border-t pt-4">
            {/* ✅ Nút chính - màu xanh primary */}
            <Button
              className="btn btn-success w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold shadow-sm transition"
              onClick={() => {
                onClose();
                setTimeout(() => router.push("/cart"), 200);
              }}
            >
              Xem giỏ hàng chi tiết
            </Button>

            {/* ✅ Nút cảnh báo - màu đỏ danger */}
            <Button
              className="btn btn-danger w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold shadow-sm transition"
              onClick={clearCart}
            >
              Xóa toàn bộ giỏ hàng
            </Button>

            {/* ✅ Nút phụ - outline secondary */}
            <Button
              className="btn btn-outline-secondary w-full border border-gray-400 text-gray-700 hover:bg-gray-100 py-3 rounded-md transition"
              onClick={onClose}
            >
              Đóng
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
