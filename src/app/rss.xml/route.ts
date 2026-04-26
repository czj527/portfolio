import { prisma } from '@/lib/prisma'
import { SEED_POSTS } from '@/lib/seed-data'

export async function GET() {
  try {
    let posts: any[] = []
    try {
      posts = await prisma.post.findMany({
        where: { published: true },
        include: { category: { select: { name: true } }, tags: { include: { tag: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
    } catch { /* fall back to seed */ }

    if (posts.length === 0) {
      posts = SEED_POSTS.filter(p => p.published)
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-lovat-theta-63.vercel.app'

    const items = posts.map((post: any) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${host}/blog/${post.slug}</link>
      <guid>${host}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.content?.slice(0, 200) || '')}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ''}
      ${(post.tags || []).map((t: any) => `<category>${escapeXml(t.name || t.tag?.name || '')}</category>`).join('\n      ')}
    </item>`).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>陈子杰的个人博客</title>
    <link>${host}</link>
    <description>分享技术见解、学习心得和开发经验</description>
    <language>zh-CN</language>
    <atom:link href="${host}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

    return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  } catch {
    return new Response('RSS unavailable', { status: 500 })
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
