const CACHE = 'xianhua-v1';
const ASSETS = [
  '/css/global.css',
  '/js/theme-toggle.js',
  '/js/particles.js',
  '/js/lightbox.js',
  '/js/code-copy.js',
  '/js/image-blur.js',
  '/js/ui-enhance.js',
  '/js/list-pages.js',
  '/js/toc.js',
  '/lccccc1024.png',
];

// Install: cache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// Fetch: network first for pages, cache first for assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Static assets: cache first
  if (ASSETS.some((a) => url.pathname === a)) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
    return;
  }

  // Pages: network first, fallback to cache, then offline page
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((r) => r || caches.match('/'))
      )
  );
});
