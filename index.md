---
layout: home
title: 首页
---

<p class="home-subtitle">愿日常的琐碎，终将组成完整的你我。</p>

## 最新文章

{% for post in site.posts limit: 8 %}
- [{{ post.title }}]({{ post.url }})　{{ post.date | date: "%Y-%m-%d" }}{% if post.categories.size > 0 %}　<span class="post-category">{{ post.categories | join: ", " }}</span>{% endif %}
{% endfor %}
