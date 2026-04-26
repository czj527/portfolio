'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Mail, Menu, X } from 'lucide-react'
import { useAdmin } from '@/hooks/use-admin'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '归档', path: '/archive' },
  { name: '项目', path: '/projects' },
  { name: '留言', path: '/guestbook' },
  { name: '标签', path: '/tags' },
  { name: '友链', path: '/friends' },
  { name: '关于', path: '/about' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isAdmin, logout } = useAdmin()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.6 0.2 200) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'var(--primary)',
              }}
            >
              Portfolio
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {isAdmin && (
              <>
                <Link href="/blog/new">
                  <Button size="sm" className="h-8">
                    写文章
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="h-8">管理</Button>
                </Link>
                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={logout}>退出</Button>
              </>
            )}
            {!isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="h-8 text-muted-foreground">管理</Button>
              </Link>
            )}
            <ThemeToggle />
            <motion.a
              href="https://github.com/czj527"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="mailto:2719398856@qq.com"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <hr className="border-border" />
              {isAdmin ? (
                <>
                  <Link href="/blog/new" className="block px-4 py-2 text-sm font-medium text-primary">✏️ 写文章</Link>
                  <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-muted-foreground">⚙️ 管理后台</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm font-medium text-destructive">退出管理</button>
                </>
              ) : (
                <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-muted-foreground">🔐 管理员登录</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
