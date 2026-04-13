/**
 * 图片点击放大功能
 * 点击文章中的图片可放大查看
 */
document.addEventListener('DOMContentLoaded', function() {
    // 创建灯箱容器
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', '图片预览');
    
    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);
    
    document.body.appendChild(lightbox);
    
    // 为文章中的图片添加点击事件和键盘支持
    const articleImages = document.querySelectorAll('.post-article img, article img');
    
    articleImages.forEach(function(img) {
        // 排除已有链接的图片
        if (img.closest('a')) return;
        
        // 添加 tabindex 使图片可聚焦
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', '点击查看大图: ' + (img.alt || '图片'));
        
        function openLightbox() {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            // 聚焦灯箱图片以便键盘操作
            lightboxImg.focus();
        }
        
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox();
        });
        
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox();
            }
        });
    });
    
    // 点击灯箱关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
