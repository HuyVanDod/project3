import { useEffect, useState } from "react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  children?: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/v1/categories?tree=true", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return { categories, loading, error };
}
