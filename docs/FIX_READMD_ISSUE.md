# 🔧 修复 GitHub Pages 显示 README.md 问题

## 📋 问题描述

部署后访问 `https://czj527.github.io/portfolio/` 显示的是 README.md 的内容，而不是构建后的网站。

## 🎯 问题原因

这是 **GitHub Pages 的 Source（源）设置不正确** 导致的。GitHub Pages 默认可能配置为从其他目录或分支部署，而不是使用 GitHub Actions 构建的静态站点。

---

## ✅ 解决方案

### 方法一：配置 GitHub Pages 使用 GitHub Actions（推荐）

这是最可靠的方法，因为我们使用的是 GitHub Actions 来构建和部署。

#### 步骤 1：修改 GitHub Actions 配置

首先，我需要修复 `.github/workflows/deploy.yml` 文件中的构建命令：

**当前问题**：使用的是 `pnpm build`，应该使用 `pnpm export`

**修改方法**：

将这行：
```yaml
- name: 构建项目
  run: pnpm build
```

改为：
```yaml
- name: 构建项目
  run: pnpm export
```

---

#### 步骤 2：正确配置 GitHub Pages 设置

1. **打开你的 GitHub 仓库**
   - 访问：https://github.com/czj527/portfolio

2. **进入 Pages 设置**
   - 点击仓库顶部的 **Settings** 标签
   - 在左侧菜单中找到 **Pages**
   - 点击进入

3. **配置 Build and deployment**
   - 在 **Build and deployment** 部分
   - **Source** 选择：**GitHub Actions**（不是 "Deploy from a branch"）

   **⚠️ 重要**：必须选择 "GitHub Actions"，不要选择其他选项！

4. **保存设置**
   - 配置完成后会自动保存

5. **检查部署状态**
   - 点击 **Actions** 标签
   - 查看最新的 workflow 运行状态
   - 等待构建完成（通常 1-2 分钟）

6. **访问网站**
   - 部署成功后访问：https://czj527.github.io/portfolio/
   - 现在应该能看到你的网站了！

---

### 方法二：使用 gh-pages 分支（备选方案）

如果你不想使用 GitHub Actions，可以使用传统的 gh-pages 分支方式。

#### 步骤 1：安装 gh-pages 工具（在你的本地）

```powershell
pnpm add -D gh-pages
```

#### 步骤 2：本地构建

```powershell
# 清理旧的构建产物
Remove-Item -Recurse -Force .next, out -ErrorAction SilentlyContinue

# 构建静态网站
pnpm export
```

#### 步骤 3：部署到 gh-pages 分支

```powershell
# 使用 gh-pages 部署
npx gh-pages -d out -b gh-pages
```

#### 步骤 4：配置 GitHub Pages

1. 访问仓库的 Settings → Pages
2. **Source** 选择：**Deploy from a branch**
3. **Branch** 选择：**gh-pages**
4. **Folder** 选择：**/(root)**
5. 点击 **Save**

---

### 方法三：使用 main 分支的 out 文件夹（最简单）

这是最简单的方法，但需要修改 GitHub Pages 的设置。

#### 步骤 1：确保代码已推送到 GitHub

```powershell
git add .
git commit -m "Fix GitHub Pages deployment"
git push origin main
```

#### 步骤 2：配置 GitHub Pages

1. 访问 https://github.com/czj527/portfolio/settings/pages
2. **Source** 选择：**Deploy from a branch**
3. **Branch** 选择：**main**
4. **Folder** 选择：**out**（不是 /(root)）
5. 点击 **Save**

**⚠️ 注意**：这个方法需要确保你的 `out` 文件夹已经提交到 Git 仓库中。

---

## 🔍 如何确认问题已解决？

### 检查 GitHub Actions 是否运行成功

1. 访问：https://github.com/czj527/portfolio/actions
2. 查看最新的 workflow 运行状态
3. 应该看到绿色 ✅ 的 "Pass" 状态

### 检查 GitHub Pages 部署状态

1. 访问：https://github.com/czj527/portfolio/deployments
2. 查看最新的部署记录
3. 应该看到成功的部署记录

### 访问网站验证

访问 https://czj527.github.io/portfolio/
- ✅ 正确：看到你的个人网站
- ❌ 错误：仍然显示 README.md

---

## 🆘 如果仍然显示 README.md

### 1. 清除浏览器缓存

有时候浏览器会缓存旧的页面：

- **Chrome/Edge**: Ctrl + Shift + Delete → 清除缓存
- **Firefox**: Ctrl + Shift + Delete → 清除缓存
- 或者使用隐私模式（Ctrl + Shift + N）访问

### 2. 检查 Pages 设置

确保设置完全正确：

**正确的配置（方法一 - 推荐）**：
- Source: **GitHub Actions**

**正确的配置（方法二）**：
- Source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/(root)**

**正确的配置（方法三）**：
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **out**

### 3. 检查构建产物

确认 `out` 文件夹中包含 `index.html`：

```powershell
# 检查 out 文件夹内容
Get-ChildItem out

# 应该能看到 index.html 和其他文件
```

### 4. 重新触发部署

强制触发 GitHub Actions 重新部署：

1. 访问：https://github.com/czj527/portfolio/actions
2. 点击左侧的 "Deploy to GitHub Pages"
3. 点击右侧的 "Run workflow" 按钮
4. 点击绿色的 "Run workflow" 确认
5. 等待构建完成

---

## 📊 对比三种方法

| 方法 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **方法一：GitHub Actions** | ✅ 自动化<br>✅ 每次推送自动部署<br>✅ 最稳定 | 需要配置环境变量 | ⭐⭐⭐⭐⭐ |
| **方法二：gh-pages 分支** | ✅ 传统方法<br>✅ 不需要 GitHub Actions | ❌ 需要手动部署<br>❌ 需要安装工具 | ⭐⭐⭐ |
| **方法三：main 分支 out** | ✅ 最简单<br>✅ 不需要额外工具 | ❌ out 文件夹会很大<br>❌ 增加 main 分支大小 | ⭐⭐ |

---

## 🎯 推荐操作步骤（最终版）

**我强烈推荐使用方法一（GitHub Actions）**，因为：

1. ✅ 每次推送代码会自动部署
2. ✅ 不需要在本地安装额外工具
3. ✅ 最稳定可靠
4. ✅ 已经配置好了，只需要修改 Pages 设置

**具体步骤**：

1. **修改 `.github/workflows/deploy.yml`**
   - 将 `pnpm build` 改为 `pnpm export`
   - 提交并推送代码

2. **配置 GitHub Pages**
   - Settings → Pages
   - Source 选择 **GitHub Actions**
   - 保存

3. **等待部署**
   - 访问 Actions 标签查看构建状态
   - 等待完成（1-2 分钟）

4. **访问网站**
   - https://czj527.github.io/portfolio/
   - 应该能看到你的网站了！

---

## 📞 需要帮助？

如果按照以上步骤仍然无法解决：

1. **检查 GitHub Actions 日志**
   - https://github.com/czj527/portfolio/actions
   - 查看是否有错误信息

2. **检查 Pages 设置截图**
   - 截图你的 Pages 设置页面
   - 确认 Source、Branch、Folder 是否正确

3. **清除 DNS 缓存**
   ```powershell
   ipconfig /flushdns
   ```

---

**现在就按照推荐步骤操作吧！🚀**
