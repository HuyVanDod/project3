// src/app/payment-result/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentResultPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<string>("Đang xử lý...");

  useEffect(() => {
    const resultCode = params.get("resultCode");
    if (resultCode === "0") setStatus("🎉 Thanh toán thành công!");
    else setStatus("❌ Thanh toán thất bại hoặc bị hủy.");
  }, [params]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">Kết quả thanh toán MoMo</h1>
      <p>{status}</p>
    </div>
  );
}
