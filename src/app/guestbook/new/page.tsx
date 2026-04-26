'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, User, Mail, Send, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EMOJI_LIST = ['😀', '😎', '🎉', '💪', '🚀', '❤️', '🔥', '✨', '🌟', '💡', '🙌', '😍', '🤔', '👍', '🎵']

export default function NewMessagePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState(EMOJI_LIST[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('留言内容不能为空')
      return
    }
    if (content.length > 500) {
      setError('内容太长（最多500个字符）')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          content: content.trim(),
          emoji,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '提交失败')
        return
      }
      setShowSuccess(true)
      setTimeout(() => router.push('/guestbook'), 1500)
    } catch (e) {
      console.error('Submit guestbook failed:', e)
      setError('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="pt-24 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center py-20"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-2">留言提交成功！</h2>
          <p className="text-muted-foreground">正在返回留言板...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <Link href="/guestbook" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回留言板
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-primary/10">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">给我留言</h1>
          <p className="text-muted-foreground">欢迎在这里留下你的想法和建议</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </motion.div>
        )}

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">选择表情</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_LIST.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-11 h-11 text-xl rounded-lg transition-all ${
                      emoji === em
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> 姓名（可选）
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的名字"
                maxLength={64}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> 邮箱（可选）
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱"
                maxLength={128}
              />
              {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="mt-1 text-sm text-destructive">请输入有效的邮箱地址</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> 留言内容 <span className="text-destructive">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="写下你想说的话..."
                required
                maxLength={500}
              />
              <p className="mt-1 text-sm text-muted-foreground">{content.length}/500</p>
            </div>

            <Button type="submit" disabled={isSubmitting || !content.trim()} className="w-full gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 提交中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> 提交留言
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">📝 填写提示：</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>· 姓名和邮箱都是可选的，可以匿名留言</li>
              <li>· 选择一个表情来表达你的心情</li>
              <li>· 留言内容不能为空，最多 500 字符</li>
              <li>· 留言内容将公开显示，请文明发言</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
