"use client";

import { useCartContext } from "@/app/contexts/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { getShippingOptions, getCustomerAddresses } from "@/lib/api";
import { createOrder } from "@/lib/order";
import { formatPrice } from "@/lib/utils"; // ✅ import chuẩn

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province_name?: string;
  district_name?: string;
  ward_name?: string;
  province_code?: string;
  district_code?: string;
  ward_code?: string;
  is_default: boolean;
}

export default function CartPage() {
  const {
    cart,
    removeItem,
    updateQuantity,
    clearCart,
    loading,
    selectedAddressId,
    setSelectedAddressId,
  } = useCartContext();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [codFee, setCodFee] = useState<number>(0);
  const [loadingShipping, setLoadingShipping] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");

  // 🏠 Lấy địa chỉ mặc định khi mở trang
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const addresses = await getCustomerAddresses();
        if (addresses && addresses.length > 0) {
          const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
          setSelectedAddress(defaultAddr);
          setSelectedAddressId(String(defaultAddr.id));
        }
      } catch (error) {
        console.error("❌ Không thể tải địa chỉ khách hàng:", error);
      }
    };
    fetchDefaultAddress();
  }, [setSelectedAddressId]);

  // 🏠 Khi người dùng chọn địa chỉ khác → chỉ áp dụng tạm cho đơn hàng
  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setSelectedAddressId(String(addr.id));
  };

  // 🚚 Tính phí vận chuyển
  useEffect(() => {
    const fetchShippingFee = async () => {
      if (!selectedAddress || cart.length === 0) return;
      const { district_code, ward_code } = selectedAddress;
      if (!district_code || !ward_code) return;

      setLoadingShipping(true);
      try {
        const payload = {
          carrierCode: "ghn",
          to_district_id: Number(district_code),
          to_ward_code: ward_code,
          items: cart.map((item) => ({
            quantity: item.quantity,
            weight: (item.product as any).weight || 500,
            price: item.product.price,
          })),
        };

        const options = await getShippingOptions(payload);
        if (options && options.length > 0) {
          const cheapest = options.reduce(
            (min: any, o: any) => (o.fee < min.fee ? o : min),
            options[0]
          );
          setSelectedShippingOption(cheapest);
          setShippingFee(cheapest.fee);
          setCodFee(cheapest.cod_fee || 0);
        } else {
          setSelectedShippingOption(null);
          setShippingFee(0);
          setCodFee(0);
        }
      } catch (err) {
        console.error("Lỗi tính phí vận chuyển:", err);
        setShippingFee(0);
        setCodFee(0);
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShippingFee();
  }, [selectedAddress, cart]);

  // 💰 Tổng tiền
  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const subtotal = itemsTotal + shippingFee + codFee;

  // 🧾 Thanh toán
  const handleCheckout = async () => {
    if (!selectedAddress) return alert("Vui lòng chọn địa chỉ giao hàng!");
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    if (!selectedShippingOption) return alert("Không có phương thức giao hàng!");

    try {
      setProcessing(true);

      const payload = {
        addressId: selectedAddress.id,
        shippingOption: {
          fee: shippingFee,
          service_id: selectedShippingOption.service_id,
          service_type_id: selectedShippingOption.service_type_id,
        },
        paymentMethod,
        notes: "Vui lòng gọi trước khi giao",
      };

      const orderRes = await createOrder(payload);
      const orderId = orderRes.order?.id || orderRes.order.id;
      if (!orderId) throw new Error("Không thể tạo đơn hàng!");

      // COD
      if (paymentMethod === "cod") {
        clearCart();
        window.location.href = `/checkout/success?orderId=${orderId}`;
        return;
      }

      // MoMo
     if (paymentMethod === "momo") {
    const payUrl = orderRes.paymentUrl;
    if (!payUrl) {
      throw new Error("Không nhận được URL thanh toán MoMo từ server!");
    }

    clearCart(); // Xóa giỏ hàng trước khi redirect
    window.location.href = payUrl;
  }
} catch (err: any) {
  console.error("❌ Lỗi thanh toán:", err);
  alert(err.message || "Thanh toán thất bại, vui lòng thử lại!");
} finally {
  setProcessing(false);
}
  };

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-5">
          {/* Địa chỉ */}
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-bold mb-3">Địa chỉ giao hàng</h2>
            <AddressSelector
              selectedAddress={selectedAddress}
              onSelect={handleSelectAddress}
              readOnlyDefault={true}
            />
          </div>

          {/* Sản phẩm */}
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">
              Sản phẩm trong giỏ ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Giỏ hàng trống</div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id || item.product.slug}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))
            )}
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="bg-white shadow rounded-xl p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold mb-3">Đơn hàng</h2>

          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{formatPrice(itemsTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí giao hàng:</span>
            <span>
              {loadingShipping ? "Đang tính..." : formatPrice(shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí COD:</span>
            <span>{formatPrice(codFee)}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-base">
            <span>Tổng cộng:</span>
            <span className="text-pink-600 text-lg">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Phương thức thanh toán */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán khi nhận hàng</span>
              </label>

              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Ví điện tử MoMo</span>
              </label>
            </div>
          </div>

          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full mt-4"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing
              ? "Đang xử lý..."
              : `Thanh toán (${formatPrice(subtotal)})`}
          </Button>

          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full mt-3 text-sm"
          >
            Xóa giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
