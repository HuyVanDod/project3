"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Loader2, HeartOff, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { useCartContext } from "@/app/contexts/CartContext";
import ProductDetailModal from "@/components/product/ProductDetail"; 

interface WishlistProduct {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    images?: {
      gallery: string[];
      thumbnail: string;
    };
    description?: string;
    category_name?: string;
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState<WishlistProduct["product"] | null>(null);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // số sản phẩm mỗi trang

  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const paginatedWishlist = wishlist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getWishlist();
        setWishlist(data);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } catch (err: any) {
      toast.error(err.message || "Xóa thất bại");
    }
  };

  const handleAddToCart = async (product: WishlistProduct["product"]) => {
    try {
      const imageArray: string[] = [];
      if (product.images?.thumbnail) imageArray.push(product.images.thumbnail);
      if (product.images?.gallery?.length) imageArray.push(...product.images.gallery);

      await addToCart(product.id, null, 1, {
        name: product.name,
        price: product.price,
        images: imageArray.length ? imageArray : ["/placeholder.png"],
        slug: product.slug,
      });

      toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm vào giỏ hàng");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">💖 Danh sách yêu thích</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <HeartOff className="mx-auto w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích.
          </p>
          <Link href="/products">
            <Button className="mt-4">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedWishlist.map(({ product }) => {
              const imageSrc =
                product.images?.thumbnail ||
                product.images?.gallery?.[0] ||
                "/placeholder.png";

              return (
                <div
                  key={product.id}
                  className="border rounded-xl shadow-sm p-3 hover:shadow-lg transition relative"
                >
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer"
                  >
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="rounded-lg object-cover w-full h-48"
                    />
                    <div className="mt-3">
                      <h2 className="font-semibold text-sm truncate">
                        {product.name}
                      </h2>
                      <p className="text-orange-500 font-bold mt-1">
                        {product.price.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Thêm giỏ hàng
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(product.id)}
                    >
                      <HeartOff className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- Pagination Controls --- */}
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={{
            ...selectedProduct,
            id: selectedProduct.id.toString(),
            price: selectedProduct.price.toString(),
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
