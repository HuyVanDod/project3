"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderDetail } from "@/lib/order";
import { ArrowLeft, Truck, CreditCard, Package } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Order, OrderItem, OrderHistory, OrderShipment } from "@/types/order";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value?: number | string) =>
    value ? Number(value).toLocaleString("vi-VN") : "0";

  useEffect(() => {
    async function fetchOrder() {
      try {
        if (id) {
          const data = await getOrderDetail(id as string);
          setOrder(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Đang tải chi tiết đơn hàng...
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy thông tin đơn hàng.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>

      {/* Mã đơn + trạng thái */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">Mã đơn hàng: {order.order_number}</p>
          <p className="text-sm text-gray-500">
            Ngày đặt:{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium border ${
              order.payment_status === "paid"
                ? "text-green-600 border-green-300 bg-green-50"
                : "text-red-600 border-red-300 bg-red-50"
            }`}
          >
            {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium border ${
              order.order_status === "pending"
                ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                : order.order_status === "delivered"
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            {order.order_status}
          </span>
        </div>
      </div>

      {/* Thông tin thanh toán & giao hàng */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Thanh toán */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold">
            <CreditCard size={18} /> Thanh toán
          </div>
          <p className="text-sm text-gray-600">
            Phương thức:{" "}
            <span className="font-medium uppercase">{order.payment_method}</span>
          </p>
          <p className="text-sm text-gray-600">
            Trạng thái:{" "}
            <span
              className={
                order.payment_status === "paid"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </p>
        </div>

        {/* Giao hàng */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold">
            <Truck size={18} /> Giao hàng
          </div>
          <p className="text-sm text-gray-600">
            Người nhận: <span className="font-medium">{order.customer_name}</span>
          </p>
          <p className="text-sm text-gray-600">
            SĐT: <span className="font-medium">{order.customer_phone}</span>
          </p>
          <p className="text-sm text-gray-600">
            Địa chỉ: <span className="font-medium">{order.shipping_address}</span>
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
          <Package size={18} /> Sản phẩm trong đơn
        </div>

        <div className="divide-y">
          {order.items?.map((item: OrderItem) => (
            <div
              key={item.id}
              className="flex justify-between py-3 items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.product_name}
                  className="w-14 h-14 rounded-md object-cover border"
                />
                <div>
                  <p className="font-medium text-gray-800">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {formatCurrency(Number(item.unit_price) * item.quantity)} ₫
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(Number(item.unit_price))} ₫ /sp
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tổng cộng */}
      <div className="bg-white p-5 rounded-xl border shadow-sm flex justify-end">
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500">
            Phí vận chuyển:{" "}
            <span className="text-gray-700 font-medium">
              {formatCurrency(Number(order.shipping_fee))} ₫
            </span>
          </p>
          <p className="text-lg font-bold text-green-600">
            Tổng cộng: {formatCurrency(Number(order.total_amount))} ₫
          </p>
        </div>
      </div>

      {/* Lịch sử đơn hàng */}
      {order.history?.length ? (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-3">Lịch sử đơn hàng</h2>
          <ul className="divide-y">
            {order.history.map((h: OrderHistory) => (
              <li key={h.id} className="py-2 text-sm text-gray-600">
                [{new Date(h.created_at).toLocaleString("vi-VN")}] {h.notes}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Thông tin shipment */}
      {order.shipment ? (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-3">Thông tin vận chuyển</h2>
          <p>Tracking: {order.shipment.tracking_number}</p>
          <p>Carrier: {order.shipment.carrier_code}</p>
          <p>Phí vận chuyển: {formatCurrency(Number(order.shipment.shipping_cost))} ₫</p>
          <p>
            Ngày dự kiến giao hàng:{" "}
            {order.shipment.estimated_delivery_date
              ? new Date(order.shipment.estimated_delivery_date).toLocaleDateString("vi-VN")
              : "-"}
          </p>
          <p>Trạng thái: {order.shipment.status}</p>
        </div>
      ) : null}
    </div>
  );
}
