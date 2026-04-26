import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { SEED_POSTS } from '@/lib/seed-data'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: { category: true, tags: { include: { tag: true } }, comments: { orderBy: { createdAt: 'desc' } }, _count: { select: { comments: true, likes: true } } },
      })

      if (post) {
        await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})
        const relatedPosts = await prisma.post.findMany({
          where: { published: true, id: { not: post.id }, OR: [post.categoryId ? { categoryId: post.categoryId } : {}, { tags: { some: { tagId: { in: post.tags.map(t => t.tagId) } } } }] },
          include: { category: { select: { name: true, slug: true } }, _count: { select: { comments: true, likes: true } } },
          take: 3, orderBy: { createdAt: 'desc' },
        }).catch(() => [])
        return Response.json({ ...post, tags: post.tags.map(t => t.tag), relatedPosts })
      }
    } catch { /* prisma may fail on Vercel */ }

    const seed = SEED_POSTS.find(p => p.slug === slug)
    if (seed) return Response.json(seed)

    return Response.json({ error: '文章不存在' }, { status: 404 })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
