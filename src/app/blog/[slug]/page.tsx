'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Tag, ArrowLeft, Heart, MessageSquare, Share2, Loader2, Edit, Trash2, Send } from 'lucide-react'

interface Tag {
  id: number
  name: string
  slug: string
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  createdAt: string
  category: { name: string; slug: string } | null
  _count: { comments: number; likes: number }
}

interface PostDetail {
  id: number
  title: string
  content: string
  excerpt: string | null
  slug: string
  published: boolean
  pinned: boolean
  views: number
  createdAt: string
  category: Category | null
  tags: Tag[]
  comments: Comment[]
  _count: { comments: number; likes: number }
  relatedPosts: RelatedPost[]
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

function BlogDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin } = useAdmin()
  const slug = params.slug as string

  const [post, setPost] = useState<PostDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const loadPost = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/posts/${slug}`)
      if (!res.ok) {
        setError(res.status === 404 ? '文章不存在' : '加载失败')
        return
      }
      const data: PostDetail = await res.json()
      setPost(data)
      setLikeCount(data._count.likes)
      setEditTitle(data.title)
      setEditContent(data.content)
    } catch (e) {
      console.error('Failed to load post:', e)
      setError('加载失败')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  useEffect(() => {
    if (searchParams.get('edit') === '1' && isAdmin) {
      setEditMode(true)
    }
  }, [searchParams, isAdmin])

  const handleToggleLike = async () => {
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post?.id }),
      })
      const data = await res.json()
      setLiked(data.liked)
      if (data.count !== undefined) setLikeCount(data.count)
    } catch (e) {
      console.error('Like failed:', e)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentAuthor.trim() || !commentContent.trim()) return
    setCommentSubmitting(true)
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post?.id, author: commentAuthor, content: commentContent }),
      })
      setCommentAuthor('')
      setCommentContent('')
      await loadPost()
    } catch (e) {
      console.error('Comment failed:', e)
    } finally {
      setCommentSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('确定要删除这条评论吗？')) return
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', commentId, password: 'admin123' }),
      })
      await loadPost()
    } catch (e) {
      console.error('Delete comment failed:', e)
    }
  }

  const handleSaveEdit = async () => {
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: post?.id, title: editTitle, content: editContent, password: 'admin123' }),
      })
      setEditMode(false)
      await loadPost()
    } catch (e) {
      console.error('Save failed:', e)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('确定要删除这篇文章吗？')) return
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: post?.id, password: 'admin123' }),
      })
      router.push('/blog')
    } catch (e) {
      console.error('Delete failed:', e)
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      return
    }
    if (platform === 'weibo') {
      window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
    }
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
    }
  }

  const renderContent = (content: string) => {
    let html = content
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')
    html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    html = html.replace(/(<li class="ml-4 list-disc">.*<\/li>\n?)+/g, '<ul class="my-3 space-y-1">$&</ul>')
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>')
    html = html.replace(/^(?!<[^>]*>)(.+)$/gm, (m: string) => {
      if (m.startsWith('<')) return m
      if (m.trim() === '') return ''
      return `<p class="my-3 leading-relaxed">${m}</p>`
    })
    return html
  }

  const readingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '').replace(/[#*\-`>]/g, '')
    const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const en = text.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil((cn + en) / 400))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded mt-8" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-lg mb-4">{error || '文章不存在'}</p>
          <Link href="/blog" className="text-primary hover:underline">← 返回博客</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <article>
          <div className="mb-10">
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回博客
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <Link href={`/blog?category=${post.category.slug}`} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {post.category.name}
                </Link>
              )}
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/blog?tag=${tag.slug}`} className="px-3 py-1 text-sm rounded-full bg-accent text-muted-foreground hover:bg-accent/80 transition-colors">
                  <Tag className="w-3 h-3 inline mr-1" />{tag.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.createdAt)}</span>
              <span>· {readingTime(post.content)} 分钟阅读</span>
              <span>· {post.views + 1} 次阅读</span>
            </div>

            {isAdmin && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-6 p-4 rounded-xl bg-muted/50">
                <Button onClick={() => setEditMode(true)} size="sm">
                  <Edit className="w-4 h-4 mr-1" /> 编辑文章
                </Button>
                <Button onClick={handleDeletePost} variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" /> 删除文章
                </Button>
              </motion.div>
            )}
          </div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border">
            <span className="text-sm text-muted-foreground">分享文章：</span>
            <Button variant="ghost" size="sm" onClick={() => handleShare('weibo')} className="text-muted-foreground">微博</Button>
            <Button variant="ghost" size="sm" onClick={() => handleShare('twitter')} className="text-muted-foreground">Twitter</Button>
            <Button variant="ghost" size="sm" onClick={() => handleShare('copy')} className="text-muted-foreground">
              <Share2 className="w-4 h-4" /> 复制链接
            </Button>
          </div>
        </article>

        <section className="mt-16">
          <div className="flex items-center gap-4 mb-10">
            <Button
              variant="outline"
              onClick={handleToggleLike}
              className={`flex items-center gap-2 ${liked ? 'text-red-500 border-red-500/30' : ''}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> {post._count.comments} 条评论
            </span>
          </div>

          <h3 className="text-xl font-bold mb-6">评论 ({post.comments.length})</h3>

          <form onSubmit={handleSubmitComment} className="mb-8 p-6 rounded-xl bg-muted/30">
            <div className="space-y-3">
              <Input
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="你的昵称"
                required
              />
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="写下你的评论..."
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={commentSubmitting || !commentAuthor || !commentContent} size="sm">
                  {commentSubmitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                  发表评论
                </Button>
              </div>
            </div>
          </form>

          {post.comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">暂无评论，快来抢沙发吧</div>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground ml-3">{formatDate(comment.createdAt)}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-500 transition-all"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{comment.content}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {post.relatedPosts.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-bold mb-6">相关文章</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {post.relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`}>
                  <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all card-hover">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{rp.title}</h4>
                    <span className="text-xs text-muted-foreground">{formatDate(rp.createdAt)}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>

      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setEditMode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">编辑文章</h2>
              <div className="space-y-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="文章标题"
                  className="text-lg font-semibold"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="文章内容 (Markdown)"
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setEditMode(false)}>取消</Button>
                  <Button onClick={handleSaveEdit}>
                    <Edit className="w-4 h-4 mr-1" /> 保存
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BlogDetailFallback() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded mt-8" />
      </div>
    </div>
  )
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<BlogDetailFallback />}>
      <BlogDetailContent />
    </Suspense>
  )
}
