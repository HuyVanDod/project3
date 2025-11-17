import { create } from "zustand";

export interface WishlistItem {
  id: number; // ✅ thêm dòng này
  productId: number;
  product?: any; // có thể mở rộng sau nếu cần lưu thêm dữ liệu sản phẩm
}

interface WishlistState {
  wishlist: WishlistItem[];
  setWishlist: (items: WishlistItem[]) => void;
  addWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (productId: number) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  setWishlist: (items) => set({ wishlist: items }),

  addWishlistItem: (item) =>
    set((state) => ({
      wishlist: [...state.wishlist, item],
    })),

  removeWishlistItem: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter(
        (item) => item.productId !== productId
      ),
    })),
}));
