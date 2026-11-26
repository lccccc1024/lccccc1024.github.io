import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

const EMOJI_MAP: Record<string, string> = {
  ':joy:': '😂',
  ':smile:': '😄',
  ':heart:': '❤️',
  ':thumbsup:': '👍',
};

/** 获取所有已发布文章（过滤草稿），默认按日期降序排列 */
export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 清理 Markdown 标记，生成纯文本摘要 */
export function stripMarkdown(raw: string): string {
  let text = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/~~([^~]*)~~/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\|:?[-]+:?/g, ' ')
    .replace(/[*_~|#>`-]/g, ' ');

  for (const [code, emoji] of Object.entries(EMOJI_MAP)) {
    text = text.replaceAll(code, emoji);
  }

  return text.replace(/\s+/g, ' ').trim();
}

/** 获取文章摘要，优先使用 frontmatter 的 description */
export function excerptOf(post: PostEntry, maxLength = 72): string {
  if (post.data.description) return post.data.description;
  const plain = stripMarkdown(post.body ?? '');
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trimEnd() + '…';
}

/** 估算真实可读字数（CJK 字符 + 英文/数字单词） */
export function wordCountOf(body: string | undefined): number {
  const plain = stripMarkdown(body ?? '');
  const cjk = (plain.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length;
  const nonCjkWords = (
    plain
      .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, ' ')
      .match(/[A-Za-z0-9_]+/g) || []
  ).length;
  return cjk + nonCjkWords;
}

/** 估算阅读分钟数 */
export function readingMinutesOf(body: string | undefined): number {
  return Math.max(1, Math.ceil(wordCountOf(body) / 250));
}

/** 提取系列文章分组名，兼容数字尾缀与中文括号序号 */
export function seriesBase(post: PostEntry): string {
  if (post.data.series) return post.data.series.trim();
  return post.data.title
    .replace(/[（(][一二三四五六七八九十百\d]+[）)]\s*$/, '')
    .replace(/[\s\d]*$/, '')
    .trim();
}
