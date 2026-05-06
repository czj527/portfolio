import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SeasonParticles } from '@/components/effects/SeasonParticles'

export const metadata: Metadata = {
  title: {
    default: '长岛冰茶的个人博客',
    template: '%s | 长岛冰茶的个人博客',
  },
  description: '展示我的项目、博客和个人简介',
  keywords: ['个人网站', '项目展示', '博客', '技术', '全栈开发'],
  authors: [{ name: '长岛冰茶' }],
  openGraph: {
    title: '长岛冰茶的个人博客',
    description: '展示我的项目、博客和个人简介',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SeasonParticles />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
