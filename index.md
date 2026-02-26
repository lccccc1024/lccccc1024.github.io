---
layout: home
title: 首页
---

## 欢迎来到我的博客
这里是日常杂记、技术笔记的分享空间，极简风格，专注内容。

## 最新文章

{% for post in site.posts limit: 8 %}
- [{{ post.title }}]({{ post.url }})　{{ post.date | date: "%Y-%m-%d" }}
{% endfor %}

# <div style="text-align:center; margin:1em 0;">
#  <a href="/">首页</a>　|　<a href="/archive/">归档</a>　|　<a href="/about/">关于</a>
# </div>