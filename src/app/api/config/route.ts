import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany()
    const configMap: Record<string, string> = {}
    for (const c of configs) {
      configMap[c.key] = c.value
    }
    return Response.json(configMap)
  } catch (error) {
    console.error('Failed to fetch config:', error)
    return Response.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}
