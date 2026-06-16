# 博客开发指南（面向 AI Agent）

> 本文档供 AI Agent（如 Codex、HanaAgent、Claude Code 等）快速了解本项目的代码结构、约定和开发流程。

## 项目概览

- **名称**：长岛冰茶的个人博客
- **域名**：https://czj527.xyz
- **仓库**：https://github.com/czj527/portfolio
- **框架**：Next.js 16 (App Router) + TypeScript + Tailwind CSS v4

## 目录结构

```
src/
├── app/                    # App Router 页面
│   ├── layout.tsx          # 根布局（导航栏 + ThemeProvider）
│   ├── page.tsx            # 首页（Hero + 日程 + 问答）
│   ├── globals.css         # 全局样式 + 设计令牌
│   ├── api/                # API Route Handlers
│   │   ├── supabase/       # [通用] Supabase 数据操作接口
│   │   ├── schedules/      # 日程 CRUD
│   │   ├── tasks/          # 任务 CRUD
│   │   ├── posts/          # 博客文章 CRUD
│   │   ├── drafts/         # 草稿 CRUD
│   │   ├── comments/       # 评论（Prisma）
│   │   ├── likes/          # 点赞（Prisma）
│   │   ├── guestbook/      # 留言板（Prisma）
│   │   ├── categories/     # 分类
│   │   ├── tags/           # 标签
│   │   ├── friend-links/   # 友情链接
│   │   ├── config/         # 站点配置
│   │   ├── auth/           # 管理认证
│   │   └── ai/             # AI 写作辅助
│   ├── about/              # 关于页
│   ├── admin/              # 管理后台
│   ├── archive/            # 文章归档
│   ├── blog/               # 博客列表 + [slug] 详情 + new 编辑
│   ├── friends/            # 友链页
│   ├── guestbook/          # 留言板
│   ├── projects/           # 项目展示页（Prisma 数据）
│   ├── roadmap/            # 项目规划页（Supabase 数据）
│   ├── schedule/           # 日程页
│   ├── tasks/              # 任务页
│   └── tags/               # 标签云
├── components/             # 组件
│   ├── effects/            # 首页视觉组件（Hero/Blog/Project/QnA）
│   ├── schedule/           # 日程视图组件
│   ├── blog/               # 博客相关组件
│   ├── blog-agent/         # 博客智能体组件
│   ├── ui/                 # shadcn/ui 组件库
│   ├── Navigation.tsx      # 导航栏
│   ├── ThemeProvider.tsx    # 主题提供者
│   └── TiptapEditor.tsx    # 富文本编辑器
├── lib/                    # 工具库
│   ├── supabase.ts         # Supabase 客户端
│   ├── prisma.ts           # Prisma 客户端（SQLite）
│   ├── seed-data.ts        # 种子数据（项目/分类/标签）
│   ├── utils.ts            # 工具函数（cn/formatDate 等）
│   ├── auth.ts             # 认证工具
│   └── ai/                 # AI 客户端
├── store/                  # Zustand 状态管理
├── hooks/                  # 自定义 Hooks
└── content/                # 静态内容
```

## 数据层架构

### 两套数据库

| 数据库 | 用途 | 客户端 |
|--------|------|--------|
| **Supabase PostgreSQL** | schedules, tasks, projects, activity_log, posts, drafts | `getSupabaseAdmin()` → service_role key |
| **Prisma SQLite** | 评论, 点赞, 项目展示, 友链, 留言, 配置 | `getPrisma()` |

### Supabase 表结构

```
schedules      → 日程（owner_id, title, date, start_time, duration, type, color, ...）
tasks          → 任务（title, status, priority, due_date, project_id, ...）
projects       → 项目（name, status, progress, current_phase, tech_stack, sort_order, icon, color, ...）
activity_log   → 活动日志（content, type, project_id, created_at, ...）
posts          → 文章（slug, title, markdown, content, excerpt, tags, is_published, ...）
drafts         → 草稿（结构同 posts）
```

