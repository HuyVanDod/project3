"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result) router.push("/");
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-8">
      {/* Tabs */}
      <div className="flex justify-center items-center gap-6 mb-6 border-b border-gray-200">
        <button
          className="text-lg font-semibold text-green-700 border-b-2 border-green-600 pb-2"
          disabled
        >
          Đăng nhập
        </button>
        <button
          onClick={() => router.push("/register")}
          className="text-lg font-semibold text-gray-400 hover:text-green-600 pb-2 transition"
        >
          Đăng ký
        </button>
      </div>

      <p className="text-gray-600 text-sm text-center mb-5">
        Nếu bạn đã có tài khoản thì hãy đăng nhập bằng tên người dùng hoặc email
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Tên người dùng hoặc Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-green-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-green-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Options */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" /> Lưu tài khoản
          </label>

          {/* ✅ Thêm điều hướng quên mật khẩu */}
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-green-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
