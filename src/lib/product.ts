export interface Filters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "latest" | "priceLowHigh" | "priceHighLow"; // thêm sort

}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const API_URL = "http://localhost:5000/api/v1/products";

/**
 * Gọi API lấy danh sách sản phẩm có hỗ trợ:
 * - Tìm kiếm (search)
 * - Lọc theo danh mục (categoryId)
 * - Lọc theo giá (minPrice, maxPrice)
 * - Phân trang (page, limit)
 */
export async function fetchProductsApi(filters: Filters = {}, signal?: AbortSignal) {
  const params = new URLSearchParams();

  // ✅ Thêm các tham số vào query string nếu có
  if (filters.search) params.append("search", filters.search);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Lỗi tải sản phẩm (${res.status})`);

  const json = await res.json();
  return {
    data: json.data || [],
    pagination: json.pagination || null,
  };
}
