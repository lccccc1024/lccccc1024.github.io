# frozen_string_literal: true
source "https://rubygems.org"

# 核心Jekyll依赖
gem "jekyll", "~> 4.0"

# 新增：压缩HTML/CSS/JS
gem "jekyll-minifier"
# 新增：生成站点地图（SEO）
gem "jekyll-sitemap"

# 原有必备插件（保留）
gem "jekyll-feed", "~> 0.12"

# 主题依赖
gem "no-style-please", "~> 0.3"

# 开发环境依赖
group :development do
  gem "jekyll-seo-tag", "~> 2.0"
  gem "wdm", ">= 0.1.0" if Gem.win_platform?
end