(function() {
  'use strict';

  function init() {
    // Code block language labels
    var highlights = document.querySelectorAll('.post-content .highlight');
    highlights.forEach(function(block) {
      var code = block.querySelector('code');
      if (!code) return;

      // Extract language from class (e.g., "language-javascript" → "js")
      var langClass = Array.from(code.classList).find(function(c) {
        return c.startsWith('language-');
      });
      if (!langClass) return;

      var lang = langClass.replace('language-', '');
      // Shorten common names
      var short = {
        'javascript': 'js',
        'typescript': 'ts',
        'python': 'py',
        'ruby': 'rb',
        'shell': 'bash',
        'dockerfile': 'docker',
        'yaml': 'yml',
        'markdown': 'md'
      };
      var label = short[lang] || lang;

      var el = document.createElement('span');
      el.className = 'code-lang-label';
      el.textContent = label;
      block.appendChild(el);
    });

    // Table row entrance
    var rows = document.querySelectorAll('.table-container tbody tr');
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
