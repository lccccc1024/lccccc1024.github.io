(function() {
  'use strict';

  function init() {
    let images = document.querySelectorAll('.post-content img:not([data-no-blur]):not([data-blur-done])');
    images.forEach(function(img) {
      img.setAttribute('data-blur-done', '');
      // If already loaded (from cache), skip blur to avoid flash
      if (img.complete) {
        // Skip tiny images (icons, emoji, etc.)
        if (img.naturalWidth < 100) return;
        return; // Cached full-size image, already visible
      }

      // Apply blur placeholder for loading images
      img.classList.add('img-loading');
      img.addEventListener('load', function onLoad() {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
        img.removeEventListener('load', onLoad);
      });
      img.addEventListener('error', function onError() {
        img.classList.remove('img-loading');
        img.removeEventListener('error', onError);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
