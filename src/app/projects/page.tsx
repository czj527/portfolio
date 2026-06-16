'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Folder, ChevronDown } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  techStack: string
  imageUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  order: number
  active?: boolean
  createdAt: string
}

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // 按 order 排序
          data.sort((a: Project, b: Project) => a.order - b.order)
          setProjects(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const activeProjects = projects.filter(p => p.active !== false)
  const archivedProjects = projects.filter(p => p.active === false)

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">我的项目</h1>
            <p className="text-xl text-muted-foreground">这里展示了我参与和开发的各种项目</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse p-6 rounded-2xl border border-border bg-card">
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

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">我的项目</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            这里展示了我参与和开发的各种项目
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">暂无项目</p>
          </div>
        ) : (
          <>
            {/* 活跃项目 */}
            {activeProjects.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-lg font-medium text-muted-foreground">正在进行</h2>
                  <span className="text-sm text-muted-foreground/50">({activeProjects.length})</span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </motion.div>
              </div>
            )}

            {/* 展开归档项目 */}
            {archivedProjects.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group flex items-center gap-2 mx-auto px-6 py-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
                >
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">
                    {showAll ? '收起' : `查看更多项目（${archivedProjects.length}）`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showAll && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 mb-2">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <h2 className="text-lg font-medium text-muted-foreground">归档项目</h2>
                          <span className="text-sm text-muted-foreground/50">({archivedProjects.length})</span>
                        </div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                          {archivedProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className={`group p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-500 ${!project.active ? 'opacity-70' : ''}`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Folder className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
      {project.techStack && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.split(',').map((tech) => (
            <span key={tech} className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground font-mono">
              {tech.trim()}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Github className="w-4 h-4" /> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" /> Demo
          </a>
        )}
      </div>
    </motion.div>
  )
}
