# 前言
最近尝试把工作中写的文档进行整理，以备不时之需，结果发现没办法把图片上传到文章中并且正常显示，一番学习之后找到一个简单方便的方法，就是 GitHub+PicGo的方案，使用 GitHub 搭配 PicGo 搭建图床是一个简单高效、结合 jsDelivr 的免费 CDN 加速适合个人使用的免费方案，此文把这个方法记录下来方便参考。

# 一、准备工作
1. 注册一个 GitHub 账户
2. 下载安装 [PicGo](https://picgo.github.io/PicGo-Doc/zh/)（支持 Windows/Mac/Linux）

# 二、创建 GitHub 仓库
1. 登录 GitHub 点击右上角 ➕ → New repository
2. 填写信息：
	•	Repository name：比如 images
	•	选择 Public（公开）
	•	不需要勾选 README，可手动创建
3. 创建完成后，复制仓库地址，例如：
```
https://github.com/your-username/images
```

# 三、生成 GitHub token（授权上传）
1. 点击右上角头像→setting→developer setting→personal access tokens；有两个选项，选择 Tokens（classic）。
2. 点击Generate new token（classic）
3. 设置名称（note）：图床
4. 设置有效期（Expiration）：可以选择 90 days 或者 No expiration 根据自身需求来
5. 勾选 repo 点击最下方 generate token 按钮

![图例 1](https://cdn.jsdelivr.net/gh/lccccc1024/images/202504251055572.png)

6. 复制生成的token并妥善保存（只显示一次）

# 四、配置 PicGo
1. 打开 PicGo 主窗口，点击左侧图床设置→GitHub

| 项目       | 示例                      |
|------------|--------------------------|
| 设置仓库名 | your-username/images      |
| 设置分支名 | main                      |
| 设置token | 将之前生成的token粘贴在此处   |
| 设定存储路径 | 可根据需求设置或不填        |
| 设置自定义域名|https://cdn.jsdelivr.net/gh/your-username/images |

# 五、注意事项
1. 仓库必须公开，否则图片不能生成公网直链
2. GitHub 图床不适合大流量、高频率使用（可能触发限流或图片加载缓慢）