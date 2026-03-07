# 个人网站

一个现代化的个人网站，用于展示个人项目、博客和简介。采用简约设计风格，配合丰富的动画效果，提供流畅的用户体验。

## ✨ 特性

- 🎨 **现代简约设计** - 浅色系配色，清晰明了的视觉层次
- 🚀 **流畅动画** - 使用 Framer Motion 实现丰富的页面动画和交互效果
- 📱 **响应式布局** - 完美适配桌面端、平板和移动设备
- ⚡ **高性能** - 基于 Next.js 16 和 React 19，提供极致性能
- 🎯 **SEO 友好** - 预渲染静态页面，优化搜索引擎收录
- 🔧 **易于维护** - 清晰的项目结构，完善的代码注释
- 💬 **多人留言** - 基于 Supabase 的实时留言系统，支持多人交互
- 🏷️ **博客分类** - 支持标签分类和分页功能
- 🔗 **URL 友好** - 博客分类和分页通过 URL 参数实现，便于分享

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: shadcn/ui
- **动画**: Framer Motion
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **图标**: Lucide React
- **数据库**: Supabase (PostgreSQL)

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 目录
│   ├── layout.tsx         # 根布局（包含导航栏）
│   ├── page.tsx           # 首页
│   ├── projects/          # 项目展示页面
│   ├── blog/              # 博客页面
│   └── about/             # 关于页面
├── components/            # React 组件
│   └── Navigation.tsx     # 导航组件
├── lib/                   # 工具函数
└── storage/
    └── database/          # 数据库相关
        ├── shared/        # Schema 定义
        └── supabase-client.ts  # Supabase 客户端
