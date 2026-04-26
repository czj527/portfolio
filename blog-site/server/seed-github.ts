import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GITHUB_REPOS = [
  {
    title: 'personal-website',
    description: '一个现代化的个人网站，使用 Next.js、Tailwind CSS 和 Framer Motion 构建。支持从 GitHub 动态获取用户信息和项目数据，集成深色模式和流畅动画。',
    techStack: 'TypeScript, Next.js, Tailwind CSS, Framer Motion, React',
    githubUrl: 'https://github.com/czj527/personal-website',
    demoUrl: 'https://czj527.github.io/personal-website',
    order: 1,
  },
  {
    title: 'taskflow',
    description: '基于 Next.js 16 + shadcn/ui 的全栈应用项目。包含完整的组件库、表单系统、数据获取方案，支持 Sentry 监控和 Playwright E2E 测试。',
    techStack: 'TypeScript, Next.js, shadcn/ui, Tailwind CSS, Playwright, Sentry',
    githubUrl: 'https://github.com/czj527/taskflow',
    order: 2,
  },
  {
    title: 'taskflow-agent',
    description: '四季清单智能助手集成包 — AI Agent 智能助手。集成日程管理、项目管理、番茄钟工具，支持一键集成到 Taskflow 应用。',
    techStack: 'Python, FastAPI, Supabase, AI Agent',
    githubUrl: 'https://github.com/czj527/taskflow-agent',
    order: 3,
  },
  {
    title: 'portfolio',
    description: '个人作品集网站，基于 Next.js 构建，包含项目展示和博客功能。集成 GitHub Actions CI/CD 和多种部署方案。',
    techStack: 'TypeScript, Next.js, Tailwind CSS, PostgreSQL, GitHub Actions',
    githubUrl: 'https://github.com/czj527/portfolio',
    order: 4,
  },
  {
    title: 'jyyg',
    description: '多模块企业级应用项目，包含管理后台、商户端、用户端和后端服务。采用前后端分离架构。',
    techStack: 'Vue, Java, TypeScript, Spring Boot, Less, JavaScript',
    githubUrl: 'https://github.com/czj527/jyyg',
    order: 5,
  },
  {
    title: 'jiaoben',
    description: 'TypeScript 脚本工具集，包含代码生成、自动化工具等实用脚本。',
    techStack: 'TypeScript, Node.js',
    githubUrl: 'https://github.com/czj527/jiaoben',
    order: 6,
  },
]

async function main() {
  console.log('🚀 开始同步 GitHub 项目数据...')

  await prisma.project.deleteMany()
  console.log('🗑️ 已清空旧项目数据')

  for (const repo of GITHUB_REPOS) {
    const project = await prisma.project.create({ data: repo })
    console.log(`✅ ${project.title} 已添加`)
  }

  const siteConfigs = [
    { key: 'github_username', value: 'czj527' },
    { key: 'github_url', value: 'https://github.com/czj527' },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  console.log('✅ GitHub 配置已更新')
  console.log('🎉 同步完成！共导入 ' + GITHUB_REPOS.length + ' 个项目')
}

main()
  .catch((e) => {
    console.error('❌ 同步失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
