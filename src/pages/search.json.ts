import { excerptOf, getPublishedPosts } from '../utils/posts';

export async function GET() {
  const posts = await getPublishedPosts();
  const data = posts.map(post => ({
    title: post.data.title,
    url: `/posts/${post.id}/`,
    date: post.data.date.toISOString().slice(0, 10),
    categories: post.data.categories || [],
    tags: post.data.tags || [],
    excerpt: excerptOf(post, 160),
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
