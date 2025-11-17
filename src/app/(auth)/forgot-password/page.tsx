"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { forgotPasswordApi } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email của bạn");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      toast.success(res.message || "Hãy kiểm tra email để đặt lại mật khẩu!");
      setEmail(""); // reset form
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi yêu cầu quên mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Quên mật khẩu
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Địa chỉ email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Nhớ mật khẩu rồi?{" "}
          <a href="/auth/login" className="text-green-600 hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}
