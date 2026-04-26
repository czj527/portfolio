import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const links = await prisma.friendLink.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json(links)
  } catch (error) {
    console.error('Failed to fetch friend links:', error)
    return Response.json({ error: 'Failed to fetch friend links' }, { status: 500 })
  }
}
