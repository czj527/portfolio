import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const staticPages = ['/', '/blog', '/projects', '/about', '/archive', '/tags', '/friends']
      .map((path) => `
  <url>
    <loc>${host}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')

    const postPages = posts.map((post) => `
  <url>
    <loc>${host}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages}
  ${postPages}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return new Response('Failed to generate sitemap', { status: 500 })
  }
}
