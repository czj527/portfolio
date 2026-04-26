'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Edit, Package, FileText, LogOut, PenTool } from 'lucide-react'

interface Post {
  id: number
  title: string
  slug: string
  published: boolean
  views: number
  createdAt: string
  _count: { comments: number; likes: number }
}

export default function AdminPage() {
  const { isAdmin, login, logout } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)

  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({ posts: 0, comments: 0, categories: 0, tags: 0 })

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin])

  const loadData = async () => {
    try {
      const [postsRes, categories, tags] = await Promise.all([
        fetch('/api/posts?limit=10').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/tags').then(r => r.json()),
      ])
      setRecentPosts(postsRes.posts || [])
      setStats({
        posts: postsRes.total || 0,
        comments: (postsRes.posts || []).reduce((sum: number, p: Post) => sum + (p._count?.comments || 0), 0),
        categories: Array.isArray(categories) ? categories.length : 0,
        tags: Array.isArray(tags) ? tags.length : 0,
      })
    } catch (e) {
      console.error('Failed to load admin data:', e)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogging(true)
    setError('')
    const success = await login(password)
    if (success) {
      await loadData()
    } else {
      setError('密码错误，请重试')
    }
    setLogging(false)
  }

  const handleDeletePost = async (id: number, title: string) => {
    if (!confirm(`确定要删除「${title}」吗？`)) return
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, password: 'admin123' }),
      })
      await loadData()
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">管理后台</h1>
            <p className="text-muted-foreground mt-2">请输入密码以进行管理操作</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入管理密码"
                className="pl-10 text-lg"
                autoFocus
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <Button type="submit" disabled={logging || !password} className="w-full text-lg">
              {logging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {logging ? '验证中...' : '进入管理后台'}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">默认密码: admin123</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">管理后台</h1>
            <p className="text-muted-foreground mt-1">欢迎回来，管理员</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-1" /> 退出登录
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="text-2xl font-bold">{stats.posts}</div>
            <div className="text-sm text-muted-foreground">文章总数</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="text-2xl font-bold">{stats.comments}</div>
            <div className="text-sm text-muted-foreground">评论总数</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="text-sm text-muted-foreground">分类</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="text-2xl font-bold">{stats.tags}</div>
            <div className="text-sm text-muted-foreground">标签</div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/blog/new" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">写新文章</div>
                <div className="text-xs text-muted-foreground">创建并发布博客文章</div>
              </div>
            </Link>
            <Link href="/blog" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">管理文章</div>
                <div className="text-xs text-muted-foreground">编辑或删除已有文章</div>
              </div>
            </Link>
            <Link href="/" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">返回首页</div>
                <div className="text-xs text-muted-foreground">查看网站前台</div>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">最近文章</h2>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} title={post.published ? '已发布' : '草稿'} />
                  <div className="min-w-0">
                    <Link href={`/blog/${post.slug}`} className="font-medium text-sm hover:text-primary transition-colors truncate block">
                      {post.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')} · {post._count.comments} 评论 · {post._count.likes} 赞 · {post.views} 阅读
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <Link href={`/blog/${post.slug}?edit=1`}>
                    <Button variant="outline" size="sm"><Edit className="w-3 h-3 mr-1" />编辑</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id, post.title)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    删除
                  </Button>
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">暂无文章</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
