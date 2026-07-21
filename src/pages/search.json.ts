import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const data = posts.map(post => ({
    title: post.data.title,
    url: `/posts/${post.id}/`,
    date: post.data.date.toISOString().slice(0, 10),
    categories: post.data.categories || [],
    tags: post.data.tags || [],
    excerpt: (post.body || '').replace(/<[^>]+>/g, '').slice(0, 200),
  }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
