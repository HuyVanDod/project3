"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getOrderDetail } from "@/lib/order"; 
import { formatPrice } from "@/lib/utils"; // ✅ import chuẩn

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng!");
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderDetail(orderId);
        console.log("📦 Dữ liệu đơn hàng nhận được:", data);
        setOrder(data.order || data);
      } catch (err: any) {
        console.error("❌ Lỗi khi tải chi tiết đơn hàng:", err);
        setError("Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Đang tải thông tin đơn hàng...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-10 text-gray-500">
        ❌ Không tìm thấy đơn hàng!
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng tại cửa hàng trái cây. Dưới đây là chi tiết đơn hàng của bạn:
        </p>

        {/* THÔNG TIN ĐƠN HÀNG */}
        <div className="text-left max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-pink-600">
            Mã đơn hàng: {order.order_number}
          </h2>
          <p>
  <strong>Ngày đặt:</strong>{" "}
  {new Date(order.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}
</p>

          <p>
            <strong>Trạng thái:</strong> {order.order_status}
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong>{" "}
            {order.payment_method?.toUpperCase()}
          </p>
          <p>
            <strong>Người nhận:</strong> {order.recipient_name} ({order.recipient_phone})
          </p>
          <p>
            <strong>Địa chỉ giao hàng:</strong> {order.shipping_address}
          </p>
        </div>

        {/* DANH SÁCH SẢN PHẨM */}
        <div className="mt-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">
            🛍️ Sản phẩm trong đơn hàng
          </h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3">Sản phẩm</th>
                <th className="text-right py-2 px-3">Số lượng</th>
                <th className="text-right py-2 px-3">Đơn giá</th>
                <th className="text-right py-2 px-3">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-3">{item.product_name}</td>
                  <td className="text-right py-2 px-3">{item.quantity}</td>
                  <td className="text-right py-2 px-3">
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className="text-right py-2 px-3">
                    {formatPrice(item.unit_price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TỔNG TIỀN */}
        <div className="mt-6 max-w-2xl mx-auto text-right font-semibold text-base">
          <p>Tạm tính: {formatPrice(order.subtotal)}</p>
          <p>Phí giao hàng: {formatPrice(order.shipping_fee)}</p>
          <p>
            <span className="text-pink-600 text-lg">
              Tổng cộng: {formatPrice(order.total_amount)}
            </span>
          </p>
        </div>

        {/* NÚT ĐIỀU HƯỚNG */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full"
          >
            🏠 Về trang chủ
          </button>
          <button
            onClick={() => router.push("/profile/orders")}
            className="border border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full"
          >
            📦 Xem đơn hàng của tôi
          </button>
        </div>
      </div>
    </div>
  );
}
