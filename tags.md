---
layout: default
title: 标签
permalink: /tags/
---

## 标签

{% assign all_tags = "" | split: "" %}
{% for post in site.posts %}
  {% for tag in post.tags %}
    {% assign all_tags = all_tags | push: tag %}
  {% endfor %}
{% endfor %}
{% assign unique_tags = all_tags | uniq | sort %}

{% for tag in unique_tags %}
  {% assign tag_count = 0 %}
  {% for post in site.posts %}
    {% if post.tags contains tag %}
      {% assign tag_count = tag_count | plus: 1 %}
    {% endif %}
  {% endfor %}
  <h3 id="{{ tag }}" class="archive-year">{{ tag }}（{{ tag_count }} 篇）</h3>
  <ul class="archive-list">
  {% for post in site.posts %}
    {% if post.tags contains tag %}
      <li class="archive-item">
        <span class="archive-date">{{ post.date | date: "%m-%d" }}</span>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <span class="archive-category">{{ post.categories | join: ", " }}</span>
      </li>
    {% endif %}
  {% endfor %}
  </ul>
{% endfor %}

<a href="/" class="return-home">← 返回首页</a>
