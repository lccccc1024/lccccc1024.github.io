(function() {
    function init() {
        var btn = document.getElementById('theme-toggle-nav');
        if (!btn) return;

        var icon = btn.querySelector('.theme-icon-nav');

        function updateIcon() {
            var isDark = document.documentElement.classList.contains('dark');
            icon.textContent = isDark ? '☀' : '☾';
            btn.setAttribute('aria-pressed', isDark);
        }

        function updateGiscusTheme(isDark) {
            var giscus = document.querySelector('iframe.giscus-frame');
            if (giscus) {
                giscus.contentWindow.postMessage({
                    giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } }
                }, 'https://giscus.app');
            }
        }

        window.addEventListener('message', function(e) {
            if (e.origin !== 'https://giscus.app') return;
            updateGiscusTheme(document.documentElement.classList.contains('dark'));
        });

        btn.addEventListener('click', function() {
            var isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
            updateGiscusTheme(isDark);
        });

        updateIcon();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
