'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Edit, Package, FileText, LogOut, PenTool, Shield, QrCode, KeyRound, Github, ArrowLeft, Smartphone } from 'lucide-react'
import QRCode from 'qrcode'

interface Post {
  id: number; title: string; slug: string; published: boolean; views: number; createdAt: string
  _count: { comments: number; likes: number }
}

type VerifyMethod = 'password' | 'qrcode' | 'github'

const ADMIN_GITHUB = 'czj527'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeMethod, setActiveMethod] = useState<VerifyMethod>('password')

  // Password
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)

  // QR Code
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrToken, setQrToken] = useState('')
  const [qrVerifying, setQrVerifying] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // GitHub
  const [githubUser, setGithubUser] = useState('')
  const [githubVerifying, setGithubVerifying] = useState(false)

  // Dashboard
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({ posts: 0, comments: 0, categories: 0, tags: 0 })

  useEffect(() => {
    const stored = localStorage.getItem('blog_admin')
    if (stored === 'true') setIsAdmin(true)
  }, [])

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin])

  const loadData = async () => {
    try {
      const [postsRes, cats, tags] = await Promise.all([
        fetch('/api/posts?limit=10').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/tags').then(r => r.json()),
      ])
      setRecentPosts(postsRes.posts || [])
      setStats({
        posts: postsRes.total || 0,
        comments: (postsRes.posts || []).reduce((sum: number, p: Post) => sum + (p._count?.comments || 0), 0),
        categories: Array.isArray(cats) ? cats.length : 0,
        tags: Array.isArray(tags) ? tags.length : 0,
      })
    } catch { /* ignore */ }
  }

  const grantAdmin = () => {
    setIsAdmin(true)
    localStorage.setItem('blog_admin', 'true')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('blog_admin')
  }

  // --- Password Login ---
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogging(true); setError('')
    try {
      const res = await fetch('/api/config')
      const config = await res.json()
      if (password === config.admin_password) {
        grantAdmin(); await loadData()
      } else {
        setError('密码错误，请重试')
      }
    } catch {
      setError('验证失败，请稍后重试')
    } finally { setLogging(false) }
  }

  // --- QR Code Login ---
  const generateQrCode = async () => {
    setQrVerifying(true); setError('')
    try {
      const res = await fetch(`/api/auth?action=create&password=admin123`)
      const data = await res.json()
      if (data.error) { setError(data.error); setQrVerifying(false); return }
      setQrToken(data.token)
      const dataUrl = await QRCode.toDataURL(data.url, { width: 220, margin: 2 })
      setQrDataUrl(dataUrl)
      setQrVerifying(false)
      pollQrVerification(data.token)
    } catch {
      setError('生成二维码失败'); setQrVerifying(false)
    }
  }

  const pollQrVerification = (token: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth?action=verify&token=${token}`)
        const data = await res.json()
        if (data.verified) { clearInterval(interval); grantAdmin(); await loadData(); setActiveMethod('password') }
      } catch { /* keep polling */ }
    }, 2000)
    setTimeout(() => { clearInterval(interval); setError('QR 码已过期，请重新生成') }, 5 * 60 * 1000)
  }

  // --- GitHub Verification ---
  const handleGithubVerify = async () => {
    setGithubVerifying(true); setError('')
    try {
      const res = await fetch(`/api/auth?action=github&username=${encodeURIComponent(githubUser.trim())}`)
      const data = await res.json()
      if (data.verified) {
        grantAdmin(); await loadData()
      } else {
        setError(data.error || `只有 @${ADMIN_GITHUB} 才能通过此方式验证`)
      }
    } catch {
      setError('验证失败')
    } finally { setGithubVerifying(false) }
  }

  const handleDeletePost = async (id: number, title: string) => {
    if (!confirm(`确定要删除「${title}」吗？`)) return
    try {
      await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id, password: 'admin123' }) })
      await loadData()
    } catch { /* ignore */ }
  }

  // --- Login Screen ---
  if (!isAdmin) {
    return (
      <div className="pt-24 pb-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">管理后台</h1>
            <p className="text-muted-foreground mt-2">请选择验证方式</p>
          </div>

          {/* Method Tabs */}
          <div className="flex gap-2 mb-6">
            {([
              { id: 'password' as const, icon: KeyRound, label: '密码' },
              { id: 'qrcode' as const, icon: QrCode, label: '扫码' },
              { id: 'github' as const, icon: Github, label: 'GitHub' },
            ]).map(m => (
              <button key={m.id}
                onClick={() => { setActiveMethod(m.id); setError('') }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeMethod === m.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              >
                <m.icon className="w-4 h-4" /> {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Password Form */}
            {activeMethod === 'password' && (
              <motion.form key="pwd" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入管理密码" className="pl-10 text-lg" autoFocus />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <Button type="submit" disabled={logging || !password} className="w-full text-lg">{logging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}{logging ? '验证中...' : '进入管理后台'}</Button>
                <p className="text-center text-xs text-muted-foreground">默认密码: admin123</p>
              </motion.form>
            )}

            {/* QR Code */}
            {activeMethod === 'qrcode' && (
              <motion.div key="qr" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  点击生成二维码，然后用<span className="font-medium text-foreground">手机扫描</span>即可免密码登录
                </p>
                {qrDataUrl ? (
                  <div className="relative inline-block">
                    <img src={qrDataUrl} alt="扫码登录" className="rounded-xl border border-border mx-auto" />
                    {qrVerifying && <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
                  </div>
                ) : (
                  <Button onClick={generateQrCode} disabled={qrVerifying} className="gap-2">
                    {qrVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                    生成二维码
                  </Button>
                )}
                {error && <p className="text-destructive text-sm">{error}</p>}
                {qrDataUrl && !qrVerifying && <p className="text-xs text-muted-foreground"><Smartphone className="w-3 h-3 inline mr-1" />请用手机扫描二维码，5分钟内有效</p>}
              </motion.div>
            )}

            {/* GitHub */}
            {activeMethod === 'github' && (
              <motion.div key="gh" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  输入你的 GitHub 用户名，仅限 <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">@{ADMIN_GITHUB}</code>
                </p>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input value={githubUser} onChange={e => setGithubUser(e.target.value)} placeholder="GitHub 用户名" className="pl-10" autoFocus />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <Button onClick={handleGithubVerify} disabled={githubVerifying || !githubUser.trim()} className="w-full gap-2">
                  {githubVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                  验证 GitHub 身份
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  或使用其他验证方式
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  // --- Dashboard ---
  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">管理后台</h1>
            <p className="text-muted-foreground mt-1">欢迎回来，管理员</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive/30 hover:bg-destructive/10"><LogOut className="w-4 h-4 mr-1" />退出登录</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[['文章总数', stats.posts], ['评论总数', stats.comments], ['分类', stats.categories], ['标签', stats.tags]].map(([label, val]) => (
            <div key={label} className="p-5 rounded-xl border border-border bg-card">
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/blog/new" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-6 h-6 text-primary" /></div><div><div className="font-medium">写新文章</div><div className="text-xs text-muted-foreground">创建并发布博客文章</div></div></Link>
            <Link href="/blog" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><PenTool className="w-6 h-6 text-primary" /></div><div><div className="font-medium">管理文章</div><div className="text-xs text-muted-foreground">编辑或删除已有文章</div></div></Link>
            <Link href="/" className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Package className="w-6 h-6 text-primary" /></div><div><div className="font-medium">返回首页</div><div className="text-xs text-muted-foreground">查看网站前台</div></div></Link>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">最近文章</h2>
          <div className="space-y-3">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div className="min-w-0">
                    <Link href={`/blog/${post.slug}`} className="font-medium text-sm hover:text-primary transition-colors truncate block">{post.title}</Link>
                    <div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('zh-CN')} · {post._count.comments} 评论 · {post._count.likes} 赞 · {post.views} 阅读</div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <Link href={`/blog/${post.slug}?edit=1`}><Button variant="outline" size="sm"><Edit className="w-3 h-3 mr-1" />编辑</Button></Link>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id, post.title)} className="text-destructive border-destructive/30 hover:bg-destructive/10">删除</Button>
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">暂无文章</div>}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
