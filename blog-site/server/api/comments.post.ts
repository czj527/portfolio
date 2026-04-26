import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { postId, author, content, action, commentId } = body

  if (action === 'delete' || action === 'edit') {
    const config = await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } })
    const password = body.password

    if (!password || password !== config?.value) {
      throw createError({ statusCode: 403, message: '密码错误，无权限操作' })
    }

    if (action === 'delete') {
      await prisma.comment.delete({ where: { id: Number(commentId) } })
      return { success: true, message: '评论已删除' }
    }

    if (action === 'edit') {
      await prisma.comment.update({
        where: { id: Number(commentId) },
        data: { content: body.newContent },
      })
      return { success: true, message: '评论已更新' }
    }

    return { success: true }
  }

  if (!postId || !author || !content) {
    throw createError({ statusCode: 400, message: '缺少必要参数' })
  }

  const comment = await prisma.comment.create({
    data: {
      postId: Number(postId),
      author,
      content,
    },
  })

  return { success: true, comment }
})
