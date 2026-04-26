'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LinkIcon } from 'lucide-react'

interface FriendLink {
  id: number
  name: string
  url: string
  logo: string | null
}

export default function FriendsPage() {
  const [links, setLinks] = useState<FriendLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/friend-links')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLinks(data)
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
        <h1 className="text-4xl font-bold mb-16">友情链接</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse h-24 rounded-xl bg-muted" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无友情链接</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {link.logo || '🔗'}
                </div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">{link.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
