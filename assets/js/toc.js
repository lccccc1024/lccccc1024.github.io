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

    title.addEventListener('click', function() {
      toc.classList.toggle('toc-collapsed');
      toggle.textContent = toc.classList.contains('toc-collapsed') ? '展开' : '折叠';
    });

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTOC);
  } else {
    buildTOC();
  }
})();
