"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* Banner */}
      <Image
        src="/assets/images/Promotion.png"
        alt="Promotion Banner"
        width={1440}
        height={400}
        priority
        className="w-full h-auto object-cover rounded-lg"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16">
        <h2 className="text-3xl md:text-5xl font-bold text-green-900 max-w-xl drop-shadow">
          Makin Sehat Dengan Promo 9.9
        </h2>
        <p className="mt-4 text-lg md:text-xl bg-white px-4 py-2 rounded-lg font-semibold text-green-700 shadow">
          90% Semua Item!
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Belanja Sekarang
        </Link>
      </div>
    </section>
  );
}
