import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
    })
    return Response.json(tags)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return Response.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
