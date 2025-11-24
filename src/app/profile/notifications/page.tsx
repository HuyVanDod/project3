"use client";

import React, { useEffect } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotification();

  // Đánh dấu tất cả đã đọc khi mở trang
  useEffect(() => {
    markAllAsRead();
  }, []); // ❌ mảng rỗng để tránh lặp vô hạn

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thông báo</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="font-medium">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
