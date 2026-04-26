import { getPrisma } from '@/lib/prisma'
import { SEED_POSTS } from '@/lib/seed-data'

export async function GET() {
  try {
    const prisma = await getPrisma()
    let slugs: any[] = []
    if (prisma) {
      try { slugs = await prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, orderBy: { createdAt: 'desc' } }) } catch {}
    }
    if (slugs.length === 0) slugs = SEED_POSTS.filter((p: any) => p.published)
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-lovat-theta-63.vercel.app'
    const statics = ['/', '/blog', '/projects', '/about', '/archive', '/tags', '/friends', '/guestbook'].map(p => `  <url><loc>${host}${p}</loc><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')
    const posts = slugs.map((p: any) => `  <url><loc>${host}/blog/${p.slug}</loc><lastmod>${new Date(p.updatedAt || p.createdAt).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${statics}\n${posts}\n</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  } catch { return new Response('Sitemap unavailable', { status: 500 }) }
}
