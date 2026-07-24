/**
 * 代码复制按钮功能
 * 为文章中的代码块添加复制按钮
 */
document.addEventListener('DOMContentLoaded', function() {
    // 为每个代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach(function(block) {
        // 查找代码内容
        const code = block.querySelector('code');
        if (!code) return;
        
        // 获取原始代码文本
        const codeText = code.textContent;
        
        // 创建复制按钮
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = '复制';
        
        // 添加点击事件
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 复制到剪贴板
            navigator.clipboard.writeText(codeText).then(function() {
                btn.textContent = '已复制';
                btn.classList.add('copied');
                
                // 2秒后恢复
                setTimeout(function() {
                    btn.textContent = '复制';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('复制失败:', err);
                btn.textContent = '失败';
            });
        });
        
        // 将按钮添加到代码块容器
        block.style.position = 'relative';
        block.appendChild(btn);
    });
});
