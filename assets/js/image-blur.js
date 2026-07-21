(function() {
  'use strict';

  function init() {
    var images = document.querySelectorAll('.post-content img:not([data-no-blur])');
    images.forEach(function(img) {
      // If already loaded (from cache), skip blur to avoid flash
      if (img.complete) {
        // Skip tiny images (icons, emoji, etc.)
        if (img.naturalWidth < 100) return;
        return; // Cached full-size image, already visible
      }

      // Apply blur placeholder for loading images
      img.classList.add('img-loading');
      img.addEventListener('load', function() {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
      });
      img.addEventListener('error', function() {
        img.classList.remove('img-loading');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
