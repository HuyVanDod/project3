"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images?: string[];
  name: string;
}

export default function ProductImages({ images = [], name }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    images = ["/placeholder.png"];
  }

  return (
    <div className="flex flex-col">
      {/* Ảnh chính */}
      <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={images[selected]}
          alt={name}
          width={450}
          height={450}
          className="object-contain w-full h-[450px]"
        />
      </div>

      {/* Ảnh nhỏ bên dưới */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelected(idx)}
              className={`w-16 h-16 rounded-md border-2 overflow-hidden cursor-pointer transition 
                ${selected === idx ? "border-red-500" : "border-gray-200 hover:border-red-300"}`}
            >
              <Image
                src={img}
                alt={`${name}-${idx}`}
                width={64}
                height={64}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
