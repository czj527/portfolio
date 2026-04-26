import { prisma } from '@/lib/prisma'
import { SEED_FRIEND_LINKS } from '@/lib/seed-data'

export async function GET() {
  try {
    try {
      const links = await prisma.friendLink.findMany({ orderBy: { order: 'asc' } })
      if (links.length > 0) return Response.json(links)
    } catch { /* fall back to seed */ }
    return Response.json(SEED_FRIEND_LINKS)
  } catch {
    return Response.json([])
  }
}
