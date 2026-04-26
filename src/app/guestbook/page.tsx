'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, Calendar, Edit, Plus, Loader2 } from 'lucide-react'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GuestbookMessage {
  id: number
  name: string | null
  email: string | null
  content: string
  emoji: string
  likes: number
  createdAt: string
}

const EMOJI_LIST = ['😀', '😎', '🎉', '💪', '🚀', '❤️', '🔥', '✨', '🌟', '💡', '🙌', '😍', '🤔', '👍', '🎵']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function GuestbookPage() {
  const { isAdmin } = useAdmin()
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likingId, setLikingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/guestbook')
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } catch (e) {
      console.error('Failed to load guestbook:', e)
      setError('加载留言失败')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleLike = async (id: number) => {
    setLikingId(id)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id }),
      })
      const data = await res.json()
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: data.likes } : m))
      }
    } catch (e) {
      console.error('Like failed:', e)
    } finally {
      setLikingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条留言吗？')) return
    setDeletingId(id)
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, password: 'admin123' }),
      })
      await loadMessages()
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const displayName = (msg: GuestbookMessage) => msg.name || '匿名用户'

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">留言板</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            欢迎在这里留下你的想法和建议！
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <Link href="/guestbook/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              给我留言
            </Button>
          </Link>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">所有留言</h2>
            <span className="text-sm text-muted-foreground">{messages.length} 条留言</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">还没有留言，快来抢沙发吧！</p>
              <Link href="/guestbook/new">
                <Button>发表第一条留言</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{msg.emoji}</div>
                      <div>
                        <p className="font-medium">{displayName(msg)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(msg.id)}
                        disabled={likingId === msg.id}
                        className="gap-1"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs">{msg.likes}</span>
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(msg.id)}
                          disabled={deletingId === msg.id}
                          className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {deletingId === msg.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '删除'}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10 text-center text-sm text-muted-foreground">
          <p>💡 文明发言，友善交流</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
