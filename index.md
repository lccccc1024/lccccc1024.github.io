---
layout: home
title: 首页
---

<p class="home-subtitle">愿日常的琐碎，终将组成完整的你我。</p>

## 最新文章

<ul class="home-list">
{% for post in site.posts limit: 8 %}
<li>
<a href="{{ post.url }}">{{ post.title }}</a>
<span class="home-date">{{ post.date | date: "%Y-%m-%d" }}</span>
{% if post.categories.size > 0 %}<span class="post-category">{{ post.categories | join: ", " }}</span>{% endif %}
</li>
{% endfor %}
</ul>
