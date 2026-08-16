# Kindle 越狱与 KOReader 安装全记录

> 日期:2026-08-16
> 设备:Kindle 7 代基础款(2014, KT2)与 Kindle 8 代(2016, KT3)
> 方法:LanguageBreak(软件越狱,适用于固件 ≤ 5.16.2.1.1 的所有 Kindle)

---

## 一、背景

| 项目 | Kindle 8 代 | Kindle 7 代基础款 |
| --- | --- | --- |
| 年份 | 2016 | 2014 |
| 代号 | KT3 (tinker) | KT2 |
| 固件 | 5.16.2.1.1 | 5.12.2.2 |
| 结果 | 越狱 + KOReader + 全套插件 | 越狱 + KOReader + 全套插件 |

两台设备均使用 **LanguageBreak** 越狱,原理是利用 langpicker-nativebridge 漏洞,无需拆机、无需焊接。

---

## 二、越狱流程(LanguageBreak)

### 准备

1. 备份 Kindle 中的书籍
2. 开启飞行模式
3. **关闭密码锁**(卡在密码界面可输入 `111222777` 恢复出厂,但会清空数据)
4. 确认根目录无残留 `.bin` 文件或 `update.bin.tmp.partial`

### 正式流程

1. 搜索栏输入 `;enter_demo` 回车,然后**手动重启**设备
2. 进入演示模式设置:跳过 Wi-Fi → 注册信息随便填 → Skip(跳过演示内容)→ Standard(标准演示)→ Done
3. 等待进入演示主界面,做**秘密手势**:右下角双指同时按下,向左滑
4. 搜索栏输入 `;demo` → 选择 **Sideload Content**
5. 插入 USB,将 LanguageBreak 文件夹内容**完整复制**到 Kindle 根目录(第一次复制)
6. 安全弹出,拔线 → 再次输入 `;demo` → 选择 **Resell Device** → 确认 Yes
7. 屏幕出现 **"Press the Power Button"** 时,**立即**插回 USB 并再次复制 LanguageBreak 文件(第二次复制,关键步骤!)
8. 安全弹出,按屏幕提示**长按电源键**重启
9. 出现语言选择界面,选择**简体中文**(老固件上通常是列表最后一项,且没有 Pseudot 语言)
10. 设备重启,屏幕右上角闪过英文日志文字 = 桥(bridge)安装成功
11. 搜索栏输入 `;uzb` → 插 USB → 将 `update_hotfix_languagebreak-zh-Hans-CN.bin` 复制到根目录
12. 弹出 → `;dsts` → **更新您的 Kindle** → 自动重启
13. 验证:插 USB 检查根目录是否有 **mkk** 文件夹(有 = 越狱永久生效)

### 日志确认

越狱成功后,根目录会留下 `languagebreak_log`,内容示例:

```
LanguageBreak by Marek
It was the chinese all along.
Loaded logging functions
I am root - uid=0(root) gid=0(root)
Enabled developer flag
Enabled mntus exec flag
Finished installing jailbreak!
```

---

## 三、踩坑记录(KT2 固件 5.12.2.2 特有)

### 1. 更新错误 007

安装 hotfix 时提示"更新错误 007",原因:设备仍处于**受管/演示模式**,更新机制被锁定。

解决:先退出受管模式(见第 3 条),恢复正常模式后再装 hotfix。

### 2. 出厂模式错误:电池电量过高

`;demo` 进演示菜单时报"出厂模式错误,电池电量过高"(满电时常见)。

解决:在 Kindle 根目录创建**空文件** `DONT_CHECK_BATTERY`(无扩展名),有时需要**重启一次设备**才生效。

### 3. WiFi 灰色不可用(受管模式残留)

越狱后 WiFi 设置是灰色的,这是受管模式(demo/managed)残留的表现。README 官方解法:

搜索栏输入 `;demo` → 在弹出的菜单中按**右侧按钮**("Enter Demo")→ 设备会实际**重置回正常模式**(界面变英文)。

