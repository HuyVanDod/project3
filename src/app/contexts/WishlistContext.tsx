"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlist";

interface WishlistProduct {
  id: number | string;
  name: string;
  slug: string;
  price: string;
  images: {
    gallery: string[];
    thumbnail: string;
  };
}

interface WishlistItem {
  product: WishlistProduct;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // 🟢 Load wishlist khi user đăng nhập hoặc reload trang
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        // Đảm bảo dữ liệu là mảng chứa { product }
        setWishlist(data);
      } catch (error) {
        console.error("Không thể tải wishlist:", error);
      }
    };
    loadWishlist();
  }, []);

  // 🟢 Thêm / xóa wishlist
  const toggleWishlist = async (productId: number) => {
    try {
      const exists = wishlist.some(
        (item) => Number(item.product.id) === Number(productId)
      );

      if (exists) {
        await removeFromWishlist(productId);
        setWishlist((prev) =>
          prev.filter((item) => Number(item.product.id) !== Number(productId))
        );
      } else {
        await addToWishlist(productId);
        // Gọi lại API để đồng bộ danh sách (đảm bảo chính xác)
        const updated = await getWishlist();
        setWishlist(updated);
      }
    } catch (error) {
      console.error("Lỗi toggle wishlist:", error);
    }
  };

  const isInWishlist = (productId: number) =>
    wishlist.some((item) => Number(item.product.id) === Number(productId));

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
