"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-6">
      <XCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-red-700 mb-2">Thanh toán thất bại</h1>
      <p className="text-gray-700 mb-6">
        Rất tiếc, quá trình đặt hàng của bạn không thành công.  
        Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
      </p>

      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Thử lại
        </Link>
        <Link
          href="/"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
