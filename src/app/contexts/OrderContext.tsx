"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getMyOrders,
  getOrderDetail,
  createOrder,
  confirmPayment,
} from "@/lib/order";
import {
  Order,
  OrderListSummary,
  CreateOrderPayload,
  CreateOrderResponse,
} from "@/types/order";

interface OrderContextType {
  orders: OrderListSummary[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;

  loadMyOrders: () => Promise<void>;
  loadOrderDetail: (orderId: string) => Promise<void>;
  placeOrder: (payload: CreateOrderPayload) => Promise<CreateOrderResponse>;
  updatePaymentStatus: (orderId: string, status: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderListSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧾 Lấy danh sách đơn hàng của người dùng
  const loadMyOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Lỗi khi tải danh sách đơn hàng:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Lấy chi tiết đơn hàng
  const loadOrderDetail = async (orderId: string) => {
    try {
      setLoading(true);
      const order = await getOrderDetail(orderId);
      setSelectedOrder(order);
      setError(null);
    } catch (err: any) {
      console.error("❌ Lỗi khi tải chi tiết đơn hàng:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Tạo đơn hàng (COD hoặc online)
  const placeOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    try {
      setLoading(true);
      const res = await createOrder(payload);
      await loadMyOrders(); // refresh danh sách
      return res;
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 💳 Cập nhật trạng thái thanh toán
  const updatePaymentStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      await confirmPayment(orderId, status);
      await loadOrderDetail(orderId);
    } catch (err: any) {
      console.error("❌ Lỗi khi cập nhật thanh toán:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        selectedOrder,
        loading,
        error,
        loadMyOrders,
        loadOrderDetail,
        placeOrder,
        updatePaymentStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// 🪄 Hook tiện lợi để dùng ở mọi component
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext phải được dùng trong <OrderProvider>");
  }
  return context;
};
