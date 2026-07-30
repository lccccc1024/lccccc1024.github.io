(function() {
  'use strict';

  function init() {
    // Code block language labels
    let highlights = document.querySelectorAll('.post-content .highlight');
    highlights.forEach(function(block) {
      let code = block.querySelector('code');
      if (!code) return;

      // Extract language from class (e.g., "language-javascript" → "js")
      let langClass = Array.from(code.classList).find(function(c) {
        return c.startsWith('language-');
      });
      if (!langClass) return;

      let lang = langClass.replace('language-', '');
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

    // Table row entrance
    let rows = document.querySelectorAll('.table-container tbody tr');
    rows.forEach(function(row, i) {
      row.style.animationDelay = (i * 0.04) + 's';
      row.classList.add('row-enter');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
