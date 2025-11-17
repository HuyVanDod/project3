import { getPosts } from "@/lib/posts";
import Link from "next/link";

export default async function BlogPage({ searchParams }: any) {
  // await searchParams trước khi dùng
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = 5;

  const posts = await getPosts(page, limit);

  // Số lượng posts backend đang trả về
  const totalPosts = 10; // ⚠️ Nên trả về từ API nếu có
  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="space-y-6">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="border p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-bold hover:text-green-600 transition">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mt-2">{post.excerpt}</p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>
                {post.author_name} •{" "}
                {new Date(post.published_at).toLocaleDateString("vi-VN")}
              </span>

              <Link
                href={`/blog/${post.slug}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-10">
        {page > 1 && (
          <Link
            href={`/blog?page=${page - 1}`}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            ← Trước
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/blog?page=${p}`}
            className={`px-4 py-2 rounded-lg border ${
              p === page ? "bg-green-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        ))}

        {page < totalPages && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Sau →
          </Link>
        )}
      </div>
    </div>
  );
}
