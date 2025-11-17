"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MomoReturnPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Đang xác nhận thanh toán...");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const resultCode = searchParams.get("resultCode"); // 0 = thành công
        const message = searchParams.get("message");

        console.log("🔁 MomoReturn params:", { orderId, resultCode, message });

        // ✅ Nếu thanh toán thành công
        if (resultCode === "0") {
          setStatus("success");
          setMessage("Thanh toán MoMo thành công! 🎉");
        } else {
          setStatus("failed");
          setMessage("Thanh toán thất bại hoặc bị hủy.");
        }
      } catch (err) {
        console.error("❌ Lỗi xác nhận thanh toán:", err);
        setStatus("failed");
        setMessage("Có lỗi xảy ra khi xác nhận thanh toán.");
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-3">Thanh toán thành công!</h1>
          <p className="text-gray-700 mb-6">{message}</p>
          <a
            href="/orders"
            className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition"
          >
            Xem đơn hàng
          </a>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">Thanh toán thất bại</h1>
          <p className="text-gray-700 mb-6">{message}</p>
          <a
            href="/cart"
            className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Quay lại giỏ hàng
          </a>
        </div>
      )}
    </div>
  );
}
