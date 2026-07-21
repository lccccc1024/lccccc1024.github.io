import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET() {
  const posts = await getCollection('posts');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  
  return rss({
    title: '闲话',
    description: '分享日常杂记、技术笔记的极简博客',
    site: 'https://blog.950922.xyz',
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
