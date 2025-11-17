"use client";

import axios from "axios";
import { toast } from "sonner"; // ✅ Dùng thư viện thông báo sonner
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Product } from "@/types/product";

// 🔹 Đặt BASE_URL dùng chung để tránh quên /api/v1/
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const useWishlist = () => {
  const { user } = useAuth();
  const {
    wishlist,
    setWishlist,
    addWishlistItem,
    removeWishlistItem,
  } = useWishlistStore();

  // 🔹 Lấy danh sách sản phẩm yêu thích
  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Định dạng dữ liệu lại cho store frontend
      const formatted = res.data.map((item: any) => ({
        id: item.id, // ✅ Thêm id để tránh lỗi “id does not exist”
        productId: item.product.id,
        product: item.product,
      }));

      setWishlist(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi tải wishlist:", err);
      toast.error("Không thể tải danh sách yêu thích.");
    }
  };

  // 🔹 Thêm sản phẩm vào danh sách yêu thích
  const addToWishlist = async (productId: number) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thêm vào danh sách yêu thích 💚");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addWishlistItem({ id: productId, productId });
      toast.success("Đã thêm vào danh sách yêu thích 💚");
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào wishlist:", error);
      toast.error("Không thể thêm sản phẩm vào danh sách yêu thích.");
    }
  };

  // 🔹 Xóa sản phẩm khỏi danh sách yêu thích
  const removeFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      removeWishlistItem(productId);
      toast.success("Đã xóa khỏi danh sách yêu thích 💔");
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm khỏi danh sách yêu thích.");
    }
  };

  // 🔹 Toggle — dùng khi click icon trái tim
  const toggleWishlist = async (product: Product) => {
    const productId = Number(product.id);
    const isInWishlist = wishlist.some(
      (item) => item.productId === productId
    );

    if (isInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }

    // Cập nhật lại danh sách
    await fetchWishlist();
  };

  // 🔹 Tự động tải wishlist khi user đăng nhập
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};
