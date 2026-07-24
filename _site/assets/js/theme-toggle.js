/**
 * 主题切换功能
 * 用于手动切换深色/浅色模式
 */

(function() {
    function createToggleButton() {
        var btn = document.createElement('button');
        btn.id = 'theme-toggle-global';
        btn.className = 'theme-toggle-global';
        btn.title = '切换主题';
        
        var icon = document.createElement('span');
        icon.className = 'theme-icon';
        btn.appendChild(icon);
        
        document.body.appendChild(btn);
        
        function updateIcon() {
            icon.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
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
})();
