"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Heart, // ❤️ Thêm import icon Heart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);
  const { categories, loading, error } = useCategories();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { fetchCart } = useCart();
  const [searchValue, setSearchValue] = useState("");

  // Dropdown tài khoản
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setCurrentUser(user), [user]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (isCartOpen) fetchCart();
  }, [isCartOpen, fetchCart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const renderCategories = (cats: any[], level = 0) => (
    <ul className={`${level > 0 ? "pl-3 border-l border-gray-100" : ""}`}>
      {cats.map((cat) => (
        <li key={cat.id} className="relative group">
          <div
            className="flex justify-between items-center px-4 py-2 hover:bg-green-100 cursor-pointer"
            onMouseEnter={() => setOpenCategoryId(cat.id)}
            onMouseLeave={() => setOpenCategoryId(null)}
          >
            <Link
              href={`/products?categoryId=${cat.id}`}
              className="text-gray-700 hover:text-green-600 w-full"
            >
              {cat.name}
            </Link>
            {cat.children && cat.children.length > 0 && (
              <ChevronRight
                className={`w-4 h-4 text-gray-400 ml-2 transition-transform duration-200 ${
                  openCategoryId === cat.id ? "rotate-90" : ""
                }`}
              />
            )}
          </div>

          {cat.children && cat.children.length > 0 && (
            <div
              className={`absolute left-full top-0 ml-1 bg-white shadow-lg rounded-lg min-w-[180px] z-50
                transition-all duration-200
                ${
                  openCategoryId === cat.id
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }
              `}
            >
              {renderCategories(cat.children, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="w-full">
      {/* Top bar */}
      <div
        className="text-white text-sm py-3 px-4 flex justify-between items-center"
        style={{ backgroundColor: "#66BF84" }}
      ></div>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-5 px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-4xl font-bold text-green-600 tracking-wide"
          >
            FRUITY FRUIT
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-10">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-12 border rounded-full px-5 text-gray-700 text-[15px]
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Icons + User */}
          <div className="flex items-center space-x-6 relative">
            {/* Wishlist Icon ❤️ */}
            <Heart
  className="w-7 h-7 text-gray-700 cursor-pointer hover:text-red-500 transition"
  onClick={() => router.push("/profile/wishlist")}  // ✅ sửa lại
/>


            {/* Cart Icon 🛒 */}
            <CartIcon onClick={() => setIsCartOpen(true)} />

            {/* Notification 🔔 */}
            <Bell className="w-7 h-7 text-gray-700 cursor-pointer hover:text-green-600 transition" />

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center border border-gray-300 rounded-2xl px-4 py-2 hover:shadow-md transition"
              >
                <User className="w-6 h-6 text-gray-700 mr-2" />
                <span className="text-sm font-semibold text-gray-800">
                  {currentUser
                    ? currentUser.name || currentUser.email
                    : "Tài khoản"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 ml-2 text-gray-600 transition-transform duration-200 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu khi đã đăng nhập */}
              {isMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800">
                      THÔNG TIN TÀI KHOẢN
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {currentUser.name || currentUser.email}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-700 py-2">
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Tài khoản của tôi
                      </Link>
                    </li>
                   

                   
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Menu khi chưa đăng nhập */}
              {!currentUser && isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="text-sm text-gray-700">
                    <li>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ backgroundColor: "#BBFE91" }}>
  <div className="w-full px-20 py-4">
    <div className="flex justify-around items-center text-base font-medium text-gray-700 w-full">

      <Link href="/" className="hover:text-green-700 transition">
        Trang chủ
      </Link>

      <div className="relative group flex items-center">
        <button className="hover:text-green-700 transition flex items-center">
          Sản phẩm
          <ChevronDown className="ml-1 w-4 h-4" />
        </button>

        <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg min-w-[220px] z-50
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          {!loading && !error && categories.length > 0 && (
            <>
              <Link href="/products" className="block px-4 py-2 hover:bg-green-100 text-gray-700 font-semibold border-b">
                Tất cả sản phẩm
              </Link>
              {renderCategories(categories)}
            </>
          )}
        </div>
      </div>

      <Link href="/blog" className="hover:text-green-700 transition">
        Blog
      </Link>

      <Link href="/contact" className="hover:text-green-700 transition">
        Liên hệ
      </Link>

      <Link href="/sale" className="text-red-600 font-semibold hover:text-red-700 transition">
        Khuyến mãi{" "}
        <span className="bg-red-600 text-white px-2 py-0.5 text-xs rounded">
          SALE
        </span>
      </Link>

    </div>
  </div>
</nav>

      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
