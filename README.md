<h1 align=center>🚧 Drifting PaperMod | <a href="https://blog.drifting.boats" rel="nofollow">Demo</a></h1>

<br>

本主题是 [Hugo-PaperMod](https://github.com/adityatelange/hugo-PaperMod) 的个性化版本。

## 快速开始

1. 安装 Hugo。参考文档：[Hugo Docs's - Quick Start](https://gohugo.io/getting-started/quick-start/)
   (需要 Hugo 版本 >= v0.125.3)

2. 创建 Hugo Site

```powershell
# 将下面 MySite 替换为你的网站名
hugo new site MySite --format yml
```

更多命令参考：[Hugo Docs's - hugo new site command](https://gohugo.io/commands/hugo_new_site/#synopsis)

3. 启用 Git

```powershell
cd MySite
git init .
```

4. 安装 PaperMod-PE 主题

```powershell
git submodule add --depth=1 https://github.com/DriftingBoats/Drifting-PaperMod.git themes/Drifting-PaperMod
```

5. 修改 Hugo 配置文件：

```yaml
theme: Drifitng-PaperMod
```

## 更新主题

```bash
# 进入子模块
cd themes/Drifting-PaperMod

# 强制同步远程最新状态（假设接受覆盖本地）
git fetch --depth=1 origin master
git reset --hard origin/master

# 返回主项目并提交
cd ../..
git add themes/Drifting-PaperMod
git commit -m "Fix submodule divergence and update to latest"

# 推送主项目更新（如果需要）
git push origin main
```

## 示例Hugo.yaml

