import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
  })

  return categories
})
