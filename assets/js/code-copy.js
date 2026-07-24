/**
 * 代码复制按钮功能
 * 为文章中的代码块添加复制按钮
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var codeBlocks = document.querySelectorAll('.highlight');

        codeBlocks.forEach(function(block) {
            var code = block.querySelector('code');
            if (!code) return;

            var codeText = code.textContent;

            var btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.textContent = '复制';

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                navigator.clipboard.writeText(codeText).then(function() {
                    btn.textContent = '已复制';
                    btn.classList.add('copied');

                    setTimeout(function() {
                        btn.textContent = '复制';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(function() {
                    btn.textContent = '失败';
                });
            });

            block.style.position = 'relative';
            block.appendChild(btn);
        });
    });
})();
