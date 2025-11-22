"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ← import useRouter
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { changePassword } from "@/lib/profile";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter(); // ← khởi tạo router
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token không hợp lệ, vui lòng đăng nhập lại!");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(token, {
        currentPassword,
        newPassword,
      });

      toast.success(res.message || "Đổi mật khẩu thành công!");

      // ← sau khi hiển thị toast thành công, quay về trang profile
      setTimeout(() => {
        router.push("/profile"); // ← đường dẫn trang profile
      }, 1500); // 1.5 giây delay để người dùng kịp thấy toast
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="text-center mt-10">Vui lòng đăng nhập để đổi mật khẩu</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Đổi mật khẩu</h1>

      <div className="space-y-5">
        <div>
          <label className="font-medium">Mật khẩu hiện tại</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <label className="font-medium">Mật khẩu mới</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <label className="font-medium">Xác nhận mật khẩu</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white w-full py-3 mt-4"
        >
          {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </div>
  );
}
