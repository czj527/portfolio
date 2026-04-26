import { getPrisma } from '@/lib/prisma'
import { SEED_CONFIG } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try {
        const configs = await prisma.siteConfig.findMany()
        if (configs.length > 0) {
          const m: Record<string, string> = {}; for (const c of configs) m[c.key] = c.value
          return Response.json(m)
        }
      } catch {}
    }
    return Response.json(SEED_CONFIG)
  } catch { return Response.json(SEED_CONFIG) }
}
