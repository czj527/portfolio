import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const action = getRouterParam(event, 'action')
  const body = await readBody(event)

  const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })

  if (body.password !== config?.value) {
    throw createError({ statusCode: 403, message: '密码错误' })
  }

  switch (action) {
    case 'create': {
      const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      const existing = await prisma.post.findUnique({ where: { slug } })
      if (existing) {
        throw createError({ statusCode: 400, message: 'slug 已存在' })
      }

      const post = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          excerpt: body.excerpt,
          slug,
          coverImage: body.coverImage,
          published: body.published ?? true,
          pinned: body.pinned ?? false,
          categoryId: body.categoryId ? Number(body.categoryId) : null,
          tags: body.tagIds?.length
            ? { create: body.tagIds.map((id: number) => ({ tagId: Number(id) })) }
            : undefined,
        },
      })

      return { success: true, post }
    }

    case 'update': {
      const postId = Number(body.id)
      if (!postId) throw createError({ statusCode: 400, message: '缺少 id' })

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
      })

      return { success: true, post }
    }

    case 'delete': {
      const postId = Number(body.id)
      if (!postId) throw createError({ statusCode: 400, message: '缺少 id' })

      await prisma.post.delete({ where: { id: postId } })
      return { success: true, message: '已删除' }
    }

    default:
      throw createError({ statusCode: 400, message: '未知操作' })
  }
})
