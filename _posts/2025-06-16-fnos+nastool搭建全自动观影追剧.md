---
layout: post
---
# 前言
虽然早就在家里搭了NAS，但是一直都没有真正发挥出作用来。借着最近Alist被收购不再可靠的缘由研究了一下自动观影追剧的流程，顺便写个文档记录下来。
---

# 一、准备工作
我们需要先安装三个东西分别是nastool、qBittorrent、Jackett。
然后需要注册一个TMDB账户，并生成一个api。
## 安装nastool
1. 打开Docker，在镜像仓库搜索 fjlzwl/nastool 并下载。
![](https://cdn.jsdelivr.net/gh/lccccc1024/images/20250618101549.png)
2. 打开fnos的文件管理，创建一个nastool文件夹再进入到此文件夹内创建一个config文件夹。
![](https://cdn.jsdelivr.net/gh/lccccc1024/images/20250618101855.png)
3. 回到doocker，点击容器-添加容器，镜像名称选择刚刚下载的fjlzwl/nastool:latest，容器名称保持默认，勾选左下角开机自动开启，点击下一步。
![](https://cdn.jsdelivr.net/gh/lccccc1024/images/20250618102710.png)
4. 来到高级设置，端口设置如无特殊情况无需更改，存储位置需要手动调整。
选择之前在文件管理中创建的config文件夹挂载为/config ，选择计划用来存储影视资源的文件夹挂在为/media ，其它选项不动继续下一步，点击创建。
![](https://cdn.jsdelivr.net/gh/lccccc1024/images/20250618103224.png)
## 安装qBittorrent、Jackett
这两个都是应用中心内可以直接安装的软件，直接默认安装即可。
## 注册TMDB账号并生成api
来到官网https://www.themoviedb.org/ ，注册好一个账户并登录。
点击自己的头像选择账户设置然后点击左侧的api页，生成一个api ,信息随便填一下。
# 二、开始配置
## 配置qBittorrent、Jackett
