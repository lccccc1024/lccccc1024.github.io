import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  if (posts.length === 0) return new Response(null, { status: 302, headers: { Location: '/' } });
  const random = posts[Math.floor(Math.random() * posts.length)];
  const url = '/posts/' + encodeURI(random.id) + '/';
  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
}
