"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

export interface CartItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

export interface ProductInfo {
  name: string;
  price: number;
  images: string[];
  slug: string;
}

export interface UseCartReturn {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (
    productId: number,
    variantId: number | null,
    quantity: number,
    productInfo?: ProductInfo
  ) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  fetchCart: () => Promise<void>;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
}

export const useCart = (): UseCartReturn => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const normalizeCart = (data: any[]) =>
    data.map((item) => {
      let imageArray: string[] = [];
      const variantImage = item.variant?.image;
      if (typeof variantImage === "string" && variantImage.trim().length > 0) {
        imageArray = [variantImage];
      } else if (Array.isArray(variantImage)) {
        imageArray = variantImage.filter(
          (img) => typeof img === "string" && img.trim().length > 0
        );
      }

      const product = {
        name: item.product?.name || "Unknown",
        price: item.variant?.price ?? 0,
        images: imageArray,
        slug: item.product?.slug || "",
      };

      return {
        id: item.id,
        product_id: item.product?.id,
        variant_id: item.variant?.id,
        quantity: item.quantity,
        product,
      };
    });

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
      });

      if (!res.ok) throw new Error(`Lỗi lấy giỏ hàng: ${res.status}`);
      const data = await res.json();
      const normalized = normalizeCart(data.data || data || []);
      setCart(normalized);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) fetchCart();
    else setCart([]);
  }, [user, token, fetchCart]);

  const addToCart = async (
    productId: number,
    variantId: number | null,
    quantity: number,
    productInfo?: ProductInfo
  ) => {
    if (!token) return;
    if (quantity <= 0) {
      setError("Số lượng phải lớn hơn 0.");
      return;
    }
    setLoading(true);

    let finalVariantId = variantId;
    if (!variantId) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/products/${productId}/variants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const variants = await res.json();
        if (!variants?.length) throw new Error("Sản phẩm không có variant hợp lệ.");
        finalVariantId = variants[0].id;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        return;
      }
    }

    if (productInfo) {
      const existingIndex = cart.findIndex(
        (i) => i.product_id === productId && i.variant_id === finalVariantId
      );
      if (existingIndex !== -1) {
        setCart((prev) =>
          prev.map((i, idx) =>
            idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: Date.now(),
            product_id: productId,
            variant_id: finalVariantId,
            quantity,
            product: productInfo,
          },
        ]);
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ variantId: finalVariantId, quantity }),
      });

      if (!res.ok) throw new Error(`Lỗi thêm: ${res.status}`);
      await fetchCart();
      localStorage.setItem("cart_updated", Date.now().toString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error(`Lỗi cập nhật: ${res.status}`);
      await fetchCart();
      localStorage.setItem("cart_updated", Date.now().toString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Lỗi xóa: ${res.status}`);
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      localStorage.setItem("cart_updated", Date.now().toString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Lỗi xóa toàn bộ: ${res.status}`);
      setCart([]);
      localStorage.setItem("cart_updated", Date.now().toString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useEffect(() => {
    const saved = localStorage.getItem("selected_address_id");
    if (saved) setSelectedAddressId(saved);
  }, []);

  useEffect(() => {
    if (selectedAddressId)
      localStorage.setItem("selected_address_id", selectedAddressId);
  }, [selectedAddressId]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    fetchCart,
    selectedAddressId,
    setSelectedAddressId,
  };
};
