import { prisma } from '@/lib/prisma'
import { SEED_CATEGORIES } from '@/lib/seed-data'

export async function GET() {
  try {
    try {
      const categories = await prisma.category.findMany({ include: { _count: { select: { posts: true } } } })
      if (categories.length > 0) return Response.json(categories)
    } catch { /* fall back to seed */ }
    return Response.json(SEED_CATEGORIES)
  } catch {
    return Response.json([])
  }
}
