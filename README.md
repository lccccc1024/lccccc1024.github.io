# 闲话

分享日常杂记、技术笔记的极简博客。

## 技术栈

- **框架**: [Astro](https://astro.build) v7
- **样式**: 纯 CSS（无框架依赖）
- **搜索**: Pagefind + Fuse.js
- **部署**: GitHub Actions → GitHub Pages
- **评论**: Giscus（基于 GitHub Discussions）

## 项目结构

```
src/
├── layouts/        # 布局组件
├── pages/          # 页面路由
├── content/posts/  # 博客文章 (MD)
├── data/           # 数据文件
components/         # - (页面内联组件)
public/
├── css/            # 全局样式
├── js/             # JavaScript 功能
└── sw.js           # Service Worker
```

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 构建生产版本
```

## 功能特性

- ⌘K 命令面板（Ctrl+K 搜索）
- 🌓 暗色模式 + 切换动画
- 📱 PWA 离线支持
- 📊 写作统计热力图
- 🎠 3D 摄影画廊
- 🔍 模糊搜索 + 静态索引
- 📡 RSS Feed + Sitemap
- 🎨 50+ 项视觉动效

## 部署

推送到 `main` 分支自动触发 GitHub Actions 构建并部署到 `gh-pages` 分支。
