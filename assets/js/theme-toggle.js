/**
 * 主题切换功能
 * 用于手动切换深色/浅色模式
 */

(function() {
    // 初始化主题（之前阻塞渲染的内联脚本）
    function initTheme() {
        var theme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (theme === 'dark' || (!theme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    }
    
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
        
        btn.addEventListener('click', function() {
            var isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
        });
        
        updateIcon();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
    
    // 初始化主题（使用 defer 避免阻塞渲染）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
