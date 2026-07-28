#!/bin/bash
# 项目修复脚本

echo "🚀 开始修复 lccccc1024.github.io 项目"

# 1. 清理 Jekyll 缓存
echo "📦 清理 Jekyll 缓存..."
if [ -d ".jekyll-cache" ]; then
  rm -rf .jekyll-cache
  echo "✅ Jekyll 缓存已清理"
else
  echo "ℹ️  Jekyll 缓存不存在"
fi

# 2. 重新安装依赖
echo "📥 重新安装依赖..."
npm install
if [ $? -eq 0 ]; then
  echo "✅ 依赖安装完成"
else
  echo "❌ 依赖安装失败，请手动运行 npm install"
  exit 1
fi

# 3. 验证安装
echo "🔍 验证依赖安装..."
npm list --depth=0

# 4. 清理缓存
echo "🗑️  清理缓存..."
rm -rf .astro .jekyll-cache

# 5. 运行构建
echo "🔨 运行构建..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ 构建成功！"
  echo "📁 构建输出: dist/"
else
  echo "❌ 构建失败，请检查错误信息"
  exit 1
fi

# 6. 创建必要的文件
echo "📝 创建必要文件..."

# 检查 README.md 是否存在
if [ ! -f "README.md" ]; then
  cat > README.md << 'EOF'
# 闲话 - 极简博客

分享日常杂记、技术笔记的个人博客。

## 技术栈

- Astro 7.1.3 - 现代化的静态网站生成器
- TypeScript - 类型安全
- Pagefind - 本地搜索
- CSS 变量 - 主题切换

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 预览

```bash
npm run preview
```

## 功能

- 🌓 深色/浅色主题切换
- 🔍 本地搜索
- 📱 响应式设计
- 📰 RSS 订阅
- 📸 图片灯箱
- 📝 Markdown 支持

## 部署

本项目自动部署到 GitHub Pages。

## License

ISC
EOF
  echo "✅ README.md 已创建"
else
  echo "ℹ️  README.md 已存在"
fi

echo ""
echo "🎉 修复完成！"
echo ""
echo "下一步建议:"
echo "1. 检查构建输出: npm run preview"
echo "2. 测试网站功能"
echo "3. 提交更改: git add . && git commit -m 'fix: 修复依赖和构建问题'"
echo "4. 推送到远程: git push"
