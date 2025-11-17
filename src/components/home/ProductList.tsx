export default function ProductList() {
  const products = [
    {
      name: "Nho Mỹ không hạt",
      price: "250.000đ/kg",
      image: "/assets/images/product-1.png",
    },
    {
      name: "Táo Envy New Zealand",
      price: "180.000đ/kg",
      image: "/assets/images/product-2.png",
    },
    {
      name: "Cam Ai Cập",
      price: "90.000đ/kg",
      image: "/assets/images/product-3.png",
    },
  ];

  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-8">
          Sản phẩm nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-contain mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
              <p className="text-green-600 font-bold">{p.price}</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
               
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
