import { getPostDetail } from "@/lib/posts";
import { Metadata } from "next";

// 🔥 Tạo metadata SEO từ backend
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = await getPostDetail(params.slug);

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: any) {
  const post = await getPostDetail(params.slug);

  return (
    <div className="max-w-3xl mx-auto py-10">

      {/* CATEGORY */}
      <div className="text-sm text-green-600 font-semibold uppercase">
        {post.category_name}
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mt-2">{post.title}</h1>

      {/* AUTHOR + DATE */}
      <div className="text-gray-500 mt-2 flex gap-3 text-sm">
        <span>✍️ {post.author_name}</span>
        <span>
          📅 {new Date(post.published_at).toLocaleDateString("vi-VN")}
        </span>
        <span>👁 {post.views} lượt xem</span>
      </div>

      {/* FEATURED IMAGE */}
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full rounded-xl my-6"
        />
      )}

      {/* CONTENT */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* TAGS */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
