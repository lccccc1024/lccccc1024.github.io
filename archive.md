---
layout: default
title: 文章归档
permalink: /archive/
---

<div class="post-card">

## 文章归档

<p class="stats" style="margin-bottom: 2em;">
共 <strong>{{ site.posts.size }}</strong> 篇文章
</p>

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
<h3 class="archive-year">{{ year.name }} 年（{{ year.items | size }} 篇）</h3>

<ul class="archive-list">
  {% for post in year.items %}
    <li class="archive-item">
      <span class="archive-date">
        {{ post.date | date: "%m-%d" }}
      </span>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {% if post.categories.size > 0 %}
        <span class="archive-category">
          {{ post.categories | join: ", " }}
        </span>
      {% endif %}
    </li>
  {% endfor %}
</ul>
{% endfor %}

---

<a href="/" class="more-posts">← 返回首页</a>

</div>
