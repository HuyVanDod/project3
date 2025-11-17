"use client";
import { useState, useEffect, useCallback } from "react";
import { loginApi, registerApi } from "@/lib/auth";

interface User {
  email: string;
  [key: string]: any;
}

// 🔁 Hàm phát sự kiện đồng bộ auth trong cùng tab
const triggerAuthSync = () => window.dispatchEvent(new Event("auth_sync"));

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ Hàm load thông tin từ localStorage
  const loadAuthFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // ✅ Load khi khởi động app
  useEffect(() => {
    loadAuthFromStorage();

    // Lắng nghe thay đổi giữa các tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth_updated") loadAuthFromStorage();
    };

    // Lắng nghe đồng bộ trong cùng tab
    const handleAuthSync = () => loadAuthFromStorage();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth_sync", handleAuthSync);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth_sync", handleAuthSync);
    };
  }, [loadAuthFromStorage]);

  // ✅ Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginApi(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("auth_updated", Date.now().toString());
      triggerAuthSync();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng ký
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const data = await registerApi(name, email, password);
      setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    localStorage.setItem("auth_updated", Date.now().toString());
    triggerAuthSync();
  };

  return {
    user,
    token,
    loading,
    error,
    successMessage,
    login,
    register,
    logout,
    isLoggedIn: !!user,
  };
}
