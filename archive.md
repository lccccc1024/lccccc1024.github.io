---
layout: default
title: 文章归档
---

## 文章归档

共 {{ site.posts.size }} 篇文章（按时间倒序）：

<ul style="list-style: none; padding-left: 0;">
  {% for post in site.posts %}
    <li style="margin: 0.8em 0;">
      <span style="color: #666; font-size: 0.95em; min-width: 100px; display: inline-block;">
        {{ post.date | date: "%Y年-%m月-%d日" }}
      </span>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

---

[← 返回首页](/)
