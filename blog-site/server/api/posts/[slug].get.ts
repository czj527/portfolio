import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  })

  if (!post) {
    throw createError({ statusCode: 404, message: '文章不存在' })
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  })

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
      OR: [
        { categoryId: post.categoryId ?? undefined },
        {
          tags: {
            some: {
              tagId: { in: post.tags.map((t) => t.tagId) },
            },
          },
        },
      ],
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return {
    ...post,
    tags: post.tags.map((t) => t.tag),
    relatedPosts,
  }
})
