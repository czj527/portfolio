'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tag } from 'lucide-react'

interface TagWithCount {
  id: number
  name: string
  slug: string
  _count: { posts: number }
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tags')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setTags(data)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-16">标签云</h1>

        {isLoading ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="animate-pulse h-10 rounded-full bg-muted" style={{ width: `${60 + Math.random() * 120}px` }} />
            ))}
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {tags.map((tag, index) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                  style={{ fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + tag._count.posts * 0.15))}rem` }}
                >
                  {tag.name}
                  <span className="ml-2 text-xs text-muted-foreground">({tag._count.posts})</span>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
