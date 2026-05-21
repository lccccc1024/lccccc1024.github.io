---
layout: home
title: 首页
---

<h2 class="home-section-title">最新文章</h2>

<ul class="home-list">
{% for post in site.posts limit: 8 %}
<li>
  <div class="home-post-inner">
    {% assign has_img = post.content | prepend: " " | split: '<img ' | size %}
    {% if has_img > 1 %}
      {% assign first_img = post.content | split: '<img ' | last | split: 'src="' | last | split: '"' | first %}
    <a href="{{ post.url }}" class="home-thumb-link">
      <img src="{{ first_img }}" alt="" class="home-thumb" loading="lazy">
    </a>
    {% else %}
    {% assign cat = post.categories | first %}
    <a href="{{ post.url }}" class="home-thumb-link home-thumb-placeholder"{% if cat %} data-category="{{ cat }}"{% endif %}></a>
    {% endif %}
    <div class="home-post-body">
      <a href="{{ post.url }}">{{ post.title }}</a>
      <div class="home-post-meta">
        <span class="home-date">{{ post.date | date: "%Y-%m-%d" }}</span>
        {% if post.categories.size > 0 %}<span class="post-category">{{ post.categories | join: ", " }}</span>{% endif %}
      </div>
      {% assign excerpt = post.excerpt | strip_html | strip_newlines | truncate: 120 %}
      {% if excerpt != "" %}
      <p class="home-excerpt">{{ excerpt }}</p>
      {% endif %}
    </div>
  </div>
</li>
{% endfor %}
</ul>

<a href="/archive/" class="more-posts">查看全部文章 →</a>

<div class="search-box">
  <input type="search" id="search-input" placeholder="搜索文章..." aria-label="搜索文章">
  <ul id="search-results" class="home-list" style="display: none;"></ul>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    var posts = [];

    fetch('/search.json').then(function(r) { return r.json(); }).then(function(data) {
        posts = data;
    });

    input.addEventListener('input', function() {
        var q = input.value.trim().toLowerCase();
        if (q.length < 1) { results.style.display = 'none'; return; }

        var matched = posts.filter(function(p) {
            return p.title.toLowerCase().indexOf(q) !== -1 ||
                   p.excerpt.toLowerCase().indexOf(q) !== -1 ||
                   p.categories.some(function(c) { return c.toLowerCase().indexOf(q) !== -1; }) ||
                   p.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; });
        });

        if (matched.length === 0) {
            results.style.display = 'block';
            results.innerHTML = '<li style="color:var(--text-secondary);padding:1em;">未找到匹配文章</li>';
            return;
        }

        results.style.display = 'block';
        results.innerHTML = matched.map(function(p) {
            return '<li><a href="' + p.url + '">' + p.title +
                   '</a><span class="home-date">' + p.date + '</span></li>';
        }).join('');
    });
});
</script>
