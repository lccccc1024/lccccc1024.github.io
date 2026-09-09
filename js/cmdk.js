(function() {
  'use strict';

  let overlay, input, results, selectedIndex = -1;
  let pagefind, searchTimeout;
  let boundKeydown;
  let searchGeneration = 0;

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function cleanup() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null; input = null; results = null;
    if (boundKeydown) document.removeEventListener('keydown', boundKeydown);
    boundKeydown = null;
  }

  function init() {
    cleanup();


    // Create DOM
    overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.innerHTML =
      '<div class="cmdk-modal">' +
        '<div class="cmdk-input-wrap">' +
          '<svg class="cmdk-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input class="cmdk-input" id="cmdk-input" type="search" placeholder="搜索文章..." autocomplete="off" autocorrect="off" spellcheck="false">' +
          '<kbd class="cmdk-esc-hint">ESC</kbd>' +
        '</div>' +
        '<div class="cmdk-results" id="cmdk-results"></div>' +
        '<div class="cmdk-footer">' +
          '<span><kbd class="cmdk-key">↑</kbd><kbd class="cmdk-key">↓</kbd> 导航</span>' +
          '<span><kbd class="cmdk-key">↵</kbd> 打开</span>' +
          '<span><kbd class="cmdk-key">ESC</kbd> 关闭</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    input = document.getElementById('cmdk-input');
    results = document.getElementById('cmdk-results');

    // Keyboard shortcut
    boundKeydown = function(e) {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      // Forward slash (not in input)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey &&
          !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        open();
      }
      // ESC to close
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        close();
      }
      // Arrow navigation when open
      if (overlay.classList.contains('active') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        navigate(e.key === 'ArrowDown' ? 1 : -1);
      }
      // Enter to go
      if (overlay.classList.contains('active') && e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    document.addEventListener('keydown', boundKeydown);

    // Input handler
    input.addEventListener('input', function() {
      searchGeneration++;
      selectedIndex = -1;
      clearTimeout(searchTimeout);
      let q = input.value.trim();
      if (q.length < 1) {
        results.innerHTML = '';
        results.classList.remove('has-results');
        return;
      }
      searchTimeout = setTimeout(function() { doSearch(q); }, 150);
    });

    // Click outside to close
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });
  }

  async function open() {
    overlay.classList.add('active');
    input.focus();
    if (!pagefind) {
      try { pagefind = await import('/pagefind/pagefind.js'); if (input.value.trim()) doSearch(input.value.trim()); }
      catch { results.textContent = '搜索暂不可用，请稍后重试'; }
    }
  }

  function close() {
    overlay.classList.remove('active');
    searchGeneration++;
    clearTimeout(searchTimeout);
    input.value = '';
    results.innerHTML = '';
    results.classList.remove('has-results');
    selectedIndex = -1;
  }

  function doSearch(q) {
    if (!pagefind) return;
    const generation = ++searchGeneration;
    pagefind.search(q).then(function(searchResults) {
      if (generation !== searchGeneration || input.value.trim() !== q) return;
      if (!searchResults || !searchResults.results) {
        results.innerHTML = '<div class="cmdk-empty">未找到匹配文章</div>';
        results.classList.add('has-results');
        return;
      }
      return Promise.all(searchResults.results.slice(0, 10).map(function(r) { return r.data(); }))
        .then(function(data) {
          if (generation !== searchGeneration || input.value.trim() !== q) return;
          if (data.length === 0) {
            results.innerHTML = '<div class="cmdk-empty">未找到匹配文章</div>';
            results.classList.add('has-results');
            return;
          }
          results.innerHTML = data.map(function(item, i) {
            return '<a href="' + escapeHtml(item.url) + '" class="cmdk-result-item" data-index="' + i + '">' +
              '<span class="cmdk-result-title">' + escapeHtml(item.meta.title) + '</span>' +
              (item.excerpt ? '<span class="cmdk-result-excerpt">' + escapeHtml(item.excerpt.slice(0, 100)) + '</span>' : '') +
            '</a>';
          }).join('');
          results.classList.add('has-results');
          selectedIndex = -1;
        });
    }).catch(function() { if (generation === searchGeneration) results.textContent = '搜索失败，请重试'; });
  }

  function navigate(dir) {
    let items = results.querySelectorAll('.cmdk-result-item');
    if (items.length === 0) return;
    if (items[selectedIndex]) items[selectedIndex].classList.remove('selected');
    selectedIndex = Math.max(0, Math.min(items.length - 1, selectedIndex + dir));
    items[selectedIndex].classList.add('selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function go() {
    let items = results.querySelectorAll('.cmdk-result-item');
    if (selectedIndex >= 0 && items[selectedIndex]) {
      window.location.href = items[selectedIndex].href;
    } else if (items.length > 0) {
      window.location.href = items[0].href;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
