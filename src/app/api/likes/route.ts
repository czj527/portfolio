import { getPrisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const postId = Number(body.postId)

    if (!postId) {
      return Response.json({ error: '缺少 postId' }, { status: 400 })
    }

    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim() || '127.0.0.1'

    const prisma = await getPrisma()
    if (!prisma) return Response.json({ error: '数据库不可用' }, { status: 503 })

    const existing = await prisma.like.findUnique({
      where: { ip_postId: { ip, postId } },
    })

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      const count = await prisma.like.count({ where: { postId } })
      return Response.json({ liked: false, count, message: '已取消点赞' })
    }

    await prisma.like.create({ data: { ip, postId } })
    const count = await prisma.like.count({ where: { postId } })
    return Response.json({ liked: true, count, message: '点赞成功' })
  } catch (error) {
    console.error('Like action failed:', error)
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
