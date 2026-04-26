'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Loader2 } from 'lucide-react'

interface ArchivePost {
  id: number
  title: string
  slug: string
  createdAt: string
}

interface ArchivedGroups {
  [key: string]: ArchivePost[]
}

export default function ArchivePage() {
  const [allPosts, setAllPosts] = useState<ArchivePost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?limit=100&published=true')
      .then(r => r.json())
      .then(data => {
        setAllPosts(data.posts || [])
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const archivedPosts: ArchivedGroups = {}
  for (const post of allPosts) {
    const date = new Date(post.createdAt)
    const key = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`
    if (!archivedPosts[key]) archivedPosts[key] = []
    archivedPosts[key].push(post)
  }

  const groups = Object.entries(archivedPosts)

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-16">文章归档</h1>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-muted rounded w-32 mb-4" />
                <div className="space-y-3 ml-4">
                  {[1, 2, 3].map(j => <div key={j} className="h-4 bg-muted rounded w-3/4" />)}
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无文章</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map(([yearMonth, posts], gi) => (
              <motion.div
                key={yearMonth}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-primary">{yearMonth}</span>
                  <span className="text-sm text-muted-foreground font-normal">({posts.length} 篇)</span>
                </h2>
                <div className="relative ml-4 pl-8 border-l-2 border-border">
                  {posts.map((post, pi) => (
                    <div key={post.id} className="relative pb-8 group">
                      <div className="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <time className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                      </time>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-base font-medium mt-1 group-hover:text-primary transition-colors">{post.title}</h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
