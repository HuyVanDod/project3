"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "huydv.114010123046@vtc.edu.vn",
    lastName: "Văn Huy",
    firstName: "Đỗ",
    gender: "Nam",
    birthDate: "",
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Tài khoản của bạn
      </h1>

      <div className="space-y-4">
        {/* Email */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Email</label>
          <Input
            value={profile.email}
            disabled
            className="bg-gray-100 col-span-3 text-gray-600"
          />
        </div>

        {/* Họ và tên đệm */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Họ và tên đệm</label>
          <Input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="col-span-3 bg-gray-100"
          />
        </div>

        {/* Tên */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Tên</label>
          <Input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="col-span-3 bg-gray-100"
          />
        </div>

        {/* Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Giới tính</label>
          <div className="flex gap-4 col-span-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={profile.gender === "Nữ"}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              />
              Nữ
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={profile.gender === "Nam"}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              />
              Nam
            </label>
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3">
          <label className="font-medium text-gray-700">Ngày sinh</label>
          <Input
            type="date"
            value={profile.birthDate}
            onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
            className="col-span-3 bg-gray-100"
          />
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-end mt-6">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}
