import type { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

let prismaInstance: PrismaClient | null = null

export async function getPrisma(): Promise<PrismaClient | null> {
  if (prismaInstance) return prismaInstance
  try {
    const { PrismaClient } = await import('@prisma/client')

    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_AUTH_TOKEN

    if (tursoUrl && tursoToken) {
      const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoToken,
      })
      prismaInstance = new PrismaClient({ adapter })
      await prismaInstance.$connect()
      return prismaInstance
    }

    prismaInstance = new PrismaClient()
    await prismaInstance.$connect()
    return prismaInstance
  } catch {
    return null
  }
}
