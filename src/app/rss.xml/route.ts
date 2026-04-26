import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        category: { select: { name: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${host}/blog/${post.slug}</link>
      <guid>${host}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.content.slice(0, 200))}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ''}
      ${post.tags.map((t) => `<category>${escapeXml(t.tag.name)}</category>`).join('\n      ')}
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

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('RSS generation failed:', error)
    return new Response('Failed to generate RSS', { status: 500 })
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
