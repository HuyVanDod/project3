"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  category_slug: string;
  currentId: string;
}

export default function RelatedProducts({ category_slug, currentId }: RelatedProductsProps) {
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (!category_slug) return;
    fetch(`http://localhost:5000/api/products/category/${category_slug}`)
      .then((res) => res.json())
      .then((data) =>
        setRelated(data.filter((item: any) => item.id !== currentId))
      );
  }, [category_slug, currentId]);

  if (related.length === 0) return null;

  return (
    <section className="container mx-auto px-6 mt-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Sản phẩm liên quan</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
