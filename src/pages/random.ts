import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const random = posts[Math.floor(Math.random() * posts.length)];
  const url = '/posts/' + encodeURI(random.id) + '/';
  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
}
