import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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
      return Response.json({ error: '文章不存在' }, { status: 404 })
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
          post.categoryId ? { categoryId: post.categoryId } : {},
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
        _count: { select: { comments: true, likes: true } },
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({
      ...post,
      tags: post.tags.map((t) => t.tag),
      relatedPosts,
    })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
