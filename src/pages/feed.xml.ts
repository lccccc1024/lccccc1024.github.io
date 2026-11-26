import rss from '@astrojs/rss';
import { excerptOf, getPublishedPosts } from '../utils/posts';

export async function GET() {
  const sorted = await getPublishedPosts();
  
  return rss({
    title: '闲话',
    description: '分享日常杂记、技术笔记的极简博客',
    site: 'https://blog.950922.xyz',
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerptOf(post, 140),
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
