import { getPrisma } from '@/lib/prisma'
import { SEED_CATEGORIES } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try { const cats = await prisma.category.findMany({ include: { _count: { select: { posts: true } } } }); if (cats.length > 0) return Response.json(cats) } catch {}
    }
    return Response.json(SEED_CATEGORIES)
  } catch { return Response.json([]) }
}
