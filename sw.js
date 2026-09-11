const CACHE = 'xianhua-dba28e0337ad683a';
const ASSETS = ['/', '/css/global.css', '/js/theme-toggle.js', '/js/cmdk.js', '/search.json', '/lccccc1024.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('xianhua-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Revalidate every request: current content online, cached content offline.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        try { await cache.put(request, response.clone()); } catch { /* Quota must not break online access. */ }
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return new Response('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>离线</title><h1>当前处于离线状态</h1><p>此页面尚未缓存，请联网后重试。</p><a href="/">返回首页</a></html>', {
          status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      return Response.error();
    }
  })());
});
