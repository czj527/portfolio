import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 10
  const page = Number(query.page) || 1
  const published = query.published !== 'false'
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined
  const search = query.search as string | undefined

  const where: any = {}

  if (published) {
    where.published = true
  }

  if (category) {
    where.category = { slug: category }
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag } } }
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ]
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true } } },
          take: 3,
        },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return {
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
})
