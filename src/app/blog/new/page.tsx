'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/hooks/use-admin'
import TiptapEditor from '@/components/TiptapEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft, Save, Send } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

function NewBlogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin } = useAdmin()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(console.error)
    fetch('/api/tags').then(r => r.json()).then(setTags).catch(console.error)
  }, [])

  const handleSubmit = async (published: boolean) => {
    if (!title || !content) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title,
          slug: slug || undefined,
          excerpt: excerpt || undefined,
          content,
          categoryId,
          tagIds: selectedTagIds,
          pinned,
          published,
          password: 'admin123',
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || '保存失败')
        return
      }
      router.push('/blog')
    } catch (e) {
      console.error('Save failed:', e)
      alert('保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (id: number) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold mb-4">需要管理员权限</h1>
          <p className="text-muted-foreground mb-8">请先登录管理后台后再写文章</p>
          <Link href="/admin">
            <Button>
              前往管理后台登录
            </Button>
          </Link>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回博客
            </Link>
            <h1 className="text-3xl font-bold">写文章</h1>
          </div>
        </div>

        <div className="space-y-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
            className="text-lg font-semibold"
          />
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="URL 标识 (留空自动生成)"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="文章摘要（可选）"
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <TiptapEditor value={content} onChange={setContent} placeholder="开始写作..." />

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">分类：</label>
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm"
              >
                <option value="">无分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="rounded"
              />
              置顶
            </label>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">标签：</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Link href="/blog">
              <Button variant="outline">取消</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              <Save className="w-4 h-4 mr-1" /> 保存草稿
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={submitting || !title || !content}
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
              发布文章
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function NewBlogPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">加载中...</div>}>
      <NewBlogContent />
    </Suspense>
  )
}
