import { BASE_URL } from "@/lib/api";
import {
  Order,
  OrderListSummary,
  CreateOrderPayload,
  CreateOrderResponse,
} from "@/types/order";

/**
 * 🧾 Lấy danh sách đơn hàng của khách hàng hiện tại
 */
export async function getMyOrders(): Promise<OrderListSummary[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/v1/orders/my-orders`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không thể lấy danh sách đơn hàng");
  }

  const data = await res.json();

  // ✅ API trả mảng trực tiếp
  return Array.isArray(data) ? data : data.orders || [];
}


/**
 * 🔍 Lấy chi tiết đơn hàng
 */
export async function getOrderDetail(orderId: string): Promise<any> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/v1/orders/my-orders/${orderId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("🚨 Lỗi khi lấy chi tiết đơn hàng:", err);
    throw new Error(err.message || "Không thể lấy chi tiết đơn hàng");
  }

  const data = await res.json();
  console.log("✅ Dữ liệu chi tiết đơn hàng:", data);
  return data;
}

/**
 * 🧩 Tạo đơn hàng mới (COD hoặc MoMo)
 */
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const token = localStorage.getItem("token");

  // Đảm bảo format đúng cho backend
  const normalizedPayload = {
  ...payload,
  shippingOption: payload.shippingOption
    ? {
        fee: payload.shippingOption.fee ?? 0,
        service_id: payload.shippingOption.service_id ?? null,
        service_type_id: payload.shippingOption.service_type_id ?? 2,
      }
    : undefined,
};


  console.log("📦 Payload gửi:", normalizedPayload);

  const res = await fetch(`${BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(normalizedPayload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("🚨 Lỗi tạo đơn hàng:", data);
    throw new Error(
      data.message ||
        "Dữ liệu đặt hàng không hợp lệ. Vui lòng kiểm tra addressId, shippingOption, paymentMethod."
    );
  }

  // 🔁 Nếu thanh toán MoMo → redirect sang payUrl
  if (normalizedPayload.paymentMethod === "momo" && data.payment?.payUrl) {
    console.log("🌐 Chuyển hướng đến MoMo:", data.payment.payUrl);
    window.location.href = data.payment.payUrl;
  }

  return data;
}

/**
 * 💳 Xác nhận thanh toán (online)
 */
export async function confirmPayment(orderId: string, status: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/v1/orders/${orderId}/payment-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Không thể cập nhật trạng thái thanh toán");
  }

  return await res.json();
}
