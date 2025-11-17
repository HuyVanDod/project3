import { BASE_URL } from "@/lib/api";


export async function getPosts(page = 1, limit = 5) {
  const res = await fetch(`${BASE_URL}/api/v1/posts?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
export async function getPostDetail(slug: string) {
  const res = await fetch(
    `${BASE_URL}/api/v1/posts/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}