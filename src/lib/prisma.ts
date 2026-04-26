import type { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null

export async function getPrisma(): Promise<PrismaClient | null> {
  if (prismaInstance) return prismaInstance
  try {
    const { PrismaClient } = await import('@prisma/client')
    prismaInstance = new PrismaClient()
    await prismaInstance.$connect()
    return prismaInstance
  } catch {
    return null
  }
}
