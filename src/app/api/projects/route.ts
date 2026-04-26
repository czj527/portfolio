import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
    if (body.password !== config?.value) {
      return Response.json({ error: '密码错误' }, { status: 403 })
    }

    if (body.action === 'create') {
      const project = await prisma.project.create({
        data: {
          title: body.title,
          description: body.description,
          techStack: body.techStack || '',
          imageUrl: body.imageUrl || null,
          githubUrl: body.githubUrl || null,
          demoUrl: body.demoUrl || null,
          order: body.order ?? 0,
        },
      })
      return Response.json({ success: true, project })
    }

    if (body.action === 'update') {
      const project = await prisma.project.update({
        where: { id: Number(body.id) },
        data: {
          title: body.title,
          description: body.description,
          techStack: body.techStack,
          imageUrl: body.imageUrl,
          githubUrl: body.githubUrl,
          demoUrl: body.demoUrl,
          order: body.order,
        },
      })
      return Response.json({ success: true, project })
    }

    if (body.action === 'delete') {
      await prisma.project.delete({ where: { id: Number(body.id) } })
      return Response.json({ success: true, message: '已删除' })
    }

    return Response.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error('Project action failed:', error)
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
