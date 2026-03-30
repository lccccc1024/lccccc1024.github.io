# 博客优化设计方案

**日期**: 2026-03-30
**方案类型**: 渐进式优化
**项目**: lccccc1024.github.io (Jekyll 博客)

## 1. 项目现状

### 1.1 技术栈
- **框架**: Jekyll + GitHub Pages
- **主题**: riggraz/no-style-please
- **插件**: jekyll-feed, jekyll-seo-tag, jekyll-sitemap
- **文章数量**: 37 篇
- **自定义页面**: 3 个列表页面（电影、书籍、心愿单）

### 1.2 当前问题
1. **SEO**: meta 标签不完整，缺少结构化数据
2. **性能**: CSS/JS 重复，未压缩
3. **代码结构**: 列表页面代码高度重复
4. **设计一致性**: 列表页面与博客主站风格差异大
5. **内容管理**: 缺少分类和标签系统

## 2. 优化方案

### 2.1 代码结构优化

#### 2.1.1 创建列表页面布局
- **文件**: `_layouts/list-page.html`
- **功能**: 统一的列表页面布局模板
- **内容**:
  ```html
  ---
  layout: default
  ---
  {% include list-head.html %}
  <div class="container">
    {% include list-header.html title=page.title subtitle=page.subtitle stats=page.stats %}
    {{ content }}
  </div>
  {% include list-footer.html %}
  ```

#### 2.1.2 提取公共 Includes
- **文件**: `_includes/list-head.html`
  - Google Fonts 预加载
  - 列表页面 CSS 引用
  - 页面特定的 meta 标签

- **文件**: `_includes/list-header.html`
  - 标题区域
  - 副标题
  - 统计信息

- **文件**: `_includes/list-footer.html`
  - 返回顶部按钮
  - JavaScript 引用

#### 2.1.3 数据驱动列表
- **目录**: `_data/lists/`
- **文件**:
  - `movies.yml` - 电影数据
  - `books.yml` - 书籍数据
  - `wishlist.yml` - 心愿单数据
- **优势**: 数据与展示分离，更易维护

### 2.2 SEO 优化

#### 2.2.1 完善 `_config.yml`
```yaml
# SEO 增强
seo:
  type: Website
  locale: zh_CN
  site_name: 闲话
  twitter:
    username: ""  # 如有 Twitter 账号

# 结构化数据
schema:
  type: Blog
  author:
    name: Lcc
    url: https://github.com/lccccc1024

# Open Graph
defaults:
  - scope:
      path: ""
    values:
      image: /assets/avatar.png
      og_type: article
```

#### 2.2.2 创建 SEO 组件
- **文件**: `_includes/seo-enhanced.html`
- **功能**:
  - 完整的 Open Graph 标签
  - Twitter Card 标签
  - Schema.org 结构化数据
  - 规范链接

#### 2.2.3 创建 robots.txt
```txt
User-agent: *
Allow: /
Sitemap: https://lccccc1024.github.io/sitemap.xml
```

### 2.3 性能优化

#### 2.3.1 CSS 优化
- **提取基础样式**: `assets/css/list-pages-base.css`
  - CSS 变量定义
  - 基础布局样式
  - 响应式断点

- **页面特定样式**: 保留在各自的 `<style>` 块中
  - 电影页面：移动端标签
  - 书籍页面：移动端标签
  - 心愿单：移动端标签

- **启用 CSS 压缩**:
  ```yaml
  # _config.yml
  sass:
    style: compressed
  ```

#### 2.3.2 JavaScript 优化
- **合并重复代码**: 所有列表页面使用相同的 `list-pages.js`
- **延迟加载**: 使用 `defer` 属性
- **移除冗余**: 删除各页面中的内联脚本

#### 2.3.3 字体优化
- **预连接**: 已有 `preconnect`，保持不变
- **字体显示策略**: 添加 `font-display: swap`
- **子集化**: 考虑只加载需要的字符集（可选）

### 2.4 设计一致性

#### 2.4.1 配色调整
- **当前**: 列表页面使用紫色渐变背景
- **建议**: 调整为与博客主站更协调的配色
  - 保持渐变效果，但降低饱和度
  - 或改为浅色/深色模式自动适配

#### 2.4.2 字体统一
- **当前**: 列表页面使用 Noto Sans SC
- **博客主站**: 使用主题默认字体
- **建议**: 统一使用 Noto Sans SC（已在 head_custom.html 中引入）

#### 2.4.3 移动端适配
- **当前**: 列表页面使用卡片式布局
- **博客主站**: 使用响应式布局
- **建议**: 保持现有卡片式布局（效果好）

### 2.5 内容管理优化

#### 2.5.1 文章分类标签
- **front matter 增强**:
  ```yaml
  ---
  layout: post
  title: "文章标题"
  categories: [杂记]
  tags: [生活, 日常]
  ---
  ```

#### 2.5.2 归档页面增强
- **按年月分组显示**
- **显示分类标签**
- **添加文章数量统计**

#### 2.5.3 分类/标签页面（可选）
- **文件**: `/categories/index.html`
- **文件**: `/tags/index.html`
- **功能**: 按分类/标签浏览文章

## 3. 实施计划

### 3.1 第一阶段：代码结构优化
1. 创建 `_layouts/list-page.html`
2. 创建 `_includes/list-head.html`
3. 创建 `_includes/list-header.html`
4. 创建 `_includes/list-footer.html`
5. 重构 `light.html` 使用新布局
6. 重构 `readlist.html` 使用新布局
7. 重构 `want.html` 使用新布局

### 3.2 第二阶段：SEO 优化
1. 更新 `_config.yml` SEO 配置
2. 创建 `_includes/seo-enhanced.html`
3. 创建 `robots.txt`
4. 更新所有页面使用新的 SEO 组件

### 3.3 第三阶段：性能优化
1. 创建 `assets/css/list-pages-base.css`
2. 优化 `list-pages.js`
3. 更新列表页面引用新的 CSS/JS
4. 测试页面加载性能

### 3.4 第四阶段：设计一致性
1. 调整 `list-pages-base.css` 配色
2. 统一字体设置
3. 测试移动端显示效果

### 3.5 第五阶段：内容管理
1. 为现有文章添加分类和标签
2. 改进归档页面
3. （可选）创建分类/标签页面

## 4. 验收标准

### 4.1 SEO
- [ ] 所有页面有完整的 meta 标签
- [ ] Google Search Console 无错误
- [ ] 结构化数据验证通过

### 4.2 性能
- [ ] 列表页面 CSS 文件减少 50%
- [ ] 无重复的 JavaScript 代码
- [ ] 页面加载时间 < 2 秒

### 4.3 代码质量
- [ ] 列表页面代码重复率 < 20%
- [ ] 所有页面使用统一布局
- [ ] 数据与展示分离

### 4.4 设计
- [ ] 列表页面与博客风格协调
- [ ] 移动端显示正常
- [ ] 深色/浅色模式适配

### 4.5 内容管理
- [ ] 所有文章有分类和标签
- [ ] 归档页面按时间分组
- [ ] 分类/标签可浏览

## 5. 风险和注意事项

1. **GitHub Pages 兼容性**: 确保所有改动兼容 GitHub Pages
2. **主题更新**: 使用 remote_theme，改动可能在主题更新时丢失
3. **备份**: 在大规模重构前备份当前版本
4. **测试**: 每个阶段完成后进行本地测试

## 6. 参考资料

- [Jekyll 文档](https://jekyllrb.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [no-style-please 主题](https://github.com/riggraz/no-style-please)
- [Schema.org 博客标记](https://schema.org/Blog)
