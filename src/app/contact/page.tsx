"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { ServiceInfo } from "@/components/common/ServiceInfo";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Cập nhật giá trị form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gửi form đến backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Gửi liên hệ thất bại!");

      const data = await res.json();

      toast.success("Gửi thành công 🎉", {
        description:
          data.message || "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
      });

      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error("Không thể gửi liên hệ 😢", {
        description: err.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-sm uppercase text-gray-500 font-medium">
          Liên hệ với chúng tôi
        </h3>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Bạn có thể đặt cho chúng tôi những câu hỏi
        </h1>
        <p className="text-gray-600 mt-3">
          Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào,
          hoặc bạn có thể giải quyết vấn đề của mình nhanh hơn thông qua văn
          phòng liên hệ của chúng tôi.
        </p>
        <div className="border-b border-gray-200 mt-6"></div>
      </div>

      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Office Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Văn phòng của chúng tôi</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn giải đáp mọi thắc mắc hoặc vấn đề. Hãy liên hệ với chúng tôi!
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-medium">Văn phòng Hồ Chí Minh</span>
              </div>
              <p className="text-gray-600 text-sm">
                123 Đường Trái Cây, Quận 1, TP. Hồ Chí Minh
              </p>
              <p className="text-gray-800 font-medium text-sm mt-1">
                <Phone className="inline w-4 h-4 mr-1" /> +84 123 456 789
              </p>
              <p className="text-sm text-purple-700">
                <Mail className="inline w-4 h-4 mr-1" /> support@fruityfruit.vn
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-6">
            <p className="font-medium mb-2">Theo dõi chúng tôi:</p>
            <div className="flex space-x-3 text-gray-600">
              <a href="#"><Facebook className="w-5 h-5 hover:text-blue-600" /></a>
              <a href="#"><Twitter className="w-5 h-5 hover:text-sky-500" /></a>
              <a href="#"><Instagram className="w-5 h-5 hover:text-pink-500" /></a>
              <a href="#"><Linkedin className="w-5 h-5 hover:text-blue-700" /></a>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-purple-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Chủ đề *</label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung *
            </label>
            <textarea
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-purple-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </div>

      <ServiceInfo />
    </div>
  );
}
