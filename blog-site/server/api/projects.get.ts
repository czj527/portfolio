import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  })

  return projects
})
