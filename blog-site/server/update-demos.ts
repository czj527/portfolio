import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 更新项目 Demo 链接...')

  await prisma.project.updateMany({
    where: { githubUrl: 'https://github.com/czj527/portfolio' },
    data: { demoUrl: 'https://czj527.github.io/portfolio' },
  })
  console.log('✅ portfolio Demo 已添加: https://czj527.github.io/portfolio')

  await prisma.project.updateMany({
    where: { githubUrl: 'https://github.com/czj527/personal-website' },
    data: { demoUrl: 'https://czj527.github.io/personal-website' },
  })
  console.log('✅ personal-website Demo 已确认')

  console.log('🎉 更新完成！')
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
