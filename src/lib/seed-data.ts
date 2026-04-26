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
    id: 1, title: '四季清单 - TaskFlow',
    description: '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent 实现智能任务建议和日程优化。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Coze Agent, Supabase',
    imageUrl: null, githubUrl: 'https://github.com/czj527/taskflow', demoUrl: null, order: 1,
    createdAt: '2026-03-09T13:35:30.000Z', updatedAt: '2026-04-26T12:17:33.000Z',
  },
  {
    id: 2, title: '个人博客网站',
    description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论、留言板、深色模式、RSS 订阅等完整功能。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Tailwind CSS v4, Prisma, SQLite',
    imageUrl: null, githubUrl: 'https://github.com/czj527/portfolio', demoUrl: null, order: 2,
    createdAt: '2026-03-07T02:22:11.000Z', updatedAt: '2026-04-26T12:54:54.000Z',
  },
  {
    id: 3, title: '四季清单智能助手',
    description: 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理和番茄钟工具的智能代理能力，集成 Coze 工作流。',
    techStack: 'Python, Coze Agent, Supabase, FastAPI',
    imageUrl: null, githubUrl: 'https://github.com/czj527/taskflow-agent', demoUrl: null, order: 3,
    createdAt: '2026-03-19T10:58:41.000Z', updatedAt: '2026-03-19T11:00:18.000Z',
  },
  {
    id: 4, title: '疆韵易购 - 团购电商平台',
    description: '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台三个子系统。',
    techStack: 'Vue.js, Vuex, Element UI',
    imageUrl: null, githubUrl: 'https://github.com/czj527/jyyg', demoUrl: null, order: 4,
    createdAt: '2026-03-11T02:10:20.000Z', updatedAt: '2026-04-26T12:17:47.000Z',
  },
  {
    id: 5, title: '问卷自动填写脚本',
    description: '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配和自定义填写规则。',
    techStack: 'TypeScript, Puppeteer, Node.js',
    imageUrl: null, githubUrl: 'https://github.com/czj527/jiaoben', demoUrl: null, order: 5,
    createdAt: '2026-03-21T12:26:48.000Z', updatedAt: '2026-04-26T12:17:59.000Z',
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
