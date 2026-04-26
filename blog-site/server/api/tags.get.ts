import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
  })

  return tags
})
