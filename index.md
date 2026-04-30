---
layout: home
title: 首页
---

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

<details class="search-box">
  <summary>🔍 搜索文章</summary>
  <input type="search" id="search-input" placeholder="输入关键词搜索..." aria-label="搜索文章">
  <ul id="search-results" class="home-list" style="display: none;"></ul>
</details>

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
