"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Heart, Star } from "lucide-react";
import ProductImages from "@/components/product/ProductImages";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useWishlist } from "@/app/contexts/WishlistContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Product, Variant, Review } from "@/types/product";
import { getProductVariants, getProductReviews } from "@/lib/api";

interface Props {
  product: Product;
  onClose: () => void;
  variants?: Variant[];
}

export default function ProductDetailModal({
  product,
  onClose,
  variants: initialVariants = [],
}: Props) {
  const router = useRouter();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    initialVariants[0] ?? null
  );
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [loading, setLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const reviewsPerPage = 3;
  const [reviewPage] = useState(1);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((s, r) => s + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const c: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => c[r.rating]++);
    return c;
  }, [reviews]);

  const filteredReviews = ratingFilter
    ? reviews.filter((r) => r.rating === ratingFilter)
    : reviews;

  const paginatedReviews = filteredReviews.slice(0, reviewsPerPage);

  // Wishlist
  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.some(
    (item) => Number(item.product.id) === Number(product.id)
  );

  // Fetch variants + reviews
  useEffect(() => {
    let mounted = true;

    const fetchVariants = async () => {
      try {
        const data = await getProductVariants(product.id);
        if (mounted) {
          setVariants(data);
          if (data.length && !selectedVariant) setSelectedVariant(data[0]);
        }
      } catch {}
    };

    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(product.id);
        if (mounted) setReviews(data);
      } catch {}
    };

    fetchVariants();
    fetchReviews();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  // Buy Now
  const handleBuyNow = async () => {
    try {
      await addToCart(Number(product.id), selectedVariant?.id ?? null, quantity, {
        name: product.name,
        price: selectedVariant?.price ?? parseFloat(product.price),
        image: selectedVariant?.image ?? product.images?.thumbnail,
      });

      router.push("/cart");
    } catch {
      toast.error("Không thể thực hiện mua ngay");
    }
  };

  const toggleWishlistHandler = async () => {
    try {
      setLoading(true);
      await toggleWishlist(Number(product.id));
      toast.success(
        isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
      );
    } catch {
      toast.error("Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const priceValue = selectedVariant?.price ?? parseFloat(product.price);

  const gallery = selectedVariant?.image
    ? [
        selectedVariant.image,
        ...(product.images?.gallery?.filter(
          (img) => img !== selectedVariant.image
        ) || []),
      ]
    : product.images?.gallery || [
        product.images?.thumbnail ?? "/placeholder.png",
      ];

  // ============================================
  // 🔥 FIX MODAL UI: fixed header, scroll body
  // ============================================
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      {/* WRAPPER */}
      <div className="bg-white w-full max-w-[1050px] rounded-2xl shadow-lg relative max-h-[90vh] flex flex-col overflow-hidden">

        {/* FIXED HEADER */}
        <div className="p-4 border-b bg-white sticky top-0 z-50 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 overflow-y-auto">

          {/* ====================================== */}
          {/* PRODUCT INFO SECTION */}
          {/* ====================================== */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* LEFT: IMAGES */}
            <div className="flex-1">
              <ProductImages images={gallery} name={product.name} />
            </div>

            {/* RIGHT: DETAILS */}
            <div className="flex-1">

              <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>

              <button
                onClick={toggleWishlistHandler}
                disabled={loading}
                className={`p-2 rounded-full mb-2 ${
                  isWishlisted
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Heart
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }
                />
              </button>
              {/* ============================ */}
{/* 🔥 CHỌN BIẾN THỂ (VARIANTS) */}
{/* ============================ */}
{variants.length > 0 && (
  <div className="mb-4">
    <p className="font-medium mb-2">Lựa chọn:</p>

    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => setSelectedVariant(v)}
          className={`px-3 py-2 rounded border text-sm transition ${
            selectedVariant?.id === v.id
              ? "bg-black text-white border-black"
              : "bg-white border-gray-300 hover:border-black"
          }`}
        >
          {v.name}
        </button>
      ))}
    </div>
  </div>
)}


              {/* PRICE + QUANTITY */}
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-red-600">
                  {formatPrice(priceValue)}
                </p>

                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    className="px-3"
                  >
                    −
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mb-6">
                <AddToCartButton
                  productId={parseInt(product.id)}
                  variantId={selectedVariant?.id ?? null}
                  quantity={quantity}
                />

                <button
                  onClick={handleBuyNow}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Mua ngay
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                {product.description || "Sản phẩm tươi ngon, giao hàng nhanh."}
              </p>
            </div>
          </div>

          {/* ====================================== */}
          {/* REVIEW SECTION */}
          {/* ====================================== */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Đánh giá sản phẩm</h3>

            {/* SUMMARY */}
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">
                  {averageRating}
                </p>
                <p className="text-gray-600 text-sm">trên 5</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setRatingFilter(ratingFilter === star ? null : star)
                    }
                    className={`px-3 py-1 rounded border text-sm ${
                      ratingFilter === star
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {star} Sao ({ratingCounts[star]})
                  </button>
                ))}
              </div>
            </div>

            {/* REVIEW LIST */}
            {paginatedReviews.length === 0 ? (
              <p className="text-gray-500 text-sm">Chưa có đánh giá</p>
            ) : (
              paginatedReviews.map((r) => (
                <div
                  key={r.id}
                  className="border p-3 rounded mb-3 bg-gray-50 text-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={
                          s <= r.rating ? "text-yellow-500" : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="font-medium">{r.customer_name}</span>
                  </div>

                  <p className="mb-1">{r.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
