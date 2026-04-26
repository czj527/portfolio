import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    })
    return Response.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
