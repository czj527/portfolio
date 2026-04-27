import { getPrisma } from '@/lib/prisma'
import QRCode from 'qrcode'

const tokens = new Map<string, { expires: number }>()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const token = searchParams.get('token')

    if (action === 'qrcode') {
      const prisma = await getPrisma()
      const config = prisma ? (await prisma.siteConfig.findUnique({ where: { key: 'admin_password' } }).catch(() => null)) : null
      const password = searchParams.get('password')
      if (password !== (config?.value || 'admin123')) {
        return Response.json({ error: '密码错误' }, { status: 403 })
      }
      const code = Math.random().toString(36).slice(2, 10)
      tokens.set(code, { expires: Date.now() + 5 * 60 * 1000 })
      const url = `${getHost(request)}/api/auth?action=verify&token=${code}`
      const dataUrl = await QRCode.toDataURL(url, { width: 220, margin: 2 })
      return Response.json({ token: code, qrDataUrl: dataUrl })
    }

    if (action === 'verify' && token) {
      const record = tokens.get(token)
      if (!record || Date.now() > record.expires) {
        return Response.json({ verified: false, error: 'Token 已过期或不存在' })
      }
      tokens.delete(token)
      return Response.json({ verified: true, message: '验证成功' })
    }

    if (action === 'github') {
      const username = searchParams.get('username')
      if (username === 'czj527') {
        return Response.json({ verified: true, message: 'GitHub 验证通过' })
      }
      return Response.json({ verified: false, error: '非授权用户' })
    }

    return Response.json({ error: '未知操作' }, { status: 400 })
  } catch {
    return Response.json({ error: '验证失败' }, { status: 500 })
  }
}

function getHost(request: Request): string {
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}
