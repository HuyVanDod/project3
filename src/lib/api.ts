// src/lib/api.ts
import { Variant, Review } from "@/types/product";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* ===========================
 🏙️ API ĐỊA LÝ (Provinces/Districts/Wards)
=========================== */
export async function getProvinces() {
  const res = await fetch(`${BASE_URL}/api/v1/locations/provinces`);
  if (!res.ok) throw new Error("Không tìm thấy API provinces");
  return res.json();
}

export async function getDistricts(provinceCode: string) {
  const res = await fetch(`${BASE_URL}/api/v1/locations/districts/${provinceCode}`);
  if (!res.ok) throw new Error("Không tìm thấy API districts");
  return res.json();
}

export async function getWards(districtCode: string) {
  const res = await fetch(`${BASE_URL}/api/v1/locations/wards/${districtCode}`);
  if (!res.ok) throw new Error("Không tìm thấy API wards");
  return res.json();
}

/* ===========================
 🏠 API QUẢN LÝ ĐỊA CHỈ KHÁCH HÀNG
=========================== */

// 🟢 Lấy danh sách địa chỉ của khách hàng hiện tại
export const getCustomerAddresses = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/customers/addresses`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Không thể tải danh sách địa chỉ");
  }

  return await res.json();
};

// 🟢 Thêm địa chỉ mới
export const addCustomerAddress = async (data: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/customers/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi khi thêm địa chỉ");
  }

  return await res.json();
};

// 🟡 Cập nhật địa chỉ
export const updateCustomerAddress = async (id: number | string, data: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/customers/addresses/${id}`, {
    method: "PATCH", // 🟢 ĐỔI TỪ PUT → PATCH
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi khi cập nhật địa chỉ");
  }

  return await res.json();
};


// 🔴 Xóa địa chỉ
export const deleteCustomerAddress = async (id: number | string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/customers/addresses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    // Nếu backend trả lỗi thì có thể có JSON
    try {
      const err = await res.json();
      throw new Error(err.message || "Lỗi khi xóa địa chỉ");
    } catch {
      throw new Error("Lỗi khi xóa địa chỉ");
    }
  }

  // Một số backend trả 204 No Content -> không có JSON
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
};


/* ===========================
 🚚 API VẬN CHUYỂN (Phí ship + COD)
=========================== */
export async function getShippingOptions(payload: {
  carrierCode: string;
  to_district_id: number;
  to_ward_code: string;
  items: {
    quantity: number;
    weight: number;
    price: number;
  }[];
}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/shipping/options`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Không thể tính phí vận chuyển");
  }

  return await res.json(); // { fee, cod_fee, expected_delivery_time }
}

// lib/api.ts

// Lấy danh sách biến thể của sản phẩm
export const getProductVariants = async (productId: string | number): Promise<Variant[]> => {
  const res = await fetch(`http://localhost:5000/api/v1/products/${productId}/variants`);
  if (!res.ok) throw new Error("Fetch variants lỗi");
  return res.json();
};

// Lấy danh sách review của sản phẩm
export const getProductReviews = async (productId: string | number): Promise<Review[]> => {
  const res = await fetch(`http://localhost:5000/api/v1/reviews/products/${productId}/reviews`);
  if (!res.ok) throw new Error("Fetch reviews lỗi");
  return res.json();
};
