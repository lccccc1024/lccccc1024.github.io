/**
 * 主题切换功能
 * 用于手动切换深色/浅色模式
 * 初始化逻辑已内联到 head_custom.html 以阻止 FOUC
 */

(function() {
    function createToggleButton() {
        var btn = document.createElement('button');
        btn.id = 'theme-toggle-global';
        btn.className = 'theme-toggle-global';
        btn.title = '切换主题';
        btn.setAttribute('aria-label', '切换深色/浅色主题');
        btn.setAttribute('aria-pressed', document.documentElement.classList.contains('dark'));
        
        var icon = document.createElement('span');
        icon.className = 'theme-icon';
        btn.appendChild(icon);
        
        document.body.appendChild(btn);
        
        function updateIcon() {
            var isDark = document.documentElement.classList.contains('dark');
            icon.textContent = isDark ? '☀' : '☾';
            btn.setAttribute('aria-pressed', isDark);
        }
        
        // 同步 Giscus 评论主题
        function updateGiscusTheme(isDark) {
            var giscus = document.querySelector('iframe.giscus-frame');
            if (giscus) {
                giscus.contentWindow.postMessage({
                    giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } }
                }, 'https://giscus.app');
            }
        }

        // 监听 Giscus 加载完成后同步主题
        window.addEventListener('message', function(e) {
            if (e.origin !== 'https://giscus.app') return;
            var isDark = document.documentElement.classList.contains('dark');
            updateGiscusTheme(isDark);
        });

        btn.addEventListener('click', function() {
            var isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
            updateGiscusTheme(isDark);
        });
        
        updateIcon();
    }
    
    // 创建按钮（由 DOMContentLoaded 触发）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
})();
