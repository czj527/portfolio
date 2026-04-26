import { prisma } from '@/lib/prisma'
import { SEED_POSTS } from '@/lib/seed-data'

export async function GET() {
  try {
    let allPosts: any[] = []
    try {
      allPosts = await prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, orderBy: { createdAt: 'desc' } })
    } catch { /* fall back to seed */ }
    if (allPosts.length === 0) {
      allPosts = SEED_POSTS.filter(p => p.published)
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-lovat-theta-63.vercel.app'

    const staticUrls = ['/', '/blog', '/projects', '/about', '/archive', '/tags', '/friends', '/guestbook']
      .map(path => `  <url><loc>${host}${path}</loc><changefreq>weekly</changefreq><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')

    const postUrls = allPosts.map((p: any) =>
      `  <url><loc>${host}/blog/${p.slug}</loc><lastmod>${new Date(p.updatedAt || p.createdAt).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    ).join('\n')

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${postUrls}\n</urlset>`, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  } catch {
    return new Response('Sitemap unavailable', { status: 500 })
  }
}
