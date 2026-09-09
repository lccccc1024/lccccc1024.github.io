import Fuse from 'fuse.js';
interface SearchPost { title: string; url: string; date: string; excerpt: string; categories: string[]; tags: string[] }
export async function initSearch(inputId: string, resultsId: string, limit = 20) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  if (!(input instanceof HTMLInputElement) || !results) return;
  try {
    const response = await fetch('/search.json');
    if (!response.ok) throw new Error('Search index unavailable');
    const data: SearchPost[] = await response.json();
    const fuse = new Fuse(data, { keys: ['title', 'excerpt', 'categories', 'tags'], threshold: 0.4 });
    const search = () => {
      const query = input.value.trim();
      results.replaceChildren();
      results.style.display = query ? 'block' : 'none';
      if (!query) return;
      const matches = fuse.search(query).slice(0, limit);
      if (!matches.length) { results.textContent = '未找到匹配文章'; return; }
      for (const { item } of matches) {
        const row = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        let offset = 0;
        const title = item.title.toLowerCase();
        const term = query.toLowerCase();
        let index = title.indexOf(term);
        while (index !== -1) {
          link.append(document.createTextNode(item.title.slice(offset, index)));
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.textContent = item.title.slice(index, index + query.length);
          link.append(mark);
          offset = index + query.length;
          index = title.indexOf(term, offset);
        }
        link.append(document.createTextNode(item.title.slice(offset)));
        row.append(link);
        if (inputId === 'search-input') {
          const date = document.createElement('span'); date.className = 'home-date'; date.textContent = item.date; row.append(date);
        }
        results.append(row);
      }
    };
    input.addEventListener('input', search);
    search();
  } catch {
    results.style.display = 'block';
    results.textContent = '搜索暂不可用，请稍后重试';
  }
}
