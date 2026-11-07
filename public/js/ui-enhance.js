(function() {
  'use strict';

  function init() {
    // Code block language labels
    let highlights = document.querySelectorAll('.post-content pre.astro-code');
    highlights.forEach(function(block) {
      let code = block.querySelector('code');
      if (!code) return;
      if (block.querySelector('.code-lang-label')) return;

      // Extract language from class (e.g., "language-javascript" → "js")
      let langClass = Array.from(code.classList).find(function(c) {
        return c.startsWith('language-');
      });
      if (!langClass && !block.dataset.language) return;

      let lang = block.dataset.language || langClass.replace('language-', '');
      // Shorten common names
      let short = {
        'javascript': 'js',
        'typescript': 'ts',
        'python': 'py',
        'ruby': 'rb',
        'shell': 'bash',
        'dockerfile': 'docker',
        'yaml': 'yml',
        'markdown': 'md'
      };
      let label = short[lang] || lang;

      let el = document.createElement('span');
      el.className = 'code-lang-label';
      el.textContent = label;
      block.appendChild(el);
    });

    // 表格行不再做逐行入场动画：全站入场只保留页面级 page-enter，
    // 见 public/css/components.css 的「动效契约」
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
