import { prisma } from '@/lib/prisma'
import { SEED_PROJECTS } from '@/lib/seed-data'

export async function GET() {
  try {
    try {
      const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
      if (projects.length > 0) return Response.json(projects)
    } catch { /* fall back to seed */ }
    return Response.json(SEED_PROJECTS)
  } catch {
    return Response.json([])
  }
}
