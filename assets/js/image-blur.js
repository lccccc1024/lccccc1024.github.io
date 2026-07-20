(function() {
  'use strict';

  function init() {
    var images = document.querySelectorAll('.post-content img:not([data-no-blur])');
    images.forEach(function(img) {
      // Skip small images (icons, etc.)
      if (img.width < 100 && !img.complete) return;

      // Apply loading state
      img.classList.add('img-loading');

      if (img.complete && img.naturalWidth > 0) {
        imgLoaded(img);
      } else {
        img.addEventListener('load', function() { imgLoaded(img); });
        img.addEventListener('error', function() { img.classList.remove('img-loading'); });
      }
    });
  }

  function imgLoaded(img) {
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
