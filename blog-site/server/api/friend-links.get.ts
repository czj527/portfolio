import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const links = await prisma.friendLink.findMany({
    orderBy: { order: 'asc' },
  })
  return links
})
