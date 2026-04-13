# 博客网站优化方案

> 最后更新: 2026-04-13

## 一、性能诊断与修复

### 问题 1.1: KaTeX CSS 非必要加载 ✓ 已修复
**问题描述**: KaTeX CSS 通过 CDN 无条件加载，但大多数文章可能不包含数学公式。

**解决方案**: 按需加载 KaTeX，仅在文章 front-matter 设置 `math: true` 时加载。

**代码变更** (`_includes/head.html`):
```diff
- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.css" ...>
+ {% if page.math %}
+   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" ...>
+ {% endif %}
```

**使用方式**: 在需要数学公式的文章 front-matter 添加:
```yaml
math: true
```

---

### 问题 1.2: JS 文件阻塞渲染 ✓ 已修复
**问题描述**: 脚本同步加载阻塞 TTI。

**解决方案**: 添加 `defer` 属性异步加载。

**代码变更** (`_layouts/default.html`):
```diff
- <script src="{{ site.baseurl }}/assets/js/theme-toggle.js"></script>
- <script src="{{ site.baseurl }}/assets/js/code-copy.js"></script>
- <script src="{{ site.baseurl }}/assets/js/lightbox.js"></script>
+ <script src="{{ site.baseurl }}/assets/js/theme-toggle.js" defer></script>
+ <script src="{{ site.baseurl }}/assets/js/code-copy.js" defer></script>
+ <script src="{{ site.baseurl }}/assets/js/lightbox.js" defer></script>
```

---

### 问题 1.3: 主题切换脚本阻塞渲染 ✓ 已修复
**问题描述**: 内联脚本在 `<head>` 中执行，阻塞首屏渲染。

**解决方案**: 将主题初始化移至 defer 脚本中。

**代码变更** (`assets/js/theme-toggle.js`):
- 添加 `initTheme()` 函数初始化主题
- 移除 `head_custom.html` 中的阻塞内联脚本

---

## 二、代码与架构优化

### 问题 2.1: 重复的主题切换实现 ✓ 已修复
**解决方案**: 统一在 `theme-toggle.js` 中实现。

---

## 三、用户体验与可访问性 (UX/A11y)

### 问题 3.1: 缺少焦点指示器 ✓ 已修复
**代码变更** (`assets/css/custom.css`):
```css
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
```

---

### 问题 3.2: 主题切换按钮缺少无障碍支持 ✓ 已修复
**代码变更** (`assets/js/theme-toggle.js`):
```javascript
btn.setAttribute('aria-label', '切换深色/浅色主题');
btn.setAttribute('aria-pressed', isDark);
```

---

### 问题 3.3: 灯箱缺少键盘导航支持 ✓ 已修复
**代码变更** (`assets/js/lightbox.js`):
- 添加 `role="dialog"` 和 `aria-modal="true"`
- 图片添加 `tabindex="0"` 支持 Tab 聚焦
- Enter/Space 键打开灯箱

---

### 问题 3.4: lang 属性设置错误 ✓ 已修复
**代码变更** (`_layouts/default.html`):
```diff
- <html lang="{{ page.lang | default: "en" }}">
+ <html lang="{{ page.lang | default: "zh-CN" }}">
```

---

## 四、待优化项（未完成）

### 建议 1: 图片懒加载
- 非首屏图片建议手动添加 `loading="lazy"` 属性
- 首屏 LCP 图片使用 `loading="eager"` 确保优先加载

### 建议 2: 图片尺寸属性
- 为图片添加 `width` 和 `height` 属性减少 CLS

### 建议 3: 配色对比度检查
- 使用 Lighthouse 或 WebAIM 检查配色是否符合 WCAG 2.1 AA (4.5:1)

---

## 五、优化效果预期

| 优化项 | 预期收益 |
|--------|----------|
| JS defer 加载 | TTI 提升 ~200-500ms |
| KaTeX 按需加载 | 减少 ~20KB 阻塞资源 |
| 焦点指示器 | A11y 合规 |
| 键盘导航支持 | 屏幕阅读器兼容 |

---

## 六、使用说明

### 启用数学公式
在文章 front-matter 添加:
```yaml
---
title: 数学笔记
math: true
---
```

### 图片懒加载
```html
<img src="image.jpg" loading="lazy" alt="描述">
```

### 首屏图片（LCP 优化）
```html
<img src="hero.jpg" loading="eager" width="800" height="400" alt="封面">
```