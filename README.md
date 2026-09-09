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
npm run build:all # 构建生产版本、搜索索引和版本化离线缓存
npm run verify   # 类型检查、生产构建、浏览器回归测试
```

## 功能特性

- ⌘K 命令面板（Ctrl+K 搜索）
- 🌓 暗色模式 + 切换动画
- 📱 PWA 离线支持
- 📊 写作统计热力图
- 🔍 模糊搜索 + 静态索引
- 📡 RSS Feed + Sitemap
- 🎨 50+ 项视觉动效

## 部署

推送到 `main` 分支自动触发 GitHub Actions 构建并部署到 `gh-pages` 分支。

## 验证与维护

首次运行测试需要本机安装 Chrome，或执行 `npx playwright install chrome`。
`npm run check` 执行 Astro/TypeScript 检查，`npm test` 对已构建的 `dist` 运行浏览器回归测试。
`npm audit` 检查依赖漏洞。PR 和 main 推送都会运行检查，仅 main 推送或手动运行会部署。

页面采用标准浏览器导航，每个页面独立初始化交互。跨页过渡动画已移除，避免路由切换后的监听器和动画残留。
Service Worker 在生产构建结束后按产物内容生成版本，在线重新请求资源，断网时读取已缓存资源。
图片及 robots.txt 等公开资源必须放入 `public/`；站点图标实际尺寸为 256×256。

详见 [修复后审查报告](AUDIT_REPORT.md)。
