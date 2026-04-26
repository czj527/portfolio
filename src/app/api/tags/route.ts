import { prisma } from '@/lib/prisma'
import { SEED_TAGS } from '@/lib/seed-data'

export async function GET() {
  try {
    try {
      const tags = await prisma.tag.findMany({ include: { _count: { select: { posts: true } } } })
      if (tags.length > 0) return Response.json(tags)
    } catch { /* fall back to seed */ }
    return Response.json(SEED_TAGS)
  } catch {
    return Response.json([])
  }
}
