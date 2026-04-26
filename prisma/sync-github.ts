import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 从 GitHub 同步项目数据...')

  await prisma.project.deleteMany()
  console.log('✅ 已清空旧项目数据')

  const repos = [
    {
      title: '四季清单 - TaskFlow',
      description: '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent 实现智能任务建议和日程优化。',
      techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Coze Agent, Supabase',
      githubUrl: 'https://github.com/czj527/taskflow',
      demoUrl: null,
      order: 1,
    },
    {
      title: '个人博客网站',
      description: '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论、留言板、深色模式、RSS 订阅等完整功能。',
      techStack: 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Tailwind CSS v4, Prisma, SQLite',
      githubUrl: 'https://github.com/czj527/portfolio',
      demoUrl: null,
      order: 2,
    },
    {
      title: '四季清单智能助手',
      description: 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理和番茄钟工具的智能代理能力，集成 Coze 工作流。',
      techStack: 'Python, Coze Agent, Supabase, FastAPI',
      githubUrl: 'https://github.com/czj527/taskflow-agent',
      demoUrl: null,
      order: 3,
    },
    {
      title: '疆韵易购 - 团购电商平台',
      description: '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台三个子系统。',
      techStack: 'Vue.js, Vuex, Element UI',
      githubUrl: 'https://github.com/czj527/jyyg',
      demoUrl: null,
      order: 4,
    },
    {
      title: '问卷自动填写脚本',
      description: '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配和自定义填写规则。',
      techStack: 'TypeScript, Puppeteer, Node.js',
      githubUrl: 'https://github.com/czj527/jiaoben',
      demoUrl: null,
      order: 5,
    },
  ]

  for (const repo of repos) {
    await prisma.project.create({ data: repo })
  }

  console.log(`✅ 已同步 ${repos.length} 个 GitHub 项目`)
}

main()
  .catch((e) => {
    console.error('❌ 同步失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