```

## 💡 功能说明

### 留言系统

网站集成了基于 Supabase 的多人留言功能：

**特性**：
- ✅ 真正的多人留言系统
- ✅ 数据持久化存储在云端
- ✅ 所有访客都能看到彼此的留言
- ✅ 实时更新（自动刷新）
- ✅ 支持删除留言
- ✅ 表单验证（邮箱格式、内容长度）
- ✅ 精美的加载动画

**技术实现**：
- 使用 Supabase PostgreSQL 数据库
- 客户端直接调用 Supabase SDK
- 无需后端 API，纯前端实现
- 支持部署到 GitHub Pages

**数据库表结构**：
```sql
guestbook_messages (
  id UUID PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### 博客功能

博客页面支持标签分类和分页：

**特性**：
- ✅ 7 个分类标签
- ✅ 点击标签自动过滤文章
- ✅ URL 参数管理（如 `/blog?category=前端开发&page=2`）
- ✅ URL 可分享和收藏
- ✅ 自动计算总页数
- ✅ 显示当前页和总页数
- ✅ 显示文章总数

**技术实现**：
- 使用 Next.js URL 参数（方案二）
- 客户端 `useSearchParams` 和 `useRouter`
- SEO 友好的 URL 结构
- 平滑过渡动画

## 🚀 快速开始

### 配置 Supabase（留言功能必需）

1. **创建 Supabase 项目**

   - 访问 [https://supabase.com](https://supabase.com)
   - 注册账号并创建新项目
   - 等待项目初始化完成（约 2 分钟）

2. **获取 API 密钥**

   - 进入项目仪表板
   - 点击左侧菜单 **Settings** > **API**
   - 复制以下信息：
     - `Project URL`：例如 `https://your-project.supabase.co`
     - `anon public`：例如 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **创建数据库表**

   - 在 Supabase 仪表板，点击左侧菜单 **SQL Editor**
   - 点击 **New query**
   - 粘贴以下 SQL 并执行：

   ```sql
   -- 创建留言表
   CREATE TABLE IF NOT EXISTS guestbook_messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(128) NOT NULL,
     email VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 启用行级安全性
   ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;

   -- 创建策略：允许所有人读取
   CREATE POLICY "Allow public read access"
     ON guestbook_messages
     FOR SELECT
     TO public
     USING (true);

   -- 创建策略：允许所有人插入
   CREATE POLICY "Allow public insert"
     ON guestbook_messages
     FOR INSERT
     WITH CHECK (true);

   -- 创建策略：允许所有人删除
   CREATE POLICY "Allow public delete"
     ON guestbook_messages
     FOR DELETE
     TO public
     USING (true);
   ```

4. **配置环境变量**

   在项目根目录创建 `.env.local` 文件：

   ```bash
   cp .env.local.example .env.local
   ```

   编辑 `.env.local`，填入你的 Supabase 配置：

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   ⚠️ **注意**：`.env.local` 文件包含敏感信息，**不要**提交到 Git！

5. **验证配置**

   启动开发服务器后，访问 `/guestbook` 页面，如果能看到留言界面且没有配置错误提示，说明配置成功。

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
coze dev
# 或者
pnpm dev
```

访问 [http://localhost:5000](http://localhost:5000) 查看网站。

开发服务器支持热更新，修改代码后页面会自动刷新。

### 构建生产版本

```bash
# 构建静态网站
pnpm export

# 构建产物在 out/ 目录
```

## 📦 部署到 GitHub Pages

### 方法一：手动部署

1. **配置仓库名称**

   在 `next.config.ts` 中，将 `REPO_NAME` 修改为你的 GitHub 仓库名：

   ```typescript
   // next.config.ts
   const REPO_NAME = 'your-repo-name'; // 修改这里
   ```

2. **构建网站**

   ```bash
   pnpm export
   ```

3. **部署到 GitHub Pages**

   ```bash
   # 使用提供的部署脚本
   pnpm deploy
   ```

   这会自动创建 `gh-pages` 分支并将构建产物推送到 GitHub。

4. **启用 GitHub Pages**

   - 进入你的 GitHub 仓库
   - 点击 **Settings** > **Pages**
   - 在 **Source** 下选择 **gh-pages** 分支
   - 点击 **Save**

5. **访问网站**

   部署成功后，访问 `https://yourusername.github.io/your-repo-name/`

### 方法二：使用 GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`：

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

提交代码后，GitHub Actions 会自动构建并部署网站。

## 🎨 自定义配置

### 修改个人信息

编辑以下文件以更新你的个人信息：

1. **修改个人信息** - 编辑 `src/app/about/page.tsx`
2. **更新项目列表** - 编辑 `src/app/projects/page.tsx`
3. **更新博客文章** - 编辑 `src/app/blog/page.tsx`
4. **修改社交媒体链接** - 编辑 `src/components/Navigation.tsx`

### 修改配色方案

在 `src/app/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary: oklch(0.55 0.2 250);       /* 主色调 */
  --secondary: oklch(0.96 0.01 240);    /* 次要色调 */
  --accent: oklch(0.94 0.02 200);       /* 强调色 */
  /* ... 其他颜色变量 */
}
```

### 修改动画效果

在各个页面组件中调整 Framer Motion 的动画参数：

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}  // 调整动画时长
>
  内容
</motion.div>
```

## 📝 可选功能扩展

### 添加新页面

在 `src/app/` 目录下创建新的文件夹和 `page.tsx`：

```bash
src/app/contact/page.tsx  # 创建联系页面
```

访问 `/contact` 即可查看新页面。

### 添加博客文章详情页

创建动态路由：

```bash
src/app/blog/[id]/page.tsx  # 博客文章详情页
```

### 集成评论系统

可以使用以下服务：
- [Giscus](https://giscus.app/) - 基于 GitHub Discussions
- [Disqus](https://disqus.com/)
- [Utterances](https://utteranc.es/)

### 添加数据分析

集成 Google Analytics 或其他分析工具：

```tsx
// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
```

## 🐛 常见问题

### Q: 部署后页面空白？

A: 检查 `next.config.ts` 中的 `basePath` 是否与你的仓库名匹配。

### Q: 图片不显示？

A: 静态导出模式下，图片优化功能已禁用。确保图片放在 `public/` 目录下。

### Q: 动画效果不流畅？

A: 检查浏览器是否支持硬件加速，可以尝试减少动画数量或降低复杂度。

### Q: 如何修改网站标题和描述？

A: 在 `src/app/layout.tsx` 中修改 `metadata` 配置。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- Email: your.email@example.com
- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourusername

---

**Enjoy building your personal website! 🎉**
