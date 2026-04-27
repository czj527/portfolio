import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const tursoUrl = process.env.TURSO_DATABASE_URL!
const tursoToken = process.env.TURSO_AUTH_TOKEN!

if (!tursoUrl || !tursoToken) {
  console.error('❌ 请设置 TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN 环境变量')
  console.error('   在 Turso 控制台获取: https://turso.tech/app')
  process.exit(1)
}

const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: tursoToken,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 开始初始化 Turso 数据库...')

  // Site Config
  await prisma.siteConfig.upsert({ where: { key: 'admin_password' }, update: {}, create: { key: 'admin_password', value: 'admin123' } })
  await prisma.siteConfig.upsert({ where: { key: 'about_me' }, update: {}, create: { key: 'about_me', value: '热爱编程与技术分享的全栈开发者' } })
  console.log('✅ 站点配置已设置')

  // Categories
  const techCat = await prisma.category.upsert({ where: { slug: 'tech' }, update: {}, create: { name: '技术文章', slug: 'tech' } })
  const lifeCat = await prisma.category.upsert({ where: { slug: 'life' }, update: {}, create: { name: '生活', slug: 'life' } })
  const thoughtCat = await prisma.category.upsert({ where: { slug: 'thought' }, update: {}, create: { name: '思考', slug: 'thought' } })
  console.log('✅ 分类已创建（技术文章、生活、思考）')

  // Tags
  const reactTag = await prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } })
  const nextTag = await prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } })
  const tsTag = await prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } })
  const vueTag = await prisma.tag.upsert({ where: { slug: 'vue' }, update: {}, create: { name: 'Vue', slug: 'vue' } })
  const webTag = await prisma.tag.upsert({ where: { slug: 'web' }, update: {}, create: { name: 'Web', slug: 'web' } })
  const pyTag = await prisma.tag.upsert({ where: { slug: 'python' }, update: {}, create: { name: 'Python', slug: 'python' } })
  const aiTag = await prisma.tag.upsert({ where: { slug: 'ai' }, update: {}, create: { name: 'AI', slug: 'ai' } })
  console.log('✅ 标签已创建')

  // Demo Post
  const existing = await prisma.post.findUnique({ where: { slug: 'hello-world' } })
  if (!existing) {
    await prisma.post.create({
      data: {
        title: 'Hello World！欢迎来到我的博客',
        slug: 'hello-world',
        excerpt: '这是博客的第一篇文章，欢迎来到我的个人空间！',
        content: `# Hello World！

欢迎来到我的个人博客！这是我的第一篇文章。

## 关于这个博客

这个博客使用 **Next.js 16** + **React 19** 构建，支持文章管理、点赞评论、留言板、深色模式等完整功能。

## 技术栈

- **前端**: Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Framer Motion
- **数据库**: Turso (SQLite 云) + Prisma
- **部署**: Vercel

## 未来计划

我会在这里分享技术心得、项目经验以及生活感悟。

> 用文字记录思考，用代码构建世界。`,
        published: true, pinned: true, categoryId: techCat.id,
        tags: { create: [{ tagId: reactTag.id }, { tagId: nextTag.id }, { tagId: tsTag.id }] },
      },
    })
    console.log('✅ 示例文章已创建')
  }

  // Projects
  await prisma.project.deleteMany()
  const projects = [
    { title: '四季清单 - TaskFlow', description: '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent。', techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Coze Agent, Supabase', githubUrl: 'https://github.com/czj527/taskflow', order: 1 },
    { title: '个人博客网站', description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论、留言板、深色模式、RSS 订阅。', techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Prisma, Turso', githubUrl: 'https://github.com/czj527/portfolio', order: 2 },
    { title: '四季清单智能助手', description: 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理和番茄钟工具的智能代理能力。', techStack: 'Python, Coze Agent, Supabase, FastAPI', githubUrl: 'https://github.com/czj527/taskflow-agent', order: 3 },
    { title: '疆韵易购 - 团购电商平台', description: '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台。', techStack: 'Vue.js, Vuex, Element UI', githubUrl: 'https://github.com/czj527/jyyg', order: 4 },
    { title: '问卷自动填写脚本', description: '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配和自定义填写规则。', techStack: 'TypeScript, Puppeteer, Node.js', githubUrl: 'https://github.com/czj527/jiaoben', order: 5 },
  ]
  for (const p of projects) { await prisma.project.create({ data: p }) }
  console.log('✅ 项目数据已创建')

  // Friend Link
  const flExists = await prisma.friendLink.findFirst()
  if (!flExists) { await prisma.friendLink.create({ data: { name: 'GitHub', url: 'https://github.com/czj527', order: 1 } }) }
  console.log('✅ 友链已创建')

  // Guestbook
  const gbExists = await prisma.guestbookMessage.findFirst()
  if (!gbExists) { await prisma.guestbookMessage.create({ data: { name: '长岛冰茶', content: '自己的博客，第一条留言自己来！欢迎大家来玩~ 🎉', emoji: '🚀' } }) }
  console.log('✅ 留言已创建')

  console.log('🎉 Turso 数据库初始化完成！')
}

main().catch(e => { console.error('❌ 失败:', e); process.exit(1) }).finally(() => prisma.$disconnect())
