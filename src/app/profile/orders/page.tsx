"use client";

import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/order";
import { OrderListSummary } from "@/types/order";
import { Loader2, CircleSlash2, ExternalLink } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const statuses = [
    "Tất cả",
    "Đang xử lý",
    "Xác nhận",
    "Đóng hàng",
    "Vận chuyển",
    "Đã nhận",
    "Đã hủy",
  ];

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        // ✅ đảm bảo luôn là mảng để tránh lỗi .length
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setOrders([]); // fallback tránh undefined
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // ✅ lọc đơn hàng theo trạng thái
  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.order_status === statusFilter);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Tabs trạng thái */}
      <div className="flex flex-wrap gap-3 mb-8">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl border transition text-sm font-medium ${
              statusFilter === s
                ? "border-green-500 bg-green-50 text-green-600"
                : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Hiển thị danh sách */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Đang tải đơn hàng...
        </div>
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <CircleSlash2 className="mx-auto mb-2" size={40} />
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* Thông tin đơn hàng */}
              <div>
                <p className="font-semibold text-gray-900">
                  Đơn hàng {order.order_status?.toLowerCase() || "đang xử lý"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.order_date).toLocaleTimeString("vi-VN")}{" "}
                  {new Date(order.order_date).toLocaleDateString("vi-VN")}
                </p>
              </div>

              {/* Giá & thanh toán */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {order.total_amount.toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    {order.payment_method}
                  </p>
                </div>

                {/* Trạng thái thanh toán */}
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium border ${
                    order.payment_status === "paid"
                      ? "text-green-600 border-green-300 bg-green-50"
                      : "text-red-600 border-red-300 bg-red-50"
                  }`}
                >
                  {order.payment_status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>

                {/* Trạng thái đơn hàng */}
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium border ${
                    order.order_status === "Đang xử lý"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                      : order.order_status === "Đã nhận"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : order.order_status === "Đã hủy"
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {order.order_status}
                </span>

                {/* Link xem chi tiết */}
                <a
                  href={`/profile/orders/${order.id}`}
                  className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  Xem chi tiết <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
