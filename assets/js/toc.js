(function() {
  function buildTOC() {
    var content = document.querySelector('.post-content');
    if (!content) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length < 3) return;

    var toc = document.createElement('nav');
    toc.className = 'post-toc';
    toc.setAttribute('aria-label', '文章目录');

    var title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = '目录';
    var toggle = document.createElement('span');
    toggle.className = 'toc-toggle';
    toggle.textContent = '折叠';
    title.appendChild(toggle);
    toc.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'toc-list';

    headings.forEach(function(h, i) {
      if (!h.id) {
        h.id = 'toc-' + i;
      }
      var li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    toc.appendChild(list);
    content.insertBefore(toc, content.firstChild);

    // Toggle collapse
    title.addEventListener('click', function() {
      toc.classList.toggle('toc-collapsed');
      toggle.textContent = toc.classList.contains('toc-collapsed') ? '展开' : '折叠';
    });

    // Smooth scroll on click
    toc.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.getElementById(this.getAttribute('href').slice(1));
        if (target) {
          var offset = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });

    // === Active section tracking ===
    var tocLinks = list.querySelectorAll('a');
    if (tocLinks.length === 0) return;

    function updateActive() {
      var scrollY = window.scrollY;
      var activeIndex = -1;

      for (var i = 0; i < headings.length; i++) {
        var h = headings[i];
        var rect = h.getBoundingClientRect();
        var offsetTop = rect.top + window.scrollY;
        // Consider a heading "active" if it's at or above the viewport top + 120px offset
        if (offsetTop < scrollY + 200) {
          activeIndex = i;
        }
      }

      tocLinks.forEach(function(link, i) {
        link.classList.toggle('toc-active', i === activeIndex);
      });
    }

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTOC);
  } else {
    buildTOC();
  }
})();
