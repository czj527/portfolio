import { getPrisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const prisma = await getPrisma()
    const config = prisma ? (await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } }).catch(() => null)) : null
    const correctPassword = config?.value || 'admin123'

    if (body.password !== correctPassword) {
      return Response.json({ error: '密码错误' }, { status: 403 })
    }

    const action = body.action

    if (action === 'create' || action === 'update') {
      const slug = body.slug || (body.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (action === 'update') {
        const postId = Number(body.id)
        if (!postId) return Response.json({ error: '缺少 id' }, { status: 400 })
        await prisma?.tagOnPost.deleteMany({ where: { postId } }).catch(() => {})
        const post = await prisma?.post.update({
          where: { id: postId },
          data: { title: body.title, content: body.content, excerpt: body.excerpt, coverImage: body.coverImage, published: body.published, pinned: body.pinned, categoryId: body.categoryId ? Number(body.categoryId) : null, tags: body.tagIds?.length ? { create: body.tagIds.map((id: number) => ({ tagId: Number(id) })) } : undefined },
          include: { category: true, tags: { include: { tag: true } } },
        }).catch(() => null)
        if (post) return Response.json({ success: true, post })
      } else {
        const existing = await prisma?.post.findUnique({ where: { slug } }).catch(() => null)
        if (existing) return Response.json({ error: 'slug 已存在' }, { status: 400 })
        const post = await prisma?.post.create({
          data: { title: body.title, content: body.content, excerpt: body.excerpt || null, slug, coverImage: body.coverImage || null, published: body.published ?? true, pinned: body.pinned ?? false, categoryId: body.categoryId ? Number(body.categoryId) : null, tags: body.tagIds?.length ? { create: body.tagIds.map((id: number) => ({ tagId: Number(id) })) } : undefined },
          include: { category: true, tags: { include: { tag: true } } },
        }).catch(() => null)
        if (post) return Response.json({ success: true, post })
      }
      return Response.json({ error: '数据库不可用（Vercel 部署仅支持查看模式）' }, { status: 503 })
    }

    if (action === 'delete') {
      const postId = Number(body.id)
      if (!postId) return Response.json({ error: '缺少 id' }, { status: 400 })
      await prisma?.post.delete({ where: { id: postId } }).catch(() => {})
      return Response.json({ success: true, message: '已删除' })
    }

    return Response.json({ error: '未知操作' }, { status: 400 })
  } catch {
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
