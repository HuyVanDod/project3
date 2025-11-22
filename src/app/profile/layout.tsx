"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Bell, KeyRound, TicketPercent, Heart, Package } from "lucide-react";
import Image from "next/image";
import React from "react";

const menuItems = [
  { name: "Thông tin tài khoản", href: "/profile", icon: User },
  { name: "Đơn hàng", href: "/profile/orders", icon: Package },
  { name: "Địa chỉ", href: "/profile/addresses", icon: MapPin },
  { name: "Thông báo", href: "#", icon: Bell },
  { name: "Coupons", href: "#", icon: TicketPercent },
  { name: "Sản phẩm yêu thích", href: "/profile/wishlist", icon: Heart },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto flex gap-8 px-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-2xl shadow-sm p-6 h-fit">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src="/default-avatar.png"
                alt="Avatar"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <p className="mt-3 font-semibold text-gray-700">ádsdsadsad</p>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t mt-6 pt-4">
            <Link
              href="/profile/reset-password"
              className="flex items-center gap-3 text-gray-600 hover:text-green-600 text-sm font-medium"
            >
              <KeyRound size={18} />
              Đổi mật khẩu
            </Link>
          </div>
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm p-6">{children}</main>
      </div>
    </div>
  );
}
