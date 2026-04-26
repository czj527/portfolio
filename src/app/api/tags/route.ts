import { getPrisma } from '@/lib/prisma'
import { SEED_TAGS } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try { const tags = await prisma.tag.findMany({ include: { _count: { select: { posts: true } } } }); if (tags.length > 0) return Response.json(tags) } catch {}
    }
    return Response.json(SEED_TAGS)
  } catch { return Response.json([]) }
}
