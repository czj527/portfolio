import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const postId = Number(body.postId)

  if (!postId) {
    throw createError({ statusCode: 400, message: '缺少 postId' })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  const existing = await prisma.like.findUnique({
    where: { ip_postId: { ip, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return { liked: false, message: '已取消点赞' }
  }

  await prisma.like.create({
    data: { ip, postId },
  })

  const count = await prisma.like.count({ where: { postId } })

  return { liked: true, count, message: '点赞成功' }
})
