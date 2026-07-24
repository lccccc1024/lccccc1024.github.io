/**
 * 公共列表页面脚本
 * 功能：表格排序
 */

// 表格排序功能
function initTableSort() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');

        if (!tbody) return;

        headers.forEach((th, index) => {
            // 键盘无障碍：表头可聚焦
            th.setAttribute('tabindex', '0');
            th.setAttribute('role', 'columnheader');
            th.setAttribute('aria-sort', 'none');

            function sortTable() {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const isAsc = th.classList.contains('sorted-asc');

                // 清除其他列的排序状态
                headers.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                    h.setAttribute('aria-sort', 'none');
                });

                // 设置当前列的排序状态
                if (isAsc) {
                    th.classList.add('sorted-desc');
                    th.setAttribute('aria-sort', 'descending');
                } else {
                    th.classList.add('sorted-asc');
                    th.setAttribute('aria-sort', 'ascending');
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
            }

            th.addEventListener('click', sortTable);
            th.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sortTable();
                }
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
                firstCell.textContent = index + 1;
            }
        }
    });
}

// 页面加载完成后初始化表格排序
function initList() { initTableSort(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initList); else initList();
