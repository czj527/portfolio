import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const configs = await prisma.siteConfig.findMany()
  const configMap: Record<string, string> = {}
  for (const c of configs) {
    configMap[c.key] = c.value
  }
  return configMap
})
