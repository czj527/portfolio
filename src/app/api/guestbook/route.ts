import { SEED_GUESTBOOK } from '@/lib/seed-data'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    try {
      const messages = await prisma.guestbookMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
      if (messages.length > 0) return Response.json(messages)
    } catch { /* fall back to seed */ }
    return Response.json(SEED_GUESTBOOK)
  } catch {
    return Response.json(SEED_GUESTBOOK)
  }
}
