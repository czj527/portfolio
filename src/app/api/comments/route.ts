import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, author, content, action, commentId, password, newContent } = body

    if (action === 'delete' || action === 'edit') {
      const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
      if (!password || password !== config?.value) {
        return Response.json({ error: '密码错误，无权限操作' }, { status: 403 })
      }

      if (action === 'delete') {
        await prisma.comment.delete({ where: { id: Number(commentId) } })
        return Response.json({ success: true, message: '评论已删除' })
      }

      if (action === 'edit') {
        await prisma.comment.update({
          where: { id: Number(commentId) },
          data: { content: newContent },
        })
        return Response.json({ success: true, message: '评论已更新' })
      }
    }

    if (!postId || !author || !content) {
      return Response.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        author,
        content,
      },
    })

    return Response.json({ success: true, comment })
  } catch (error) {
    console.error('Comment action failed:', error)
    return Response.json({ error: '操作失败' }, { status: 500 })
  }
}
