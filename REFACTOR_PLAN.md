# 项目重构计划

> **目标**：保留当前 Next.js 项目的前端样式风格（shadcn/ui + Framer Motion 动画），按照 blog-site 的功能进行功能重构。

---

## 〇、技术栈决策（已确认）

| 决策项 | 结论 |
|--------|------|
| 框架 | ✅ **保持 Next.js 16 + React 19**，不更换为 Nuxt |
| 动画 | ✅ **Framer Motion** — 支持布局动画、手势、滚动触发、共享布局动画、弹簧物理、路径动画等高级能力 |
| UI 库 | ✅ **shadcn/ui** (Radix UI 基础) — 50+ 高质量组件 |
| AI/Agent | ✅ **后期接入** Vercel AI SDK (`ai` + `@ai-sdk/openai`)，支持流式对话、工具调用、Agent 编排 |
| 数据库 | ✅ **Supabase** PostgreSQL |
| 部署 | ⚠️ 当前：GitHub Pages 静态导出；后期 AI 接入：考虑改为 `output: 'standalone'` + Vercel/服务器 |
| 预览 | ✅ 开发服务器 `http://localhost:3000/portfolio`，热更新实时预览 |

---

## 一、两个项目对比总览

| 维度 | 当前项目 (portfolio) | blog-site (Nuxt) | 重构方向 |
|------|---------------------|-------------------|----------|
| 框架 | Next.js 16 + React 19 | Nuxt 3 + Vue 3 | **保留** Next.js |
| UI 库 | shadcn/ui + Radix UI | Tailwind CSS (自定义变量) | **保留** shadcn/ui |
| 动画 | Framer Motion | 自定义 CSS 动画 | **保留** Framer Motion |
| 数据库 | Supabase (PostgreSQL) | SQLite + Prisma | **保留** Supabase |
| 密码验证 | 前端硬编码 `admin123` | DB `siteConfig` 表 + API | **改为** DB 存储 |
| 富文本 | 无 | Tiptap Editor | **新增** Tiptap |

---

## 二、功能差异清单

### 🔴 当前项目缺失（blog-site 有，需要新增）

| 序号 | 功能 | blog-site 实现 | 重构建议 |
|------|------|---------------|----------|
| 1 | **博客详情页** | `/blog/[slug]` 文章正文 + 评论 + 点赞 + 分享 | 新增路由 `src/app/blog/[slug]/page.tsx` |
| 2 | **评论系统** | `CommentForm` 组件 + `/api/comments` | 新增表 `comments` + API Route |
| 3 | **文章点赞** | `/api/likes` 按IP去重 | 新增表 `likes` + API Route |
| 4 | **分类/标签体系** | Category + Tag 多对多 | 新增表 `categories`、`tags`、`tag_on_post` |
| 5 | **文章分类筛选** | 博客列表按 category/tag 过滤 | 增强现有博客列表 |
| 6 | **文章搜索** | 标题+正文模糊搜索 | 增强博客列表 |
| 7 | **文章置顶** | `pinned` 字段 | blogs 表加字段 |
| 8 | **草稿/发布状态** | `published` 字段 | blogs 表加字段 |
| 9 | **归档页** | 按年/月分组时间线 | 新增路由 `src/app/archive/page.tsx` |
| 10 | **标签云页** | 标签大小按文章数动态变化 | 新增路由 `src/app/tags/page.tsx` |
| 11 | **友情链接** | `FriendLink` 模型 + `/friends` 页 | 新增表 + 新路由 |
| 12 | **管理后台仪表盘** | 统计卡片 + 快捷操作 + 最近文章 | 新增路由 `src/app/admin/page.tsx` |
| 13 | **写文章页** | Tiptap 富文本编辑器 | 增强 `/blog/manage` 或新增 `/blog/new` |
| 14 | **文章编辑（弹窗模式）** | 文章详情页内编辑模态框 | 增强博客详情页 |
| 15 | **密码管理（DB存储）** | `siteConfig` 表 + `/api/config` | 修改密码验证方式 |
| 16 | **RSS 订阅** | `/rss.xml` | 新增 Route Handler |
| 17 | **Sitemap** | `/sitemap.xml` | 新增 Route Handler |
| 18 | **深色模式切换** | `dark` class toggle | 新增 ThemeToggle 组件 |
| 19 | **阅读时间** | 按字数估算 | 文章详情页新增 |
| 20 | **文章分享** | 微博/Twitter/复制链接 | 文章详情页新增 |
| 21 | **相关文章推荐** | 同分类/同标签推荐 | 文章详情页新增 |

