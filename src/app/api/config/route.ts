import { prisma } from '@/lib/prisma'
import { SEED_CONFIG } from '@/lib/seed-data'

export async function GET() {
  try {
    try {
      const configs = await prisma.siteConfig.findMany()
      if (configs.length > 0) {
        const configMap: Record<string, string> = {}
        for (const c of configs) configMap[c.key] = c.value
        return Response.json(configMap)
      }
    } catch { /* fall back to seed */ }
    return Response.json(SEED_CONFIG)
  } catch {
    return Response.json(SEED_CONFIG)
  }
}
