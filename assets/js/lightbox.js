/**
 * 图片点击放大功能
 * 点击文章中的图片可放大查看（单例模式）
 */
(function() {
    var lightbox, lightboxImg;

    function init(img) {
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', '图片预览');
            lightboxImg = document.createElement('img');
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
        }

        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', '点击查看大图: ' + (img.alt || '图片'));

        img.addEventListener('click', function(e) {
            e.preventDefault();
            open(img);
        });

        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(img);
            }
        });
    }

    function open(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxImg.focus();
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('DOMContentLoaded', function() {
        var existingLightbox = document.getElementById('lightbox-overlay');
        if (existingLightbox) {
            lightbox = existingLightbox;
            lightboxImg = lightbox.querySelector('img');
        }

        var images = document.querySelectorAll('.post-article img, article img');
        images.forEach(function(img) {
            if (img.closest('a')) return;
            init(img);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
                close();
            }
        });
    });
})();
