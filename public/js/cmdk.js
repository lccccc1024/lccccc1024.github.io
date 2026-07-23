(function() {
  'use strict';

  var overlay, input, results, selectedIndex = -1;
  var pagefind, searchTimeout;

  function init() {
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

    // Load Pagefind
    var pfScript = document.createElement('script');
    pfScript.src = '/pagefind/pagefind.js';
    pfScript.onload = function() {
      pagefind = window.pagefind;
    };
    document.body.appendChild(pfScript);

    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
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
    });

    // Input handler
    input.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      var q = input.value.trim();
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

  function open() {
    overlay.classList.add('active');
    setTimeout(function() { input.focus(); }, 50);
  }

  function close() {
    overlay.classList.remove('active');
    input.value = '';
    results.innerHTML = '';
    results.classList.remove('has-results');
    selectedIndex = -1;
  }

  function doSearch(q) {
    if (!pagefind) return;
    pagefind.search(q).then(function(searchResults) {
      if (!searchResults || !searchResults.results) {
        results.innerHTML = '<div class="cmdk-empty">未找到匹配文章</div>';
        results.classList.add('has-results');
        return;
      }
      Promise.all(searchResults.results.slice(0, 10).map(function(r) { return r.data(); }))
        .then(function(data) {
          if (data.length === 0) {
            results.innerHTML = '<div class="cmdk-empty">未找到匹配文章</div>';
            results.classList.add('has-results');
            return;
          }
          results.innerHTML = data.map(function(item, i) {
            return '<a href="' + item.url + '" class="cmdk-result-item" data-index="' + i + '">' +
              '<span class="cmdk-result-title">' + item.meta.title + '</span>' +
              (item.excerpt ? '<span class="cmdk-result-excerpt">' + item.excerpt.slice(0, 100) + '</span>' : '') +
            '</a>';
          }).join('');
          results.classList.add('has-results');
          selectedIndex = -1;
        });
    });
  }

  function navigate(dir) {
    var items = results.querySelectorAll('.cmdk-result-item');
    if (items.length === 0) return;
    if (selectedIndex >= 0) items[selectedIndex].classList.remove('selected');
    selectedIndex = Math.max(0, Math.min(items.length - 1, selectedIndex + dir));
    items[selectedIndex].classList.add('selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function go() {
    var items = results.querySelectorAll('.cmdk-result-item');
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
