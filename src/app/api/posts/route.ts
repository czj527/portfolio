import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = Number(searchParams.get('limit')) || 10
    const page = Number(searchParams.get('page')) || 1
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const where: any = {}

    if (published !== 'false') {
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
            take: 5,
          },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return Response.json({
      posts: posts.map((post) => ({
        ...post,
        tags: post.tags.map((t) => t.tag),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
