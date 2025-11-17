"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handlePayWithMomo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/pay-momo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: 123 }), // ID đơn hàng thật
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Redirect người dùng sang trang thanh toán MoMo
      window.location.href = data.payUrl;
    } catch (err: any) {
      alert(`Thanh toán thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Thanh toán đơn hàng</h1>
      <button
        onClick={handlePayWithMomo}
        disabled={loading}
        className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700"
      >
        {loading ? "Đang xử lý..." : "Thanh toán qua MoMo"}
      </button>
    </div>
  );
}
