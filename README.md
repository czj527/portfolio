# 长岛冰茶的个人博客

基于 Next.js 16 构建的个人博客网站。项目展示、博客文章、日程管理、访客问答，一个空间承载全部。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **语言**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS v4 (oklch)
- **动画**: Framer Motion
- **数据库**: Supabase + Prisma (SQLite)
- **部署**: Vercel

## 页面

| 路由 | 说明 |
|------|------|
| `/` | 首页（Hero + 日程 + 问答） |
| `/blog` | 博客列表 |
| `/projects` | 项目展示（活跃项目优先 + 展开更多） |
| `/roadmap` | 项目规划（进度追踪） |
| `/tasks` | 任务看板 |
| `/schedule` | 周日程视图 |
| `/about` | 关于我 |
| `/archive` | 文章归档 |
| `/friends` | 友情链接 |
| `/guestbook` | 留言板 |
| `/tags` | 标签云 |
| `/admin` | 管理后台 |

## 开发者文档

- [DESIGN.md](./DESIGN.md) — 设计体系（颜色、排版、动画、组件风格）
- [AGENT.md](./AGENT.md) — AI Agent 开发指南（代码结构、API、约定）

## 本地开发

```bash
pnpm install
pnpm dev
```

## 相关链接

- 网站：https://czj527.xyz
- GitHub：https://github.com/czj527
