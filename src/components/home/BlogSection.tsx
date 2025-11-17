export default function BlogSection() {
  const blogs = [
    {
      title: "Cách bảo quản trái cây tươi lâu",
      image: "/assets/images/blog-1.png",
    },
    {
      title: "Top 5 loại trái cây tốt cho sức khỏe",
      image: "/assets/images/blog-2.png",
    },
    {
      title: "Ăn trái cây đúng cách",
      image: "/assets/images/blog-3.png",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-8">
          Tin tức & Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {blogs.map((b, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {b.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
