
import { BASE_URL } from "@/lib/api";

// 🟢 Lấy danh sách wishlist của người dùng hiện tại
export const getWishlist = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/wishlist`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không thể tải danh sách yêu thích");
  }

  return await res.json();
};

// 🟢 Thêm sản phẩm vào wishlist
export const addToWishlist = async (productId: number | string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không thể thêm vào danh sách yêu thích");
  }

  return await res.json();
};

// 🔴 Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (productId: number | string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không thể xóa khỏi danh sách yêu thích");
  }

  // Một số backend trả 204 No Content
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
};
