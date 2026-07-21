(function() {
    function init() {
        var btn = document.getElementById('theme-toggle-nav');
        if (!btn) return;

        var icon = btn.querySelector('.theme-icon-nav');

        function updateIcon() {
            var isDark = document.documentElement.classList.contains('dark');
            icon.innerHTML = isDark
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
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
