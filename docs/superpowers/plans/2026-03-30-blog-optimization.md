# 博客优化实施计划

> **Goal:** 对 lccccc1024.github.io Jekyll 博客进行渐进式优化，涵盖代码结构、SEO、性能、设计一致性和内容管理。

**Tech Stack:** Jekyll, GitHub Pages, Liquid 模板, HTML/CSS/JS

---

## 文件结构映射

| 文件 | 操作 | 用途 |
|------|------|------|
| `_layouts/list-page.html` | 新建 | 列表页面统一布局 |
| `_includes/list-head.html` | 新建 | 列表页面公共 head |
| `_includes/list-header.html` | 新建 | 列表页面标题区域 |
| `_includes/list-footer.html` | 新建 | 列表页面底部 JS |
| `_includes/seo-enhanced.html` | 新建 | SEO 组件 |
| `assets/css/list-pages-base.css` | 新建 | 列表页面基础样式 |
| `light.html` | 重构 | 使用新布局 |
| `readlist.html` | 重构 | 使用新布局 |
| `want.html` | 重构 | 使用新布局 |
| `_config.yml` | 修改 | SEO 配置增强 |
| `robots.txt` | 新建 | 搜索引擎爬虫配置 |
| `archive.md` | 增强 | 按年月分组 |
| `_posts/*.md` | 批量修改 | 添加分类标签 |

---

## 第一阶段：代码结构优化

### Task 1: 创建列表页面公共组件

创建 `_layouts/list-page.html`、`_includes/list-head.html`、`_includes/list-header.html`、`_includes/list-footer.html`

### Task 2: 创建列表页面基础 CSS

创建 `assets/css/list-pages-base.css`，提取现有 `list-pages.css` 中的公共样式

### Task 3: 重构三个列表页面

重构 `light.html`、`readlist.html`、`want.html` 使用新布局

---

## 第二阶段：SEO 优化

### Task 4: 更新 _config.yml 和创建 robots.txt

### Task 5: 创建 SEO 组件并更新 head_custom.html

---

## 第三阶段：性能与设计

### Task 6: 优化 CSS 配色和字体统一

---

## 第四阶段：内容管理

### Task 7: 为文章添加分类标签

### Task 8: 增强归档页面

