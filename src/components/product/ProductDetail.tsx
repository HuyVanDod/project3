"use client";

import { useState, useEffect } from "react";
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

export default function ProductDetailModal({ product, onClose, variants: initialVariants = [] }: Props) {
  const router = useRouter();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariants[0] ?? null);
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 3;

  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.some((item) => Number(item.product.id) === Number(product.id));

  // ================= fetch variants + reviews
  useEffect(() => {
    let mounted = true;

    const fetchVariants = async () => {
      try {
        const data = await getProductVariants(product.id);
        if (mounted) {
          setVariants(data);
          if (data.length && !selectedVariant) setSelectedVariant(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(product.id);
        if (mounted) setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVariants();
    fetchReviews();

    return () => { mounted = false; };
  }, [product.id]);

  const filteredReviews = ratingFilter ? reviews.filter(r => r.rating === ratingFilter) : reviews;
  const paginatedReviews = filteredReviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(
        Number(product.id),
        selectedVariant?.id ?? null,
        quantity,
        {
          name: product.name,
          price: selectedVariant?.price ?? parseFloat(product.price),
          image: selectedVariant?.image ?? product.images?.thumbnail,
        }
      );
      router.push("/cart");
    } catch (err) {
      toast.error("Không thể thực hiện mua ngay");
      console.error(err);
    }
  };

  const toggleWishlistHandler = async () => {
    try {
      setLoading(true);
      await toggleWishlist(Number(product.id));
      toast.success(isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích");
    } catch (err) {
      toast.error("Thao tác thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const priceValue = selectedVariant?.price ?? parseFloat(product.price);

  const gallery = selectedVariant?.image
    ? [selectedVariant.image, ...(product.images?.gallery?.filter(img => img !== selectedVariant.image) || [])]
    : product.images?.gallery || [product.images?.thumbnail ?? "/placeholder.png"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-y-auto">
      <div className="bg-white max-w-[1000px] w-full rounded-2xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-1 right-1 text-gray-500 hover:text-red-500"><X size={28} /></button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1"><ProductImages images={gallery} name={product.name} /></div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-semibold">{product.name}</h2>
                <button
                  onClick={toggleWishlistHandler}
                  disabled={loading}
                  className={`p-2 rounded-full ${isWishlisted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}
                >
                  <Heart className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-3">Danh mục: <span className="font-medium">{product.category_name || "Chưa rõ"}</span></p>

              {variants.length > 0 && (
                <select
                  value={selectedVariant?.id ?? ""}
                  onChange={e => {
                    const variant = variants.find(v => v.id.toString() === e.target.value) ?? null;
                    setSelectedVariant(variant);
                  }}
                  className="w-full p-2 border rounded mb-4"
                >
                  {variants.map(v => <option key={v.id} value={v.id}>{v.name} ({formatPrice(v.price)})</option>)}
                </select>
              )}

              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-red-600">{formatPrice(priceValue)}</p>
                <div className="flex items-center border rounded">
                  <button onClick={() => setQuantity(q => Math.max(q - 1, 1))} className="px-3">−</button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3">+</button>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <AddToCartButton productId={parseInt(product.id)} variantId={selectedVariant?.id ?? null} quantity={quantity} />
                <button onClick={handleBuyNow} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Mua ngay</button>
              </div>

              <p className="text-gray-700 mb-6">{product.description || "Sản phẩm tươi ngon, giao hàng nhanh."}</p>

              <h3 className="text-lg font-semibold mb-2">Đánh giá</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRatingFilter(ratingFilter===s?null:s)}>
                    <Star size={20} className={s <= (ratingFilter ?? 0) ? "text-yellow-500" : "text-gray-300"} />
                  </button>
                ))}
              </div>

              {paginatedReviews.length === 0 ? <p className="text-gray-500 text-sm">Chưa có đánh giá</p> :
                paginatedReviews.map(r => (
                  <div key={r.id} className="border p-2 rounded mb-2 bg-gray-50 text-sm">
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= r.rating ? "text-yellow-500" : "text-gray-300"} />)}
                      <span className="font-medium">{r.customer_name}</span>
                    </div>
                    <p>{r.content}</p>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
