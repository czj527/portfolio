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
    create: { name: '技术', slug: 'tech' },
  })

  const lifeCategory = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: { name: '生活', slug: 'life' },
  })
  console.log('✅ 分类已创建')

  const vueTag = await prisma.tag.upsert({ where: { slug: 'vue' }, update: {}, create: { name: 'Vue', slug: 'vue' } })
  const nuxtTag = await prisma.tag.upsert({ where: { slug: 'nuxt' }, update: {}, create: { name: 'Nuxt', slug: 'nuxt' } })
  const tsTag = await prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } })
  const webTag = await prisma.tag.upsert({ where: { slug: 'web' }, update: {}, create: { name: 'Web', slug: 'web' } })
  console.log('✅ 标签已创建')

  const existingPost = await prisma.post.findUnique({ where: { slug: 'hello-world' } })
  if (!existingPost) {
    const post = await prisma.post.create({
      data: {
        title: 'Hello World！我的第一篇博客',
        slug: 'hello-world',
        excerpt: '这是博客的第一篇文章，欢迎来到我的个人空间！',
        content: `# Hello World！

欢迎来到我的个人博客！这是我的第一篇文章。

## 关于这个博客

这个博客使用 **Nuxt 3** + **Vue 3** 构建，采用现代简约风格设计。

### 主要功能

- 博客文章发布与管理
- 项目展示
- 个人信息展示
- 点赞与评论互动

## 技术栈

- **前端框架**: Nuxt 3 (Vue 3 + TypeScript)
- **样式方案**: Tailwind CSS
- **数据库**: SQLite + Prisma
- **富文本编辑**: Markdown

## 未来计划

我会在这里分享技术心得、项目经验以及生活感悟。

> 用文字记录思考，用代码构建世界。

期待与大家交流！`,
        published: true,
        pinned: true,
        categoryId: techCategory.id,
        tags: {
          create: [
            { tagId: vueTag.id },
            { tagId: nuxtTag.id },
            { tagId: tsTag.id },
          ],
        },
      },
    })
    console.log(`✅ 示例文章已创建: ${post.title}`)
  }

  const existingProject = await prisma.project.findFirst()
  if (!existingProject) {
    const projects = [
      {
        title: '个人博客网站',
        description: '基于 Nuxt 3 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论等完整功能。',
        techStack: 'Vue 3, Nuxt 3, TypeScript, Tailwind CSS, Prisma, SQLite',
        githubUrl: 'https://github.com',
        demoUrl: 'https://example.com',
        order: 1,
      },
      {
        title: '任务管理应用',
        description: '一款简洁高效的任务管理工具，支持看板视图、标签分类、拖拽排序等功能。',
        techStack: 'React, TypeScript, Node.js, MongoDB',
        githubUrl: 'https://github.com',
        demoUrl: 'https://example.com',
        order: 2,
      },
      {
        title: '天气预报小程序',
        description: '基于 Vue 3 开发的天气预报应用，接入第三方天气 API，支持城市搜索和未来7天预报。',
        techStack: 'Vue 3, Vite, Axios, Chart.js',
        githubUrl: 'https://github.com',
        order: 3,
      },
    ]

    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
    console.log('✅ 示例项目已创建')
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
