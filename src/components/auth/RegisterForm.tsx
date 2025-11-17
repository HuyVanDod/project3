"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const { register, loading, error, successMessage } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const res = await register(formData.name, formData.email, formData.password);
    if (res) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => router.push("/login"), 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-8">
      {/* Tabs */}
      <div className="flex justify-center items-center gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => router.push("/login")}
          className="text-lg font-semibold text-gray-400 hover:text-green-600 pb-2 transition"
        >
          Đăng nhập
        </button>
        <button
          className="text-lg font-semibold text-green-700 border-b-2 border-green-600 pb-2"
          disabled
        >
          Đăng ký
        </button>
      </div>

      <p className="text-gray-600 text-sm text-center mb-5">
        Điền đầy đủ thông tin bên dưới để tạo tài khoản mới
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nhập đầy đủ họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-green-500"
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
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

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-green-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-green-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
