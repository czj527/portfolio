# GitHub Pages 部署指南

本指南将帮助你将 Next.js 项目部署到 GitHub Pages，并实现所有功能（包括 Supabase 数据库集成）。

---

## 📋 目录

- [前置准备](#前置准备)
- [项目配置](#项目配置)
- [GitHub 仓库设置](#github-仓库设置)
- [GitHub Pages 配置](#github-pages-配置)
- [环境变量配置](#环境变量配置)
- [自动部署配置](#自动部署配置)
- [验证部署](#验证部署)
- [常见问题](#常见问题)

---

## 🚀 前置准备

### 1. 确认你已拥有

- ✅ GitHub 账号
- ✅ Supabase 项目（已创建数据库表）
- ✅ Node.js 环境（本地开发用）
- ✅ Git 安装在本地

### 2. 获取 Supabase 凭据

登录 [Supabase Dashboard](https://supabase.com/dashboard)，获取以下信息：

```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**：这些信息将在后面配置到 GitHub Pages 环境变量中。

---

## ⚙️ 项目配置

### 1. 修改 `next.config.mjs`

由于 GitHub Pages 是静态托管，我们需要配置 Next.js 为静态导出模式。

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // GitHub Pages 不支持图片优化
  },
  // 如果你的网站部署在子路径（如 https://username.github.io/repo-name/）
  // 取消下面注释并修改为你的仓库名
  // basePath: '/repo-name',
  // assetPrefix: '/repo-name',
};

export default nextConfig;
```

### 2. 创建 `.nojekyll` 文件

GitHub Pages 默认使用 Jekyll，需要创建此文件禁用。

```bash
touch public/.nojekyll
```

### 3. 更新 `package.json`

确保 `package.json` 包含以下脚本：

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "framer-motion": "^11.x.x",
    "lucide-react": "^0.x.x",
    "next": "16.x.x",
    "react": "^19.x.x",
    "react-dom": "^19.x.x"
  },
  "devDependencies": {
    "@types/node": "^20.x.x",
    "@types/react": "^19.x.x",
    "@types/react-dom": "^19.x.x",
    "typescript": "^5.x.x",
    "tailwindcss": "^4.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x"
  }
}
```

### 4. 配置静态路由（Next.js 16 必需）

由于 Next.js 16 在静态导出模式下要求所有路由必须显式配置为静态，需要修改 `src/app/robots.ts` 文件：

```typescript
import { MetadataRoute } from 'next';

// 静态导出配置（必需）
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/'],
    },
  };
}
```

如果还有其他动态生成的路由文件（如 `sitemap.ts`），也需要添加相同的配置。

**注意**：项目已经包含此配置，无需手动修改。

---

## 📦 GitHub 仓库设置

### 1. 创建 GitHub 仓库

1. 访问 [GitHub New Repository](https://github.com/new)
2. 填写仓库信息：
   - **Repository name**: `portfolio`（或你喜欢的名字）
   - **Description**: `我的个人网站`
   - **Public** ✅（必须公开才能使用 GitHub Pages）
3. 点击 **Create repository**

### 2. 推送代码到 GitHub

```bash
# 初始化 Git（如果还没有）
cd /workspace/projects
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/portfolio.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 GitHub Pages 配置

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - **Build and deployment**: 选择 **GitHub Actions**
   - （不要选择 Deploy from a branch，因为需要配置环境变量）
5. 保存设置

---

## 🔐 环境变量配置

### 方法一：通过 GitHub Settings 配置（推荐）

1. 进入仓库的 **Settings**
2. 左侧菜单点击 **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下环境变量：

| Name | Secret | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | 你的 Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | 你的 Supabase Anon Key |

**注意**：
- 环境变量必须以 `NEXT_PUBLIC_` 开头才能在客户端访问
- 可以从 Supabase Dashboard 的 **Project Settings** → **API** 获取

---

## 🤖 自动部署配置（GitHub Actions）

创建 GitHub Actions 工作流文件，实现自动构建和部署。

### 1. 创建 `.github/workflows/deploy.yml`

```bash
mkdir -p .github/workflows
```

### 2. 编辑 `deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]  # 当推送到 main 分支时触发
  workflow_dispatch:  # 允许手动触发

# 设置 GITHUB_TOKEN 的权限
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许一个部署进行
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 仓库
        uses: actions/checkout@v4

      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'  # 或你使用的 Node.js 版本
          cache: 'pnpm'  # 使用 pnpm 缓存

      - name: 安装 pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: 安装依赖
        run: pnpm install --frozen-lockfile

      - name: 构建项目
        run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: 上传构建产物
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out  # Next.js 静态导出的默认输出目录

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. 提交并推送

```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 4. 查看部署进度

1. 进入仓库的 **Actions** 标签
2. 点击最新的 workflow 运行记录
3. 等待构建完成（通常 2-5 分钟）
4. 成功后会显示绿色的 ✅

---

## ✅ 验证部署

### 1. 访问网站

部署成功后，你的网站将可通过以下地址访问：

```
https://你的用户名.github.io/portfolio/
```

例如：`https://czj527.github.io/portfolio/`

### 2. 检查功能

逐一测试以下功能：

- ✅ 首页是否正常加载
- ✅ 导航菜单是否工作
- ✅ 项目列表是否从 Supabase 加载
- ✅ 博客列表是否正常显示
- ✅ 留言板是否能添加和显示留言
- ✅ 移动端是否适配良好

### 3. 检查浏览器控制台

打开浏览器开发者工具（F12），检查：
- 是否有 404 错误
- 是否有 Supabase 连接错误
- 是否有图片加载失败

---

## 🔧 常见问题

### Q1: 部署后 Supabase 连接失败？

**原因**：环境变量未正确配置

**解决**：
1. 确认在 GitHub Settings → Secrets 中添加了环境变量
2. 环境变量名称必须以 `NEXT_PUBLIC_` 开头
3. 检查 Supabase Dashboard 中的 API 凭据是否正确

### Q2: 图片无法显示？

**原因**：GitHub Pages 不支持 Next.js 图片优化

**解决**：
1. 确认 `next.config.mjs` 中已设置 `images: { unoptimized: true }`
2. 检查图片路径是否正确（应放在 `public/` 目录）
3. 图片文件名不要使用特殊字符

### Q3: 点击链接后 404？

**原因**：路径配置问题

**解决**：
1. 如果部署到子路径，在 `next.config.mjs` 中设置 `basePath`
2. 使用 Next.js 的 `<Link>` 组件而非 `<a>` 标签
3. 确保所有链接以 `/` 开头（绝对路径）

### Q4: 更新代码后没有自动部署？

**解决**：
1. 确认推送到了正确的分支（main）
2. 检查 Actions 页面是否有错误信息
3. 手动触发部署：Actions → 选择 workflow → Run workflow

### Q5: 留言板功能不工作？

**原因**：Supabase RLS（行级安全策略）未配置

**解决**：
```sql
-- 在 Supabase SQL Editor 中执行
-- 允许所有人读取留言
CREATE POLICY "Allow public read" ON guestbook_messages
FOR SELECT TO public USING (true);

-- 允许所有人添加留言
CREATE POLICY "Allow public insert" ON guestbook_messages
FOR INSERT TO public WITH CHECK (true);

-- 允许所有人更新留言（如点赞）
CREATE POLICY "Allow public update" ON guestbook_messages
FOR UPDATE TO public USING (true);
```

### Q6: 管理页面密码不生效？

**原因**：环境变量在生产环境中不可用（客户端硬编码的密码）

**当前方案**：
- 密码 `admin123` 直接硬编码在前端代码中
- **注意**：这不是安全的做法，仅用于演示

**建议改进**：
1. 使用 Supabase Auth 实现真正的用户认证
2. 或将管理功能移到单独的后端服务

### Q7: 部署后页面空白？

**原因**：JavaScript 错误

**解决**：
1. 检查浏览器控制台的具体错误
2. 确认所有依赖都正确安装
3. 检查是否有使用 `window` 对象未做 `use client` 标记

### Q8: 运行 `pnpm export` 时报错 "export const dynamic = 'force-static' not configured"？

**原因**：Next.js 16 在静态导出模式下要求所有路由必须显式配置为静态

**错误信息示例**：
```
Error: export const dynamic = "force-static"/export const revalidate not configured on route "/robots.txt" with "output: export"
```

**解决**：
1. 找到报错的路由文件（如 `src/app/robots.ts`、`src/app/sitemap.ts` 等）
2. 在文件顶部添加以下配置：

```typescript
export const dynamic = 'force-static';
```

**示例 - robots.ts**：
```typescript
import { MetadataRoute } from 'next';

// 静态导出配置（必需）
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/'],
    },
  };
}
```

**注意**：项目已经包含此配置，无需手动修改。如果遇到其他类似错误，使用相同的修复方法。

### Q9: 运行 `pnpm export` 时报错 "supabaseUrl is required"？

**原因**：Supabase 客户端在模块顶层创建，静态导出时环境变量未加载

**错误信息示例**：
```
Error: supabaseUrl is required.
Error occurred prerendering page "/blog/manage".
```

**解决**：将 Supabase 客户端的创建移到组件内部，使用 `useMemo`：

```typescript
// ❌ 错误做法（模块顶层创建）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Component() {
  // ...
}
```

```typescript
// ✅ 正确做法（组件内部创建）
import { useMemo } from 'react';

export default function Component() {
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  // ...
}
```

**注意**：项目已经修复此问题，以下文件已更新：
- `src/app/blog/manage/page.tsx`
- `src/app/projects/manage/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/guestbook/page.tsx`

详细说明请查看 [STATIC_EXPORT_FIX.md](./STATIC_EXPORT_FIX.md) 文档。

---

## 📝 更新网站内容

部署后，更新网站内容非常简单：

### 1. 修改代码

```bash
# 拉取最新代码
git pull origin main

# 进行修改...

# 提交更改
git add .
git commit -m "Update content"
git push origin main
```

### 2. 自动部署

GitHub Actions 会自动触发构建和部署，2-5 分钟后即可看到更新。

---

## 🎯 高级配置

### 1. 自定义域名

1. 在 GitHub Pages 设置中，点击 **Add a domain**
2. 输入你的域名（如 `www.yourdomain.com`）
3. 在域名 DNS 设置中添加 GitHub 提供的记录：
   - A 记录：`185.199.108.153`
   - A 记录：`185.199.109.153`
   - A 记录：`185.199.110.153`
   - A 记录：`185.199.111.153`
   - 或 CNAME 记录：`你的用户名.github.io`

### 2. 启用 HTTPS

在自定义域名设置中，勾选 **Enforce HTTPS**（通常需要等待几分钟到几小时）

### 3. 配置 404 页面

创建 `pages/404.js` 或 `app/not-found.tsx`：

```typescript
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">页面未找到</p>
      <a href="/" className="mt-4 text-primary">返回首页</a>
    </div>
  );
}
```

---

## 📊 性能监控

### 1. Google Analytics

1. 注册 [Google Analytics](https://analytics.google.com/)
2. 获取跟踪 ID（如 `G-XXXXXXXXXX`）
3. 添加到 `layout.tsx`：

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
```

### 2. Lighthouse 测试

使用 Chrome DevTools 的 Lighthouse 工具测试性能：
- Performance
- Accessibility
- Best Practices
- SEO

---

## 🎉 总结

恭喜！按照以上步骤，你的个人网站已经成功部署到 GitHub Pages 了！

**关键要点**：
- ✅ 使用 `output: 'export'` 配置静态导出
- ✅ 配置 GitHub Actions 自动部署
- ✅ 在 GitHub Secrets 中配置环境变量
- ✅ Supabase 数据通过客户端直接访问
- ✅ 推送代码自动触发部署

**下一步**：
- 定期更新内容
- 监控网站性能
- 根据反馈持续优化
- 考虑添加更多功能

如有问题，欢迎查看 [GitHub Pages 文档](https://docs.github.com/en/pages) 或 [Next.js 部署指南](https://nextjs.org/docs/deployment)。

---

**祝你部署顺利！🚀**
