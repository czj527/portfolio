import { getPrisma } from '@/lib/prisma'
import { SEED_GUESTBOOK } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try { const msgs = await prisma.guestbookMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }); if (msgs.length > 0) return Response.json(msgs) } catch {}
    }
    return Response.json(SEED_GUESTBOOK)
  } catch { return Response.json(SEED_GUESTBOOK) }
}

// POST handler for creating messages, likes, and deletions
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    const prisma = await getPrisma()
    if (!prisma) {
      return Response.json({ error: '数据库不可用，请稍后重试' }, { status: 503 })
    }

    // Create new message
    if (!action) {
      const { name, email, content, emoji } = body
      
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return Response.json({ error: '留言内容不能为空' }, { status: 400 })
      }
      if (content.length > 500) {
        return Response.json({ error: '内容太长（最多500个字符）' }, { status: 400 })
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
      }

      const message = await prisma.guestbookMessage.create({
        data: {
          name: name?.trim() || null,
          email: email?.trim() || null,
          content: content.trim(),
          emoji: emoji || '😀',
          likes: 0,
        },
      })
      return Response.json(message)
    }

    // Like action
    if (action === 'like') {
      const { id } = body
      if (!id) {
        return Response.json({ error: '缺少留言ID' }, { status: 400 })
      }

      const message = await prisma.guestbookMessage.update({
        where: { id },
        data: { likes: { increment: 1 } },
      })
      return Response.json({ success: true, likes: message.likes })
    }

    // Delete action
    if (action === 'delete') {
      const { id, password } = body
      if (!id) {
        return Response.json({ error: '缺少留言ID' }, { status: 400 })
      }
      if (!password || password !== 'admin123') {
        return Response.json({ error: '密码错误' }, { status: 403 })
      }

      await prisma.guestbookMessage.delete({ where: { id } })
      return Response.json({ success: true })
    }

    return Response.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error('Guestbook POST error:', error)
    return Response.json({ error: '服务器错误，请稍后重试' }, { status: 500 })
  }
}
