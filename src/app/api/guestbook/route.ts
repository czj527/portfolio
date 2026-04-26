import { getPrisma } from '@/lib/prisma'
import { SEED_GUESTBOOK } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try { const msgs = await prisma.guestbookMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }); if (msgs.length > 0) return Response.json(msgs) } catch {}
    }
    return Response.json(SEED_GUESTBOOK)
  } catch { return Response.json(SEED_GUESTBOOK) }
}
