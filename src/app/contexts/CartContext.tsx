"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useCart, UseCartReturn } from "@/hooks/useCart";

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

type CartContextType = UseCartReturn & {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartHook = useCart();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  return (
    <CartContext.Provider
      value={{ ...cartHook, selectedAddress, setSelectedAddress }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
};
