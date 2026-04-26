import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据...')

  const existingPassword = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
  if (!existingPassword) {
    await prisma.siteConfig.create({
      data: { key: 'admin_password', value: 'admin123' },
    })
    console.log('✅ 管理密码已设置 (admin123)')
  }

  const existingAbout = await prisma.siteConfig.findUnique({ where: { key: 'about_me' } })
  if (!existingAbout) {
    await prisma.siteConfig.create({
      data: { key: 'about_me', value: '热爱编程与技术分享的全栈开发者' },
    })
    console.log('✅ 个人信息已设置')
  }

  const techCategory = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: '技术文章', slug: 'tech' },
  })

  const lifeCategory = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: { name: '生活', slug: 'life' },
  })

  const thoughtCategory = await prisma.category.upsert({
    where: { slug: 'thought' },
    update: {},
    create: { name: '思考', slug: 'thought' },
  })
  console.log('✅ 分类已创建（技术文章、生活、思考）')

  const vueTag = await prisma.tag.upsert({ where: { slug: 'vue' }, update: {}, create: { name: 'Vue', slug: 'vue' } })
  const reactTag = await prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } })
  const nextTag = await prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } })
  const tsTag = await prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } })
  const webTag = await prisma.tag.upsert({ where: { slug: 'web' }, update: {}, create: { name: 'Web', slug: 'web' } })
  console.log('✅ 标签已创建')

  const existingPost = await prisma.post.findUnique({ where: { slug: 'hello-world' } })
  if (!existingPost) {
    await prisma.post.create({
      data: {
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
        categoryId: techCategory.id,
        tags: {
          create: [
            { tagId: reactTag.id },
            { tagId: nextTag.id },
            { tagId: tsTag.id },
          ],
        },
      },
    })
    console.log('✅ 示例文章已创建')
  }

  const existingProject = await prisma.project.findFirst()
  if (!existingProject) {
    const projects = [
      {
        title: '四季清单 - TaskFlow',
        description: '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent 实现智能任务建议和日程优化。',
        techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Coze Agent, Supabase',
        githubUrl: 'https://github.com/czj527/taskflow',
        order: 1,
      },
      {
        title: '个人博客网站',
        description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论、留言板、深色模式、RSS 订阅等完整功能。',
        techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Tailwind CSS v4, Prisma, SQLite',
        githubUrl: 'https://github.com/czj527/portfolio',
        order: 2,
      },
      {
        title: '四季清单智能助手',
        description: 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理和番茄钟工具的智能代理能力，集成 Coze 工作流。',
        techStack: 'Python, Coze Agent, Supabase, FastAPI',
        githubUrl: 'https://github.com/czj527/taskflow-agent',
        order: 3,
      },
      {
        title: '疆韵易购 - 团购电商平台',
        description: '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台三个子系统。',
        techStack: 'Vue.js, Vuex, Element UI',
        githubUrl: 'https://github.com/czj527/jyyg',
        order: 4,
      },
      {
        title: '问卷自动填写脚本',
        description: '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配和自定义填写规则。',
        techStack: 'TypeScript, Puppeteer, Node.js',
        githubUrl: 'https://github.com/czj527/jiaoben',
        order: 5,
      },
    ]

    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
    console.log('✅ 示例项目已创建')
  }

  const existingFriendLink = await prisma.friendLink.findFirst()
  if (!existingFriendLink) {
    await prisma.friendLink.create({
      data: { name: 'GitHub', url: 'https://github.com/czj527', order: 1 }
    })
    console.log('✅ 示例友链已创建')
  }

  console.log('🎉 数据初始化完成！')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
