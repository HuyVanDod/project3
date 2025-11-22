"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProfile, updateProfile, Profile, UpdateProfileData } from "@/lib/profile";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Lấy token từ localStorage, giống như cách bạn làm trong OrdersPage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch profile khi token có giá trị
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    if (!profile || !token) return;

    setLoading(true);
    const updateData: UpdateProfileData = {
      name: profile.name,
      avatar: profile.avatar || undefined,
      phone: profile.phone || undefined,
    };

    try {
      const updated = await updateProfile(token, updateData);
      setProfile(updated);
      toast.success("Cập nhật thành công!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="text-center mt-10">Vui lòng đăng nhập để xem profile</div>;
  if (!profile) return <div className="text-center mt-10">Đang tải profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Tài khoản của bạn</h1>

      <div className="space-y-4">
        {/* Email */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Email</label>
          <Input value={profile.email} disabled className="bg-gray-100 col-span-3 text-gray-600" />
        </div>

        {/* Họ và tên */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Họ và tên</label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="col-span-3 bg-gray-100"
          />
        </div>

        {/* Số điện thoại */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Số điện thoại</label>
          <Input
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="col-span-3 bg-gray-100"
          />
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </div>
    </div>
  );
}
