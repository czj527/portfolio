export const SEED_CONFIG = {
  admin_password: 'admin123',
  about_me: '热爱编程与技术分享的全栈开发者',
}

export const SEED_CATEGORIES = [
  { id: 1, name: '技术文章', slug: 'tech', _count: { posts: 1 } },
  { id: 2, name: '生活', slug: 'life', _count: { posts: 0 } },
  { id: 3, name: '思考', slug: 'thought', _count: { posts: 0 } },
]

export const SEED_TAGS = [
  { id: 1, name: 'React', slug: 'react', _count: { posts: 1 } },
  { id: 2, name: 'Next.js', slug: 'nextjs', _count: { posts: 1 } },
  { id: 3, name: 'TypeScript', slug: 'typescript', _count: { posts: 1 } },
  { id: 4, name: 'Vue', slug: 'vue', _count: { posts: 0 } },
  { id: 5, name: 'Web', slug: 'web', _count: { posts: 0 } },
]

export const SEED_PROJECTS = [
  {
    id: 1, title: '新叶日报',
    description: 'AI资讯聚合平台，基于 xyai / aiweb 迭代的下一代 AI 资讯服务。每日聚合 AI 领域最新动态，支持智能筛选、分类与个性化推送。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Supabase',
    imageUrl: null, githubUrl: '', demoUrl: null, order: 1,
    createdAt: '2026-06-16T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 2, title: 'opencolorful',
    description: '个人 AI 智能体项目，融合关于私人助理 Agent 的独立思考与理念。类似 OpenHanako 架构，支持多角色、多模型编排与个性化交互。',
    techStack: 'TypeScript, React, AI SDK, Agent Framework',
    imageUrl: null, githubUrl: 'https://github.com/czj527/opencolorful', demoUrl: null, order: 2,
    createdAt: '2026-06-09T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 3, title: 'body',
    description: '为 AI Agent 构建可在网页或桌面活动的虚拟身体。探索 Agent 在数字空间中的具身化交互体验。',
    techStack: 'JavaScript, Web/Desktop Integration',
    imageUrl: null, githubUrl: 'https://github.com/czj527/body', demoUrl: null, order: 3,
    createdAt: '2026-06-14T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 4, title: '个人博客',
    description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、日程管理、访客问答等完整功能。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Tailwind CSS v4, Supabase',
    imageUrl: null, githubUrl: 'https://github.com/czj527/portfolio', demoUrl: 'https://czj527.xyz', order: 4,
    createdAt: '2026-03-07T02:22:11.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
]

export const SEED_FRIEND_LINKS = [
  { id: 1, name: 'GitHub', url: 'https://github.com/czj527', logo: null, order: 1 },
]

export const SEED_POSTS = [
  {
    id: 1,
    title: 'Hello World！欢迎来到我的博客',
    slug: 'hello-world',
    excerpt: '这是博客的第一篇文章，欢迎来到我的个人空间！',
    content: `# Hello World！

欢迎来到我的个人博客！这是我的第一篇文章。

## 关于这个博客

这个博客使用 **Next.js 16** + **React 19** 构建，采用现代简约风格设计。

### 主要功能

- 博客文章发布与管理
- 项目展示
- 个人信息展示
- 点赞与评论互动
- 分类与标签系统
- 留言板
- 深色模式

## 技术栈

- **前端框架**: Next.js 16 (React 19 + TypeScript)
- **样式方案**: Tailwind CSS v4 + shadcn/ui
- **数据库**: SQLite + Prisma
- **动画**: Framer Motion

## 未来计划

我会在这里分享技术心得、项目经验以及生活感悟。

> 用文字记录思考，用代码构建世界。

期待与大家交流！`,
    published: true,
    pinned: true,
    views: 0,
    categoryId: 1,
    createdAt: '2026-04-26T00:00:00.000Z',
    updatedAt: '2026-04-26T00:00:00.000Z',
    coverImage: null,
    category: { id: 1, name: '技术文章', slug: 'tech' },
    tags: [
      { id: 1, name: 'React', slug: 'react' },
      { id: 2, name: 'Next.js', slug: 'nextjs' },
      { id: 3, name: 'TypeScript', slug: 'typescript' },
    ],
    comments: [],
    _count: { comments: 0, likes: 0 },
    relatedPosts: [],
  },
]

export const SEED_GUESTBOOK = [
  {
    id: 1,
    name: '长岛冰茶',
    email: null,
    content: '自己的博客，第一条留言自己来！欢迎大家来玩~ 🎉',
    emoji: '🚀',
    likes: 0,
    createdAt: '2026-04-26T00:00:00.000Z',
  },
]
