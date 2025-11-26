export interface Product {
  id: string;
  name: string;
  price: string;
  category_name?: string;
  description?: string;
  images?: {
    gallery: string[];
    thumbnail: string;
  };
    slug: string; // thêm đây

  variants?: {
    id: string;
    name: string;
    price: string;
  }[];
}

export interface Variant { id: number; name: string; price: number; image?: string; }
export interface Review { id: string; customer_name: string; rating: number; content: string; created_at: string; }