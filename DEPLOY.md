# 部署指南

本文档详细介绍如何将个人网站部署到 GitHub Pages。

## 前置要求

- GitHub 账号
- Git 已安装
- Node.js 20+
- pnpm 已安装

## 部署步骤

### 1. 准备 GitHub 仓库

1. 在 GitHub 上创建新仓库，命名为 `portfolio`（或你喜欢的名字）
2. 克隆仓库到本地：

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

3. 将项目文件复制到仓库中（如果使用此模板，可以直接初始化）

### 2. 配置项目

编辑 `next.config.ts`，设置仓库名称：

```typescript
const REPO_NAME = 'portfolio'; // 修改为你的仓库名
```

### 3. 构建项目

```bash
# 安装依赖
pnpm install

# 构建静态网站
pnpm export
```

构建完成后，会在 `out/` 目录生成静态文件。

### 4. 部署到 GitHub Pages

#### 方法一：手动部署（简单）

```bash
# 创建 gh-pages 分支并部署
pnpm deploy
```

这个命令会：
1. 创建或切换到 `gh-pages` 分支
2. 提交 `out/` 目录的内容
3. 推送到远程仓库

#### 方法二：GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        run: corepack enable && corepack prepare pnpm@latest --activate

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm export

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

提交并推送代码：

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

### 5. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签页
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择：
   - **Build and deployment** > **Source**: 选择 **GitHub Actions**
5. 点击 **Save**

如果使用手动部署，选择：
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` 分支，`/ (root)` 目录
- 点击 **Save**

### 6. 访问网站

部署完成后，你的网站将可以通过以下 URL 访问：

```
https://yourusername.github.io/portfolio/
```

## 域名绑定（可选）

### 1. 添加 CNAME 文件

在 `public/` 目录下创建 `CNAME` 文件：

```
yourdomain.com
```

### 2. 配置 DNS

在你的域名提供商处添加 DNS 记录：

```
类型: CNAME
名称: @
值: yourusername.github.io
```

### 3. 在 GitHub 上设置

1. 进入 GitHub 仓库的 **Settings** > **Pages**
2. 在 **Custom domain** 中输入你的域名
3. 点击 **Save**
4. 等待 DNS 传播完成

## 故障排除

### 问题 1: 页面 404

**解决方案:**
- 检查 `next.config.ts` 中的 `basePath` 是否正确
- 确保启用了 `trailingSlash: true`
- 等待几分钟让 GitHub Pages 完成部署

### 问题 2: 样式未加载

**解决方案:**
- 确保构建时没有错误
- 检查浏览器控制台是否有错误信息
- 清除浏览器缓存后重试

### 问题 3: 图片不显示

**解决方案:**
- 静态导出模式下，图片必须放在 `public/` 目录
- 检查图片路径是否正确（不需要 `/public` 前缀）
- 确保图片文件名大小写正确

### 问题 4: GitHub Actions 部署失败

**解决方案:**
- 检查 Actions 日志中的错误信息
- 确保 `pnpm` 版本符合要求（>= 9.0.0）
- 检查 Node.js 版本是否正确（推荐 20+）

## 自动更新

使用 GitHub Actions 后，每次推送到 `main` 分支都会自动触发部署。无需手动操作！

## 性能优化建议

1. **使用 CDN 加速**
   - GitHub Pages 已提供全球 CDN
   - 如需更高性能，可考虑使用 Cloudflare

2. **启用 Gzip 压缩**
   - GitHub Pages 自动启用压缩
   - 无需额外配置

3. **优化图片**
   - 使用 WebP 格式
   - 控制图片大小（建议 < 200KB）
   - 使用适当的尺寸

4. **减少 HTTP 请求**
   - 合并 CSS/JS 文件（Next.js 自动处理）
   - 使用图片雪碧技术（如需要）

## 维护和更新

### 更新内容

修改代码后，推送到 GitHub 即可自动更新：

```bash
git add .
git commit -m "Update content"
git push origin main
```

### 更新依赖

```bash
# 更新依赖
pnpm update

# 测试更新
pnpm dev

# 提交更新
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push origin main
```

## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm export           # 构建静态网站

# 部署
pnpm deploy           # 手动部署到 GitHub Pages

# 代码检查
pnpm lint             # 运行 ESLint
pnpm ts-check         # TypeScript 类型检查
```

## 参考资料

- [Next.js 文档](https://nextjs.org/docs)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

如有问题，请查看 [GitHub Actions 日志](https://github.com/yourusername/portfolio/actions) 或提交 Issue。
