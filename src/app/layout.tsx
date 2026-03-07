import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: {
    default: '我的个人网站',
    template: '%s | 我的个人网站',
  },
  description: '展示我的项目、博客和个人简介',
  keywords: ['个人网站', '项目展示', '博客', '简介'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: '我的个人网站',
    description: '展示我的项目、博客和个人简介',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
