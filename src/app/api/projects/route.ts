import { getPrisma } from '@/lib/prisma'
import { SEED_PROJECTS } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    if (prisma) {
      try { const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } }); if (projects.length > 0) return Response.json(projects) } catch {}
    }
    return Response.json(SEED_PROJECTS)
  } catch { return Response.json([]) }
}