### 项目表 status 约束

```sql
CHECK (status IN ('in_progress', 'paused', 'planning', 'completed'))
```

> 注意：`active` 不是有效值，代码中通过客户端映射 `active → in_progress`。

### Prisma 模型（SQLite）

```
Post, Category, Tag, TagOnPost, Comment, Like, Project, FriendLink, GuestbookMessage, SiteConfig
```

## API 约定

### 通用 Supabase 操作接口

```
POST /api/supabase
Body: { table, action, data?, filters? }
```

支持 action：`select` / `insert` / `update` / `delete` / `upsert`

示例：
```json
// 查询
{ "table": "projects", "action": "select", "filters": { "order": { "field": "sort_order" } } }

// 插入
{ "table": "projects", "action": "insert", "data": [{ "name": "xxx", "status": "planning" }] }

// 更新
{ "table": "projects", "action": "update", "data": { "status": "completed" }, "filters": { "eq": { "id": "xxx" } } }

// 删除（需 filters.all: true 或 filters.eq）
{ "table": "tasks", "action": "delete", "filters": { "all": true } }
```

### 其他重要 API

- `DELETE /api/schedules?id=xxx` — 删除日程
- `DELETE /api/tasks?id=xxx` — 删除任务
- `POST /api/tasks` — 创建任务
- `PATCH /api/tasks` — 更新任务状态
- `GET /api/projects` → 返回种子数据（Prisma 无数据时）

## 页面类型

| 页面 | 渲染模式 | 数据源 |
|------|----------|--------|
| 首页 `/` | Client（动态数据） | Supabase schedules + 静态内容 |
| 博客 `/blog` | Server | Supabase posts |
| 博客详情 `/blog/[slug]` | Server | Supabase posts + Prisma comments/likes |
| 项目 `/projects` | Client (fetch) | Prisma → seed fallback |
| 规划 `/roadmap` | Server | Supabase projects/tasks/activity_log |
| 任务 `/tasks` | Server | Supabase tasks |
| 日程 `/schedule` | Client (fetch) | Supabase schedules |
| 归档 `/archive` | Server | Supabase posts |
| 管理 `/admin` | Client | 多种 |

## 导航栏路由

```
首页 → 博客 → 归档 → 项目 → 任务 → 规划 → 留言 → 标签 → 友链 → 关于
```

按钮：管理 `href="/admin"` | GitHub `href="https://github.com/czj527"`

## 样式约定

详见 `DESIGN.md`。关键点：
- tailwind v4 + oklch 色彩空间
- shadcn/ui 组件体系
- Framer Motion 动画（containerVariants + itemVariants 模式）
- 圆角统一 `rounded-md`（10px base）
- 中文优先字体栈

## 开发命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器 (http://localhost:3000)
pnpm build            # 构建
npx prisma generate   # 生成 Prisma 客户端
npx prisma db push    # 同步 Prisma 表结构到 SQLite
```

## 部署

- 推送 `main` 分支 → Vercel 自动部署到 `czj527.xyz`
- 环境变量：`.env.local`（本地）或 Vercel Dashboard（生产）
- 必需变量：`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`

## 本地开发注意事项

1. **Supabase 连接**：本地无法直连 Supabase（代理 TLS 不兼容），数据操作通过 `https://czj527.xyz/api/supabase` 代理
2. **Prisma**：本地使用 SQLite (`file:./dev.db`)，无需额外配置
3. **环境变量**：按需提供 Supabase 凭据

## 新增页面流程

1. 在 `src/app/` 下创建目录 + `page.tsx`
2. 如果是静态内容较多，用 Server Component；若需要交互/动画，用 Client Component
3. 参考 `DESIGN.md` 的布局模式和动画规范
4. 在 `src/components/Navigation.tsx` 中添加导航链接
5. 如果是 Supabase 数据，API 写在 `src/app/api/[name]/route.ts`