### 🟡 当前项目有，但需要改造

| 序号 | 功能 | 当前状态 | 改造方向 |
|------|------|----------|----------|
| 22 | 博客管理页 | `/blog/manage` 简单CRUD | 集成 Tiptap 编辑器 + 分类/标签选择 |
| 23 | 项目管理页 | `/projects/manage` 简单CRUD | 增加排序、图片URL、techStack |
| 24 | 留言板 | `/guestbook` 独立版块 | 改为评论系统，与文章关联 |
| 25 | 密码验证 | 前端 `=== 'admin123'` | 改为调用 API 验证（DB存储密码） |

### 🟢 保留不变

| 功能 | 说明 |
|------|------|
| 首页 Hero + 特性 + 导航卡片 | 保留当前 Framer Motion 动画风格 |
| 导航栏 | 保留当前 shadcn/ui 风格，增加更多链接 |
| 关于页面 | 保留当前布局，增加技能栈展示 |
| shadcn/ui 组件库 | 全部保留 |
| Framer Motion 动画 | 全部保留 |
| GitHub Pages 部署 | 保留 CI/CD |
| Tailwind CSS v4 | 保留 |

---

## 三、数据库改造方案（Supabase）

### 3.1 新增表

```sql
-- 分类表
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL UNIQUE,
  slug VARCHAR(256) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 标签表
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL UNIQUE,
  slug VARCHAR(256) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 文章-标签关联表
CREATE TABLE tag_on_post (
  post_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 评论表
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  author VARCHAR(128) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 点赞表（IP去重）
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45) NOT NULL,
  post_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ip, post_id)
);

-- 友情链接表
CREATE TABLE friend_links (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  url VARCHAR(1024) NOT NULL,
  logo VARCHAR(1024),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 站点配置表
CREATE TABLE site_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(256) NOT NULL UNIQUE,
  value TEXT NOT NULL
);
```

### 3.2 修改现有表

```sql
-- 修改 blogs 表（增加字段）
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS slug VARCHAR(512) UNIQUE;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS cover_image VARCHAR(1024);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0;
-- name → title（如果重构时用新表，可以直接替换）

-- 修改 projects 表（增加字段）
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack VARCHAR(1024);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(1024);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url VARCHAR(1024);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_url VARCHAR(1024);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
```

### 3.3 初始化数据

```sql
-- 插入默认管理密码
INSERT INTO site_config (key, value) VALUES ('admin_password', 'admin123');

-- 插入默认分类
INSERT INTO categories (name, slug) VALUES ('技术', 'tech');
INSERT INTO categories (name, slug) VALUES ('生活', 'life');
```

---

## 四、页面路由重构

```
src/app/
├── page.tsx                     # ✅ 保留 + 增加最新文章、项目预览区
├── layout.tsx                   # ✅ 保留 + ThemeProvider
├── globals.css                  # ✅ 保留
├── about/
│   └── page.tsx                 # ✅ 保留 + 增加技能栈
├── blog/
│   ├── page.tsx                 # 🔄 重构：增加搜索、分类/标签筛选、管理员编辑/删除
│   ├── [slug]/
│   │   └── page.tsx             # 🆕 新增：文章详情页（正文+评论+点赞+分享+相关文章）
│   ├── new/
│   │   └── page.tsx             # 🆕 新增：写文章（Tiptap 编辑器）
│   └── manage/
│       └── page.tsx             # 🔄 改造：增强搜索+统计
├── archive/
│   └── page.tsx                 # 🆕 新增：文章归档（按年/月分组时间线）
├── tags/
│   └── page.tsx                 # 🆕 新增：标签云
├── projects/
│   ├── page.tsx                 # 🔄 改造：增加技术栈、GitHub/Demo链接
│   └── manage/
│       └── page.tsx             # 🔄 改造：增加更多字段
├── friends/
│   └── page.tsx                 # 🆕 新增：友情链接
├── admin/
│   └── page.tsx                 # 🆕 新增：管理后台仪表盘
├── guestbook/                   # ❌ 删除（改为文章评论系统）
│   ├── page.tsx
│   └── new/page.tsx
├── api/                         # 🆕 新增：API Routes（Supabase 服务端操作）
│   ├── posts/route.ts
│   ├── posts/[slug]/route.ts
│   ├── comments/route.ts
│   ├── likes/route.ts
│   ├── categories/route.ts
│   ├── tags/route.ts
│   ├── projects/route.ts
│   ├── friend-links/route.ts
│   ├── config/route.ts
│   └── seed/route.ts            # 🆕 初始化种子数据
├── rss.xml/
│   └── route.ts                 # 🆕 RSS 订阅
└── sitemap.xml/
    └── route.ts                 # 🆕 Sitemap
```

