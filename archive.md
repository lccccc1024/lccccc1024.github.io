---
layout: default
title: 文章归档
permalink: /archive/
---

## 文章归档

共 {{ site.posts.size }} 篇文章：

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in posts_by_year %}
### {{ year.name }} 年（{{ year.items | size }} 篇）

<ul style="list-style: none; padding-left: 0;">
  {% for post in year.items %}
    <li style="margin: 0.6em 0;">
      <span style="color: #888; font-size: 0.9em; min-width: 80px; display: inline-block;">
        {{ post.date | date: "%m-%d" }}
      </span>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {% if post.categories.size > 0 %}
        <span style="color: #aaa; font-size: 0.85em; margin-left: 8px;">
          {{ post.categories | join: ", " }}
        </span>
      {% endif %}
    </li>
  {% endfor %}
</ul>
{% endfor %}

---

[返回首页](/)
