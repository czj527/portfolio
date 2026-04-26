'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Calendar, Tag, ArrowRight, Edit, Trash2, Loader2 } from 'lucide-react'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Post {
  id: number
  title: string
  excerpt: string | null
  slug: string
  pinned: boolean
  views: number
  createdAt: string
  category: { name: string; slug: string } | null
  tags: { id: number; name: string; slug: string }[]
  _count: { comments: number; likes: number }
}

interface Category {
  id: number
  name: string
  slug: string
  _count: { posts: number }
}

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
}

const POSTS_PER_PAGE = 9

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

function BlogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin } = useAdmin()

  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const page = parseInt(searchParams.get('page') || '1')
  const activeCategory = searchParams.get('category') || ''
  const activeTag = searchParams.get('tag') || ''
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (Array.isArray(data)) setCategories(data)
    } catch (e) {
      console.error('Failed to load categories:', e)
    }
  }, [])

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(POSTS_PER_PAGE))
      if (activeCategory) params.set('category', activeCategory)
      if (activeTag) params.set('tag', activeTag)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/posts?${params.toString()}`)
      const data: PostsResponse = await res.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      console.error('Failed to load posts:', e)
    } finally {
      setIsLoading(false)
    }
  }, [page, activeCategory, activeTag, searchQuery])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`?${params.toString()}`)
  }

  const handleCategoryChange = (slug: string) => {
    updateUrl({ category: slug || '', tag: '', page: '1' })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchParams.get('search')) {
        updateUrl({ search: searchQuery, page: '1' })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: String(newPage) })
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确定要删除「${title}」吗？`)) return
    setDeletingId(id)
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, password: 'admin123' }),
      })
      await loadPosts()
    } catch (e) {
      console.error('Failed to delete:', e)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">技术博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            分享技术见解、学习心得和开发经验
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="搜索文章..."
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !activeCategory && !activeTag
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-muted-foreground hover:bg-primary/10'
            }`}
          >
            全部 ({total})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {cat.name} ({cat._count.posts})
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl p-6">
                <div className="h-40 bg-muted rounded-2xl mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-muted-foreground text-lg">暂无文章</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow card-hover"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {post.pinned && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                        置顶
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-4xl">📝</div>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.category && (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {post.category.name}
                      </span>
                    )}
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="px-2.5 py-1 text-xs rounded-full bg-accent text-muted-foreground">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                    <span>· {post._count.comments} 评论</span>
                    <span>· {post._count.likes} 赞</span>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <Link href={`/blog/${post.slug}?edit=1`}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Edit className="w-4 h-4 mr-1" /> 编辑
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        删除
                      </Button>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              ← 上一页
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              下一页 →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function BlogFallback() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogFallback />}>
      <BlogContent />
    </Suspense>
  )
}
