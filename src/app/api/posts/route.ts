import { getPrisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { SEED_POSTS } from '@/lib/seed-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = Number(searchParams.get('limit')) || 10; const page = Number(searchParams.get('page')) || 1
    const published = searchParams.get('published'); const category = searchParams.get('category')
    const tag = searchParams.get('tag'); const search = searchParams.get('search')

    let posts: any[] = []; let total = 0
    const prisma = await getPrisma()
    if (prisma) {
      try {
        const where: any = {}
        if (published !== 'false') where.published = true
        if (category) where.category = { slug: category }
        if (tag) where.tags = { some: { tag: { slug: tag } } }
        if (search) where.OR = [{ title: { contains: search } }, { content: { contains: search } }]
        const [dbPosts, dbTotal] = await Promise.all([
          prisma.post.findMany({ where, include: { category: { select: { name: true, slug: true } }, tags: { include: { tag: { select: { id: true, name: true, slug: true } } }, take: 5 }, _count: { select: { comments: true, likes: true } } }, orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }], skip: (page - 1) * limit, take: limit }),
          prisma.post.count({ where }),
        ])
        if (dbTotal > 0) { posts = dbPosts.map((p: any) => ({ ...p, tags: p.tags.map((t: any) => t.tag) })); total = dbTotal }
      } catch {}
    }
    if (total === 0) {
      let filtered = SEED_POSTS.filter(p => {
        if (published !== 'false' && !p.published) return false
        if (category && p.category?.slug !== category) return false
        if (tag && !p.tags.some((t: any) => t.slug === tag)) return false
        if (search && !p.title.includes(search) && !p.content.includes(search)) return false
        return true
      })
      total = filtered.length; posts = filtered.slice((page - 1) * limit, page * limit)
    }
    return Response.json({ posts, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) })
  } catch {
    return Response.json({ posts: [], total: 0, page: 1, totalPages: 1 })
  }
}