---

## 五、组件清单

| 组件 | 状态 | 说明 |
|------|------|------|
| `Navigation.tsx` | 🔄 | 增加导航项：归档、标签、友链 |
| `AppFooter.tsx` | 🆕 | 页脚组件 |
| `CommentForm.tsx` | 🆕 | 评论表单（昵称+内容） |
| `CommentList.tsx` | 🆕 | 评论列表（含管理员删除） |
| `LikeButton.tsx` | 🆕 | 点赞按钮（toggle + 计数） |
| `TiptapEditor.tsx` | 🆕 | 富文本编辑器 |
| `ThemeToggle.tsx` | 🆕 | 深色/浅色模式切换 |
| `ShareButtons.tsx` | 🆕 | 文章分享按钮 |
| `RelatedPosts.tsx` | 🆕 | 相关文章推荐 |
| `SearchBar.tsx` | 🆕 | 搜索栏组件 |
| `CategoryTabs.tsx` | 🆕 | 分类筛选标签 |
| `Pagination.tsx` | 🔄 | 使用现有 shadcn/ui Pagination |
| `AdminGuard.tsx` | 🆕 | 管理员权限守卫 |
| `PasswordModal.tsx` | 🆕 | 管理密码验证弹窗（统一样式） |

---

## 六、实施步骤建议

### 阶段一：数据库改造（基础）
1. 在 Supabase 中执行 SQL，创建新表和修改已有表
2. 初始化种子数据（默认密码、默认分类）
3. 更新 `src/storage/database/` 下的客户端和数据操作函数

### 阶段二：API 路由层
4. 创建 `src/app/api/` 下的所有 API Routes
5. 实现密码验证逻辑（DB 查询替代硬编码）

### 阶段三：核心页面重构
6. 重构博客列表页（分类/标签筛选 + 搜索 + 管理员操作）
7. 新增博客详情页（正文 + 评论 + 点赞 + 分享 + 相关文章）
8. 新增写文章页（Tiptap 富文本编辑器）
9. 将留言板功能迁移为文章评论系统

### 阶段四：扩展页面
10. 新增归档页
11. 新增标签云页
12. 新增友情链接页
13. 新增管理后台仪表盘

### 阶段五：增强功能
14. RSS / Sitemap
15. 深色模式切换
16. 组件抽取与优化

### 阶段六：清理
17. 删除 `/guestbook` 相关页面
18. 删除旧的硬编码密码逻辑
19. 删除不再使用的组件

---

## 七、风格保留说明

重构中将**完整保留**以下风格要素：

1. **Tailwind CSS v4** + `oklch()` 颜色变量体系
2. **shadcn/ui** 组件风格（Button, Card, Dialog, Input, Badge 等）
3. **Framer Motion** 动画：
   - `containerVariants` + `itemVariants` 交错动画
   - `whileHover` / `whileTap` 微交互
   - `whileInView` 滚动触发动画
   - 头像呼吸光环效果
4. **渐变动画文字**（`bg-gradient-to-r from-primary to-accent`）
5. **页面布局**：`pt-24 pb-20 px-4` + `max-w-* mx-auto`
6. **卡片交互**：`.card-hover`、`shadow-sm → hover:shadow-lg`
7. **自定义 CSS 动画**：fadeInUp、float、slideInLeft

---

## 八、重构原则

1. **风格完全保留** — 所有新页面都使用当前项目的 shadcn/ui + Framer Motion 动画风格
2. **数据库平滑过渡** — 保留 Supabase，新增表不删除旧表，旧数据可迁移
3. **渐进式重构** — 一个功能一个功能地添加，确保每一步都可工作
4. **GitHub Pages 兼容** — 保持静态导出模式，API 端依赖 Supabase 客户端直连
5. **安全提升** — 密码存入数据库，不再前端硬编码
