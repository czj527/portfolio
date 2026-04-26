import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body.action

    const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
    if (body.password !== config?.value) {
      return Response.json({ error: '密码错误' }, { status: 403 })
    }

    if (action === 'create') {
      const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      const existing = await prisma.post.findUnique({ where: { slug } })
      if (existing) {
        return Response.json({ error: 'slug 已存在' }, { status: 400 })
      }

      const post = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          excerpt: body.excerpt || null,
          slug,
          coverImage: body.coverImage || null,
          published: body.published ?? true,
          pinned: body.pinned ?? false,
          categoryId: body.categoryId ? Number(body.categoryId) : null,
          tags: body.tagIds?.length
            ? { create: body.tagIds.map((id: number) => ({ tagId: Number(id) })) }
            : undefined,
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      })

      return Response.json({ success: true, post })
    }

    if (action === 'update') {
      const postId = Number(body.id)
      if (!postId) return Response.json({ error: '缺少 id' }, { status: 400 })

      await prisma.tagOnPost.deleteMany({ where: { postId } })

      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          title: body.title,
          content: body.content,
          excerpt: body.excerpt,
          coverImage: body.coverImage,
          published: body.published,
          pinned: body.pinned,
          categoryId: body.categoryId ? Number(body.categoryId) : null,
          tags: body.tagIds?.length
            ? { create: body.tagIds.map((id: number) => ({ tagId: Number(id) })) }
            : undefined,
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      })

      return Response.json({ success: true, post })
    }

    if (action === 'delete') {
      const postId = Number(body.id)
      if (!postId) return Response.json({ error: '缺少 id' }, { status: 400 })

      await prisma.post.delete({ where: { id: postId } })
      return Response.json({ success: true, message: '已删除' })
    }

    return Response.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error('Blog action failed:', error)
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
