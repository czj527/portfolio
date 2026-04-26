# 🔧 修复 pnpm 找不到问题

## ❌ 错误信息

```
Unable to locate executable file: pnpm.
Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable.
```

## 🔍 问题原因

**GitHub Actions 中 pnpm action-setup 版本兼容性问题**，导致 pnpm 无法正确安装。

## ✅ 已修复

我已经重写了 `.github/workflows/deploy.yml`，使用 **corepack** 方法安装 pnpm。

**核心改变**：

### 修改前（有问题的方法）：
```yaml
- name: 安装 pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8
```

### 修改后（更可靠的方法）：
```yaml
- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: 安装 pnpm (使用 corepack)
  run: corepack enable && corepack prepare pnpm@latest --activate
```

---

## 🚀 现在需要做的（3 步）

### 第 1 步：推送新的 workflow 文件

在你的本地执行：

```powershell
cd C:\Users\czj\Desktop\website\portfolio

# 查看修改
git status

# 添加修改
git add .github/workflows/deploy.yml

# 提交
git commit -m "fix: 使用 corepack 替代 pnpm/action-setup，解决 pnpm 找不到问题"

# 推送
git push origin main
```

### 第 2 步：清理旧的工作流（可选）

如果之前的失败工作流还在运行，可以手动取消：

1. 访问：https://github.com/czj527/portfolio/actions
2. 点击失败的运行记录
3. 点击右上角的 **Cancel run**（如果有）

### 第 3 步：查看新的部署

推送后，GitHub Actions 会自动运行新的 workflow：

1. 访问：https://github.com/czj527/portfolio/actions
2. 等待 1-2 分钟
3. 应该看到绿色的 ✅ 成功状态

---

## 🔍 为什么使用 corepack？

### 什么是 corepack？

**corepack** 是 Node.js 官方提供的包管理器管理工具，自 Node.js 16.9 起内置。

### 为什么更可靠？

| 方法 | 优点 | 缺点 |
|------|------|------|
| **pnpm/action-setup** | 常用方法 | ❌ 版本兼容性问题<br>❌ 有时找不到可执行文件 |
| **corepack** | ✅ Node.js 内置<br>✅ 官方推荐<br>✅ 更可靠 | 需要多一行命令 |

---

## 📋 完整的新 workflow 流程

```
1. Checkout 代码
   ↓
2. 设置 Node.js 20
   ↓
3. 启用 corepack 并安装 pnpm
   (corepack enable && corepack prepare pnpm@latest --activate)
   ↓
4. 获取 pnpm store 路径
   ↓
5. 设置 pnpm cache (加速后续构建)
   ↓
6. 安装依赖
   (pnpm install --frozen-lockfile)
   ↓
7. 构建项目
   (pnpm export)
   ↓
8. 上传构建产物
   ↓
9. 部署到 GitHub Pages
```

---

## 🧪 测试 workflow（本地可选）

如果你想先在本地测试，可以运行：

```powershell
# 清理缓存
Remove-Item -Recurse -Force .next, node_modules, out -ErrorAction SilentlyContinue

# 安装依赖
pnpm install

# 构建
pnpm export
```

如果本地构建成功，GitHub Actions 也应该会成功。

---

## 🆘 如果还是失败

### 检查 1：确认文件已推送

访问：https://github.com/czj527/portfolio/blob/main/.github/workflows/deploy.yml

查看文件内容是否包含：
```yaml
- name: 安装 pnpm (使用 corepack)
  run: corepack enable && corepack prepare pnpm@latest --activate
```

### 检查 2：查看详细错误日志

1. 访问：https://github.com/czj527/portfolio/actions
2. 点击失败的运行记录
3. 展开每个步骤查看错误信息
4. 找到具体的失败点

### 检查 3：确认环境变量

如果构建过程中出现环境变量错误：

1. 访问：https://github.com/czj527/portfolio/settings/secrets/actions
2. 确认已添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 预期结果

推送后，你应该看到：

### ✅ 成功的 workflow

```
✅ Checkout 仓库
✅ 设置 Node.js
✅ 安装 pnpm (使用 corepack)
✅ 获取 pnpm store 目录
✅ 设置 pnpm cache
✅ 安装依赖
✅ 构建项目
✅ 上传构建产物
✅ 部署到 GitHub Pages
```

### 🌐 访问网站

部署成功后访问：https://czj527.github.io/portfolio/

应该能看到你的个人网站了！🎉

---

## 💡 额外提示

### 如果 GitHub Actions 很慢

GitHub Actions 首次运行会较慢（下载依赖、构建），后续运行会使用 cache，会快很多。

### 清理缓存的方法

如果需要强制重新构建：

1. 访问：https://github.com/czj527/portfolio/actions/caches
2. 删除所有缓存
3. 重新触发 workflow

---

**现在就推送代码吧！这次应该会成功！🚀**

推送后访问 https://github.com/czj527/portfolio/actions 查看部署状态。