⚠️ 注意:此操作会**清空用户存储**(KOReader、插件等全部删除),但系统侧的越狱桥不受影响,重装文件即可。

### 4. `;log` 无反应 = 桥没装上

如果 `;log mrpi` 没有任何反应,说明桥没有安装成功。常见原因是**第二次文件复制**没有成功(第 7 步时 USB 未挂载)。

解决:重跑整个越狱流程,重点确保"Press the Power Button"出现后的第二次复制成功。

### 5. 根目录残留文件干扰

README 明确要求:开始前确保无残留 `.bin` / `update.bin.tmp.partial` 文件,失败的更新会留下这些文件干扰后续操作,需要清理。

---

## 四、KOReader 安装(Booklet 方式)

### 组件

| 组件 | 说明 |
| --- | --- |
| KOReader | `koreader-kindlepw2-v2026.07.1`(KT2/KT3 等触屏设备通用) |
| MRPI | MR Package Installer(通过 `;log mrpi` 安装更新包) |
| KOL Booklet | 让 KOReader 以"书"的形式出现在图书馆 |

### 步骤

1. 将 `koreader` 文件夹复制到 Kindle 根目录
2. 将 `extensions/koreader`、`extensions/MRInstaller` 复制到 `extensions/` 目录
3. 将 KOL 安装包(4 个 bin)放入 `mrpackages/` 目录
4. 搜索栏输入 `;log mrpi` 回车 → 自动安装 KOL
5. 重启设备,图书馆出现 **KOReader** 书标

> 安装了 KOL v1.5 标准版与 v1.5.3 Frameworkless 版两个书标,Frameworkless 版更省内存,日常建议用这个。

---

## 五、插件与优化

| 项目 | 内容 | 说明 |
| --- | --- | --- |
| 微信读书 | weread.koplugin v1.2.0 | 复制到 `koreader/plugins/`,扫码登录,需微信读书 Skill API Key |
| 界面美化 | simpleui.koplugin 2.1.1 | 复制到 `koreader/plugins/` |
| 中文字体 | 霞鹜文楷 LXGW WenKai v1.522 | `LXGWWenKai-Regular.ttf` 放入 `koreader/fonts/`,阅读界面字体设置中选择 |
| 英汉词典 | StarDict cdict-gb | `.ifo/.idx/.dict.dz` 放入 `koreader/data/dict/`,词典设置中启用 |
| 性能优化 | autosuspend | KOReader 自带,设置中配置自动休眠 |

### 关于禁用 OTA

计划用 renameotabin + PEKI(KUAL 替代品)禁用系统更新,但 KT3 上图书馆未出现 KUAL 书标,未能生效。不过 Kindle 7/8 代已停止维护,亚马逊不再推送新固件,实际风险很低,可跳过。

---

## 六、注意事项

1. **不要升级固件超过 5.16.2.1.1**(新固件会封堵越狱)
2. **KOReader 运行时不要插 USB 线**
3. 受管模式退出会清空用户存储,所有文件务必在电脑上留备份
4. 老固件(5.12.x)语言选择界面中"简体中文"是列表最后一项,且没有 Pseudot 语言,属正常现象
5. 设备被重置后检查 `mkk` 文件夹,缺失则重新安装 hotfix 即可恢复越狱

---

## 七、文件备份清单(电脑端)

```
LanguageBreak/                  越狱 exploit 文件
Update_hotfix_languagebreak-zh-Hans-CN.bin   hotfix 补丁
koreader-pkg/                   KOReader 本体 + extensions
mrpi-pkg/                       MRPI 安装器
mrpackages/                     KOL Booklet 安装包
weread-pkg/                     微信读书插件
simpleui-pkg/                   SimpleUI 插件
LXGWWenKai-Regular.ttf          霞鹜文楷字体
stardict-cdict-gb-2.4.2/        英汉词典
```

以上文件均保留在电脑上,设备被清空后可随时一键重装。