import type { Metadata } from "next";
import "./globals.css";
import "../styles/globals.css";
import "../styles/components.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "sonner";
import { CartProvider } from "@/app/contexts/CartContext";
import { OrderProvider } from "@/app/contexts/OrderContext";
import { WishlistProvider } from "@/app/contexts/WishlistContext"; // 🩷 thêm dòng này
import { NotificationProvider } from "@/app/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "Fruity Fruit",
  description: "Shop trái cây nhập khẩu tươi ngon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {/* ✅ Bao toàn bộ app trong các Provider */}
        <CartProvider>
          <OrderProvider>
            <WishlistProvider> {/* 🩷 thêm dòng này */}
              <ClientLayout>
                    <NotificationProvider>

                {children}
                <Toaster position="top-right" richColors />
                    </NotificationProvider>

              </ClientLayout>
            </WishlistProvider> {/* 🩷 đóng lại */}
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
