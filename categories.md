---
layout: default
title: 分类
permalink: /categories/
---

<div class="post-card">

## 分类

{% assign all_cats = "" | split: "" %}
{% for post in site.posts %}
  {% for cat in post.categories %}
    {% assign all_cats = all_cats | push: cat %}
  {% endfor %}
{% endfor %}
{% assign unique_cats = all_cats | uniq | sort %}

{% if unique_cats.size > 0 %}
<div class="tag-cloud" style="margin-bottom: var(--space-2xl);">
{% for cat in unique_cats %}
  {% assign cat_count = 0 %}
  {% for post in site.posts %}
    {% if post.categories contains cat %}
      {% assign cat_count = cat_count | plus: 1 %}
    {% endif %}
  {% endfor %}
  <a href="#{{ cat | slugify }}">
    {{ cat }}
    <span class="tag-count">{{ cat_count }}</span>
  </a>
{% endfor %}
</div>
{% endif %}

{% for cat in unique_cats %}
  {% assign cat_count = 0 %}
  {% for post in site.posts %}
    {% if post.categories contains cat %}
      {% assign cat_count = cat_count | plus: 1 %}
    {% endif %}
  {% endfor %}
  <h3 id="{{ cat | slugify }}" class="archive-year">{{ cat }} 分类（{{ cat_count }} 篇）</h3>
  <ul class="archive-list">
  {% for post in site.posts %}
    {% if post.categories contains cat %}
      <li class="archive-item">
        <span class="archive-date">{{ post.date | date: "%m-%d" }}</span>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <span class="archive-category">{{ post.tags | join: ", " }}</span>
      </li>
    {% endif %}
  {% endfor %}
  </ul>
{% endfor %}

<a href="/" class="more-posts">← 返回首页</a>

</div>
