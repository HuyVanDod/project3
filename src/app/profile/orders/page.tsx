"use client";

import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/order";
import { OrderListSummary } from "@/types/order";
import { Loader2, CircleSlash2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useOrderStatusWatcher } from "@/hooks/useOrderStatusWatcher";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  const ORDERS_PER_PAGE = 10;

  // Map trạng thái từ API → tiếng Việt
  const statusMap: Record<string, string> = {
    pending: "Đang xử lý",
    confirmed: "Xác nhận",
    processing: "Đóng hàng",
    shipped: "Vận chuyển",
    completed: "Đã nhận",
    cancelled: "Đã hủy",
  };

  // Danh sách tab
  const statuses = ["Tất cả", ...Object.values(statusMap)];

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useOrderStatusWatcher(getMyOrders);

  // Lấy trạng thái tiếng Việt để filter
  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => statusMap[order.order_status] === statusFilter);

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Tabs trạng thái */}
      <div className="flex flex-wrap gap-3 mb-8">
        {statuses.map((s) => {
          const count =
            s === "Tất cả"
              ? orders.length
              : orders.filter((o) => statusMap[o.order_status] === s).length;

          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl border transition text-sm font-medium ${
                statusFilter === s
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Đang tải đơn hàng...
        </div>
      ) : !paginatedOrders || paginatedOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <CircleSlash2 className="mx-auto mb-2" size={40} />
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const statusVI = statusMap[order.order_status] || "Đang xử lý";

            return (
              <div
                key={order.id}
                className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                {/* Thông tin đơn hàng */}
                <div>
                  <p className="font-semibold text-gray-900">
                    Trạng thái: {statusVI}
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
                      {order.payment_method === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : order.payment_method === "bank"
                        ? "Chuyển khoản"
                        : order.payment_method}
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

                  {/* Badge trạng thái đơn hàng */}
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium border ${
                      statusVI === "Đang xử lý"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                        : statusVI === "Đã nhận"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : statusVI === "Đã hủy"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-gray-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    {statusVI}
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
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-green-50 border-green-500 text-green-600"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
