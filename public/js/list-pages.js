/**
 * 公共列表页面脚本
 * 功能：表格排序
 */
(function() {

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
                    if (/^\d{4}-\d{2}(?:-\d{2})?$/.test(aVal) && /^\d{4}-\d{2}(?:-\d{2})?$/.test(bVal)) {
                        return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                    }
                    const aNum = Number(aVal.replace(/[,¥￥$]/g, ''));
                    const bNum = Number(bVal.replace(/[,¥￥$]/g, ''));

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

// 表格关键词筛选功能
function initTableFilter() {
    const containers = document.querySelectorAll('.list-page-content .table-container');
    containers.forEach(container => {
        if (container.previousElementSibling && container.previousElementSibling.classList.contains('list-filter-bar')) return;
        const tbody = container.querySelector('tbody');
        if (!tbody) return;

        const bar = document.createElement('div');
        bar.className = 'list-filter-bar';

        const input = document.createElement('input');
        input.type = 'search';
        input.className = 'list-filter-input';
        input.placeholder = '输入关键词筛选当前列表…';
        input.setAttribute('aria-label', '筛选列表内容');

        const countEl = document.createElement('span');
        countEl.className = 'list-filter-count';

        const updateFilter = () => {
            const q = input.value.trim().toLowerCase();
            const rows = Array.from(tbody.querySelectorAll('tr'));
            let visible = 0;
            rows.forEach(row => {
                const match = !q || (row.textContent || '').toLowerCase().includes(q);
                row.style.display = match ? '' : 'none';
                if (match) visible++;
            });
            countEl.textContent = q ? ('匹配 ' + visible + ' / ' + rows.length + ' 项') : '';
        };

        input.addEventListener('input', updateFilter);
        bar.appendChild(input);
        bar.appendChild(countEl);
        container.parentNode.insertBefore(bar, container);
    });
}

// 页面加载完成后初始化表格排序与筛选
function initList() { initTableSort(); initTableFilter(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initList); else initList();

})();
