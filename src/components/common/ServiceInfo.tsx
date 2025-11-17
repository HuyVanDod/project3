"use client";

import Image from "next/image";

export const ServiceInfo = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-12 container mx-auto px-6">
      <div>
        <Image
          src="/assets/icons/icon4.png"
          alt="Payment"
          width={48}
          height={48}
          className="mx-auto"
        />
        <h3 className="font-semibold mt-2">Thanh toán COD và trực tuyến</h3>
        <p className="text-sm text-gray-500">
          Hỗ trợ cả thanh toán khi nhận hàng và thanh toán trực tuyến nhanh chóng, an toàn.
        </p>
      </div>

      <div>
        <Image
          src="/assets/icons/icon2.png"
          alt="Stocks"
          width={48}
          height={48}
          className="mx-auto"
        />
        <h3 className="font-semibold mt-2">Sản phẩm mới & khuyến mãi</h3>
        <p className="text-sm text-gray-500">
          Cập nhật thường xuyên mẫu mã mới, nhiều ưu đãi hấp dẫn mỗi ngày.
        </p>
      </div>

      <div>
        <Image
          src="/assets/icons/icon3.png"
          alt="Quality"
          width={48}
          height={48}
          className="mx-auto"
        />
        <h3 className="font-semibold mt-2">Chất lượng đảm bảo</h3>
        <p className="text-sm text-gray-500">
          Sản phẩm được kiểm duyệt kỹ lưỡng, cam kết chất lượng và nguồn gốc rõ ràng.
        </p>
      </div>

      <div>
        <Image
          src="/assets/icons/icon1.png"
          alt="Delivery"
          width={48}
          height={48}
          className="mx-auto"
        />
        <h3 className="font-semibold mt-2">Giao hàng tận nơi</h3>
        <p className="text-sm text-gray-500">
          Nhận hàng nhanh chóng ngay tại nhà chỉ từ 1 giờ sau khi đặt.
        </p>
      </div>
    </section>
  );
};
