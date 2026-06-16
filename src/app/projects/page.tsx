'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Folder } from 'lucide-react'
import ProjectCard, { statusConfig } from '@/components/ProjectCard'

interface Project {
  id: number
  title: string
  description: string
  techStack: string
  imageUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  order: number
  status?: string
  createdAt: string
}

const statusOrder: Record<string, number> = {
  developing: 0,
  validating: 1,
  maintaining: 2,
  completed: 3,
  abandoned: 4,
}

const statusTitle: Record<string, string> = {
  developing: '开发中',
  validating: '验证中',
  maintaining: '维护中',
  completed: '已完成',
  abandoned: '已废弃',
}

const statusIcon: Record<string, string> = {
  developing: '🚀',
  validating: '🧪',
  maintaining: '🔧',
  completed: '✅',
  abandoned: '📦',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    developing: true,
    validating: true,
    maintaining: true,
  })

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.sort((a: Project, b: Project) => a.order - b.order)
          setProjects(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const grouped: Record<string, Project[]> = {}
  for (const p of projects) {
    const s = p.status || 'maintaining'
    if (!grouped[s]) grouped[s] = []
    grouped[s].push(p)
  }

  const orderedGroups = Object.keys(grouped).sort((a, b) => (statusOrder[a] ?? 9) - (statusOrder[b] ?? 9))

  const toggleExpand = (s: string) => setExpanded(prev => ({ ...prev, [s]: !prev[s] }))

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">我的项目</h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse p-6 rounded-xl border border-border bg-card">
                <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground text-lg">暂无项目</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">我的项目</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            这里展示了我参与和开发的各种项目
          </p>
          {/* 图例 */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {Object.entries(statusConfig).map(([key, c]) => (
              <span key={key} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <span className={`w-1.5 h-1.5 rounded-full ${c.color}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {orderedGroups.map(status => {
            const list = grouped[status]
            const isExpanded = expanded[status] ?? true
            const statusLabel = statusTitle[status] || status

            return (
              <section key={status}>
                <button
                  onClick={() => toggleExpand(status)}
                  className="flex items-center gap-2 mb-4 group cursor-pointer w-full text-left"
                >
                  <span className="text-lg">{statusIcon[status] || '📌'}</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {statusLabel}
                  </h2>
                  <span className="text-sm text-slate-400">({list.length})</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                      >
                        {list.map(p => (
                          <motion.div key={p.id} variants={itemVariants}>
                            <ProjectCard project={p} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
