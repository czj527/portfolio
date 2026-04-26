import { getPrisma } from '@/lib/prisma'
import { SEED_POSTS } from '@/lib/seed-data'

function esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') }

export async function GET() {
  try {
    const prisma = await getPrisma()
    let posts: any[] = []
    if (prisma) {
      try { posts = await prisma.post.findMany({ where: { published: true }, include: { category: { select: { name: true } }, tags: { include: { tag: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' }, take: 20 }) } catch {}
    }
    if (posts.length === 0) posts = SEED_POSTS.filter((p: any) => p.published)
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-lovat-theta-63.vercel.app'
    const items = posts.map((p: any) => `
    <item><title>${esc(p.title)}</title><link>${host}/blog/${p.slug}</link><guid>${host}/blog/${p.slug}</guid><description>${esc(p.excerpt || p.content?.slice(0, 200) || '')}</description><pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>${p.category ? `<category>${esc(p.category.name)}</category>` : ''}${(p.tags || []).map((t: any) => `<category>${esc(t.name || t.tag?.name || '')}</category>`).join('')}</item>`).join('')
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel><title>陈子杰的个人博客</title><link>${host}</link><description>分享技术见解、学习心得和开发经验</description><language>zh-CN</language><atom:link href="${host}/rss.xml" rel="self" type="application/rss+xml"/>\n${items}\n</channel>\n</rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  } catch { return new Response('RSS unavailable', { status: 500 }) }
}
