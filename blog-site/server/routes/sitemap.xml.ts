import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const siteUrl = 'https://yourdomain.com'

  const urls = [
    `  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>`,
    `  <url><loc>${siteUrl}/blog</loc><priority>0.9</priority></url>`,
    `  <url><loc>${siteUrl}/projects</loc><priority>0.8</priority></url>`,
    `  <url><loc>${siteUrl}/about</loc><priority>0.7</priority></url>`,
    ...posts.map(
      (post) =>
        `  <url><loc>${siteUrl}/blog/${post.slug}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod><priority>0.6</priority></url>`
    ),
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
