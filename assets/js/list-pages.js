/**
 * 公共列表页面脚本
 * 功能：返回顶部、表格排序
 */

// 返回顶部按钮
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    // 点击返回顶部
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 表格排序功能
function initTableSort() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');
        
        if (!tbody) return;
        
        headers.forEach((th, index) => {
            th.addEventListener('click', function() {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const isAsc = th.classList.contains('sorted-asc');
                
                // 清除其他列的排序状态
                headers.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });
                
                // 设置当前列的排序状态
                if (isAsc) {
                    th.classList.add('sorted-desc');
                } else {
                    th.classList.add('sorted-asc');
                }
                
                // 排序行
                rows.sort((a, b) => {
                    let aVal = a.children[index]?.textContent.trim() || '';
                    let bVal = b.children[index]?.textContent.trim() || '';
                    
                    // 尝试数字排序
                    const aNum = parseFloat(aVal);
                    const bNum = parseFloat(bVal);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return isAsc ? bNum - aNum : aNum - bNum;
                    }
                    
                    // 字符串排序
                    return isAsc 
                        ? bVal.localeCompare(aVal, 'zh-CN') 
                        : aVal.localeCompare(bVal, 'zh-CN');
                });
                
                // 重新插入排序后的行
                rows.forEach(row => tbody.appendChild(row));
                
                // 更新序号
                updateRowNumbers(tbody);
            });
        });
    });
}

// 更新行序号
function updateRowNumbers(tbody) {
    const rows = tbody.querySelectorAll('tr');
    const total = rows.length;
    
    rows.forEach((row, index) => {
        const firstCell = row.querySelector('td:first-child');
        if (firstCell) {
            // 检查是否是数字（序号列）
            const currentVal = firstCell.textContent.trim();
            if (!isNaN(parseInt(currentVal))) {
                firstCell.textContent = total - index;
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
    initTableSort();
});
