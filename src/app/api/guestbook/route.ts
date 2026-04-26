import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100)

    const messages = await prisma.guestbookMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return Response.json(messages)
  } catch (error) {
    console.error('Failed to fetch guestbook:', error)
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'delete') {
      const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
      if (body.password !== config?.value) {
        return Response.json({ error: '密码错误' }, { status: 403 })
      }
      await prisma.guestbookMessage.delete({ where: { id: Number(body.id) } })
      return Response.json({ success: true, message: '已删除' })
    }

    if (action === 'like') {
      const message = await prisma.guestbookMessage.update({
        where: { id: Number(body.id) },
        data: { likes: { increment: 1 } },
      })
      return Response.json({ success: true, likes: message.likes })
    }

    const { name, email, content, emoji } = body
    if (!content || !content.trim()) {
      return Response.json({ error: '留言内容不能为空' }, { status: 400 })
    }
    if (content.length > 500) {
      return Response.json({ error: '内容太长（最多500个字符）' }, { status: 400 })
    }

    const message = await prisma.guestbookMessage.create({
      data: {
        name: name?.trim() || null,
        email: email?.trim() || null,
        content: content.trim(),
        emoji: emoji || '😀',
      },
    })
    return Response.json({ success: true, message })
  } catch (error) {
    console.error('Guestbook action failed:', error)
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
