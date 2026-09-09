const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('production resources and XML routes exist', async ({ request }) => {
  for (const url of ['/lccccc1024.png', '/robots.txt', '/manifest.json', '/search.json', '/pagefind/pagefind.js']) {
    expect((await request.get(url)).ok(), url).toBeTruthy();
  }
  for (const url of ['/sitemap.xml', '/sitemap-index.xml']) {
    const r = await request.get(url);
    expect(await r.text()).toContain('<sitemapindex');
    expect(r.headers()['content-type']).toContain('xml');
  }
  expect(fs.readFileSync('dist/sw.js', 'utf8')).not.toContain('__BUILD_VERSION__');
});

test('search works after navigation and uses one command panel', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/about/');
  await page.locator('.nav-logo').click();
  await page.locator('#search-input').fill('Kindle');
  await expect(page.locator('#search-results a').first()).toContainText('Kindle');
  await page.keyboard.press('Control+k');
  await page.locator('#cmdk-input').fill('Kindle');
  await expect(page.locator('.cmdk-result-item').first()).toBeVisible();
  await expect(page.locator('.cmdk-overlay')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.goto('/404.html');
  await page.locator('#search-input-404').fill('Kindle');
  await expect(page.locator('#search-results-404 a').first()).toContainText('Kindle');
  expect(errors).toEqual([]);
});

test('mobile menu, progress and copy survive navigation', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#nav-hamburger').click();
  await expect(page.locator('#nav-overlay')).toHaveClass(/active/);
  await page.locator('#nav-overlay a[href="/about/"]').click();
  await page.locator('#nav-hamburger').click();
  await expect(page.locator('#nav-overlay')).toHaveClass(/active/);
  const posts = await (await page.request.get('/search.json')).json();
  const post = posts.find(p => p.title.includes('Kindle'));
  await page.goto(post.url);
  await page.locator('#copy-link-btn').click();
  await expect(page.locator('#copy-link-btn')).toHaveText('已复制');
  await expect(page.locator('.code-copy-btn').first()).toBeAttached();
  await page.locator('.code-copy-btn').first().click({ force: true });
  await expect(page.locator('.code-copy-btn').first()).toHaveText('已复制');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await expect(page.locator('#back-to-top')).toHaveClass(/visible/);
  await expect(page.locator('#read-progress-text')).toHaveClass(/visible/);
  await page.locator('#back-to-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('#bg-particles')).toHaveCount(1);
});

test('date sorting compares month and day', async ({ page }) => {
  await page.goto('/readlist/');
  await page.locator('tbody').evaluate(el => {
    el.replaceChildren();
    for (const date of ['2026-09-09', '2026-01-01', '2026-05-01']) {
      const tr = document.createElement('tr');
      for (const value of ['1', 'Book', 'Author', 'Type', '2026', date]) {
        const td = document.createElement('td'); td.textContent = value; tr.append(td);
      }
      el.append(tr);
    }
  });
  const header = page.locator('th').last();
  await header.click();
  await expect(page.locator('tbody tr td:last-child')).toHaveText(['2026-01-01', '2026-05-01', '2026-09-09']);
  await header.press('Enter');
  await expect(page.locator('tbody tr td:last-child')).toHaveText(['2026-09-09', '2026-05-01', '2026-01-01']);
});

test('map treats attacker-controlled HTML as text', async ({ page }) => {
  await page.route('https://webapi.amap.com/**', route => route.fulfill({ contentType: 'application/javascript', body: `
    window.AMap = {
      Map: function() { this.add = () => {}; this.setFitView = () => {}; this.setMapStyle = () => {}; },
      Marker: function() { this.on = () => {}; },
      InfoWindow: function(options) { document.body.append(options.content); },
      Pixel: function() {}
    };
  ` }));
  const payload = '<img src=x onerror="window.auditXss=1">';
  await page.goto('/map.html#' + encodeURIComponent(JSON.stringify([{ name: payload, note: payload, date: '0000-00-00', lng: 10, lat: 10 }])));
  await expect(page.locator('b')).toHaveText(payload);
  await expect(page.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => window.auditXss)).toBeUndefined();
  await page.goto('/map.html#' + encodeURIComponent('{}'));
  await page.reload();
  await expect(page.locator('b')).toHaveCount(0);
});

test('random route chooses at visit time', async ({ browser }) => {
  const urls = [];
  for (const value of [0, 0.99]) {
    const context = await browser.newContext();
    await context.addInitScript(value => { Math.random = () => value; }, value);
    const page = await context.newPage();
    await page.goto('/random/');
    await page.waitForURL('**/posts/**'); urls.push(page.url());
    await context.close();
  }
  expect(urls[0]).not.toBe(urls[1]);
});

test('heatmap aligns weekdays and does not overflow mobile page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/stats/');
  const cells = page.locator('.heatmap-cell');
  expect(await cells.count()).toBeGreaterThanOrEqual(365);
  const [first, second, nextWeek] = await cells.evaluateAll(elements => [0, 1, 7].map(i => { const r = elements[i].getBoundingClientRect(); return { x: r.x, y: r.y }; }));
  expect(second.y).toBeGreaterThan(first.y);
  expect(nextWeek.x).toBeGreaterThan(first.x);
  expect(nextWeek.y).toBe(first.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const firstDay = page.locator('.heatmap-cell[title]').first();
  const weekday = new Date((await firstDay.getAttribute('title')).slice(0, 10)).getUTCDay();
  expect(await page.locator('.heatmap-cell[style]').count()).toBe(weekday);
});

test('service worker installs, refreshes online content and serves cached pages offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
  // Seed stale data: network-first must replace it rather than returning it.
  await page.evaluate(async () => {
    const keys = await caches.keys(); const cache = await caches.open(keys.find(k => k.startsWith('xianhua-')));
    await cache.put('/search.json', new Response('stale'));
  });
  expect(await page.evaluate(async () => (await fetch('/search.json')).json().then(Array.isArray))).toBeTruthy();
  await page.goto('/about/');
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.about-card').first()).toBeVisible();
  await context.setOffline(false);
});


test('all generated local HTML links and resources resolve', async () => {
  const root = path.resolve('dist');
  const files = [];
  const walk = dir => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else if (file.endsWith('.html')) files.push(file);
    }
  };
  walk(root);
  const missing = [];
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if (match[1].startsWith('//')) continue;
      const destination = path.join(root, decodeURIComponent(match[1]));
      if (!fs.existsSync(destination) && !fs.existsSync(path.join(destination, 'index.html'))) missing.push([file, match[1]]);
    }
  }
  expect(missing).toEqual([]);
  expect(files.length).toBeGreaterThan(50);
});
