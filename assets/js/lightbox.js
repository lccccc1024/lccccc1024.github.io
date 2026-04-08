/**
 * 图片点击放大功能
 * 点击文章中的图片可放大查看
 */
document.addEventListener('DOMContentLoaded', function() {
    // 创建灯箱容器
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    
    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);
    
    document.body.appendChild(lightbox);
    
    // 为文章中的图片添加点击事件
    const articleImages = document.querySelectorAll('.post-article img, article img');
    
    articleImages.forEach(function(img) {
        // 排除已有链接的图片
        if (img.closest('a')) return;
        
        img.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 设置灯箱图片源
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
            
            // 显示灯箱
            lightbox.classList.add('active');
            
            // 禁止页面滚动
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 点击灯箱关闭
    lightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
