"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNotification } from "@/app/contexts/NotificationContext";

export function useOrderStatusWatcher(fetchOrders: () => Promise<any[]>) {
  const previousOrders = useRef<any[]>([]);
  const notifiedIds = useRef<Set<string>>(new Set()); // ✅ lưu các đơn đã thông báo
  const { addNotification } = useNotification();

  useEffect(() => {
    async function checkStatus() {
      const newOrders = await fetchOrders();
      const oldOrders = previousOrders.current;
      const oldMap = new Map(oldOrders.map(o => [o.id, o]));

      if (oldOrders.length > 0) {
        newOrders.forEach((newOrder) => {
          const oldOrder = oldMap.get(newOrder.id);
          if (
            oldOrder &&
            oldOrder.order_status !== newOrder.order_status &&
            !notifiedIds.current.has(newOrder.id)
          ) {
            const msg = `Đơn hàng #${newOrder.id} đã chuyển sang: ${newOrder.order_status}`;
            toast.success(msg);
            addNotification(msg);

            notifiedIds.current.add(newOrder.id); // đánh dấu đã thông báo
          }
        });
      }

      previousOrders.current = newOrders;
    }

    checkStatus(); // chạy lần đầu
    const timer = setInterval(checkStatus, 15000); // chạy mỗi 15s

    return () => clearInterval(timer);
  }, [fetchOrders, addNotification]);
}
