"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ Ẩn Header/Footer khi ở trang đăng nhập, đăng ký, quên mật khẩu
  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/(auth)");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
