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
  // === 活跃项目 ===
  {
    id: 1, title: '新叶日报',
    description: 'AI资讯聚合平台，基于 xyai / aiweb 迭代的下一代 AI 资讯服务。每日聚合 AI 领域最新动态，支持智能筛选、分类与个性化推送。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Supabase',
    imageUrl: null, githubUrl: '', demoUrl: null, order: 1,
    active: true,
    createdAt: '2026-06-16T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 2, title: 'opencolorful',
    description: '个人 AI 智能体项目，融合关于私人助理 Agent 的独立思考与理念。类似 OpenHanako 架构，支持多角色、多模型编排与个性化交互。',
    techStack: 'TypeScript, React, AI SDK, Agent Framework',
    imageUrl: null, githubUrl: 'https://github.com/czj527/opencolorful', demoUrl: null, order: 2,
    active: true,
    createdAt: '2026-06-09T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 3, title: 'body',
    description: '为 AI Agent 构建可在网页或桌面活动的虚拟身体。探索 Agent 在数字空间中的具身化交互体验。',
    techStack: 'JavaScript, Web/Desktop Integration',
    imageUrl: null, githubUrl: 'https://github.com/czj527/body', demoUrl: null, order: 3,
    active: true,
    createdAt: '2026-06-14T00:00:00.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  {
    id: 4, title: '个人博客',
    description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、日程管理、访客问答等完整功能。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Tailwind CSS v4, Supabase',
    imageUrl: null, githubUrl: 'https://github.com/czj527/portfolio', demoUrl: 'https://czj527.xyz', order: 4,
    active: true,
    createdAt: '2026-03-07T02:22:11.000Z', updatedAt: '2026-06-16T00:00:00.000Z',
  },
  // === 暂停 / 归档项目 ===
  {
    id: 5, title: '四季清单 - TaskFlow',
    description: '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent 实现智能任务建议和日程优化。',
    techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Coze Agent, Supabase',
    imageUrl: null, githubUrl: 'https://github.com/czj527/taskflow', demoUrl: null, order: 5,
    active: false,
    createdAt: '2026-03-09T13:35:30.000Z', updatedAt: '2026-04-26T12:17:33.000Z',
  },
  {
    id: 6, title: 'NovaWrite',
    description: '基于多 Agent 协作的 AI 长篇小说创作系统，探索 AI 在文学创作领域的可能性。',
    techStack: 'Python, Multi-Agent, LLM',
    imageUrl: null, githubUrl: 'https://github.com/czj527/NovaWrite', demoUrl: null, order: 6,
    active: false,
    createdAt: '2026-05-11T00:00:00.000Z', updatedAt: '2026-05-11T00:00:00.000Z',
  },
  {
    id: 7, title: 'Live2D 看板娘「橙」',
    description: '基于 Live2D 的桌面看板娘演示项目，探索二次元角色与桌面交互的结合。',
    techStack: 'TypeScript, Live2D, React',
    imageUrl: null, githubUrl: 'https://github.com/czj527/orange-demo', demoUrl: null, order: 7,
    active: false,
    createdAt: '2026-05-07T00:00:00.000Z', updatedAt: '2026-05-07T00:00:00.000Z',
  },
  {
    id: 8, title: '龙虾工作台',
    description: '可视化项目规划与任务管理工作台，整合 GitHub 仓库管理、开发进度追踪。',
    techStack: 'Next.js, TypeScript, Supabase Realtime',
    imageUrl: null, githubUrl: 'https://github.com/czj527/lobster-workbench', demoUrl: null, order: 8,
    active: false,
    createdAt: '2026-05-27T00:00:00.000Z', updatedAt: '2026-05-27T00:00:00.000Z',
  },
  {
    id: 9, title: '四季清单智能助手',
    description: 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理等工具的智能代理能力。',
    techStack: 'Python, Coze Agent, Supabase, FastAPI',
    imageUrl: null, githubUrl: 'https://github.com/czj527/taskflow-agent', demoUrl: null, order: 9,
    active: false,
    createdAt: '2026-03-19T10:58:41.000Z', updatedAt: '2026-03-19T11:00:18.000Z',
  },
  {
    id: 10, title: 'AI Pulse（旧版）',
    description: '新叶日报的前身，AI 资讯聚合与展示平台。功能和代码已融入新叶日报。',
    techStack: 'Next.js, TypeScript, Supabase',
    imageUrl: null, githubUrl: 'https://github.com/czj527/aiweb', demoUrl: null, order: 10,
    active: false,
    createdAt: '2026-05-27T00:00:00.000Z', updatedAt: '2026-05-27T00:00:00.000Z',
  },
  {
    id: 11, title: '新叶AI（旧版）',
    description: 'AI 资讯网站早期版本，新叶日报的孵化项目。功能和代码已融入新叶日报。',
    techStack: 'TypeScript, Vue, Next.js',
    imageUrl: null, githubUrl: 'https://github.com/czj527/xyai', demoUrl: null, order: 11,
    active: false,
    createdAt: '2026-05-10T00:00:00.000Z', updatedAt: '2026-05-10T00:00:00.000Z',
  },
  {
    id: 12, title: '疆韵易购 - 团购电商平台',
    description: '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台。',
    techStack: 'Vue.js, Vuex, Element UI',
    imageUrl: null, githubUrl: 'https://github.com/czj527/jyyg', demoUrl: null, order: 12,
    active: false,
    createdAt: '2026-03-11T02:10:20.000Z', updatedAt: '2026-04-26T12:17:47.000Z',
  },
  {
    id: 13, title: '问卷自动填写脚本',
    description: '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配和自定义填写规则。',
    techStack: 'TypeScript, Puppeteer, Node.js',
    imageUrl: null, githubUrl: 'https://github.com/czj527/jiaoben', demoUrl: null, order: 13,
    active: false,
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
