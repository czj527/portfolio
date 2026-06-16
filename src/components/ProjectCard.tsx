'use client'

import { Github, ExternalLink } from 'lucide-react'

interface ProjectData {
  id: number | string
  title: string
  description: string
  techStack: string
  status?: string
  imageUrl?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
  order?: number
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  developing:  { color: 'bg-emerald-400',  bg: 'bg-emerald-500/10',  label: '开发中' },
  validating:  { color: 'bg-amber-400',    bg: 'bg-amber-500/10',     label: '验证中' },
  maintaining: { color: 'bg-blue-400',     bg: 'bg-blue-500/10',      label: '维护中' },
  completed:   { color: 'bg-slate-400',    bg: 'bg-slate-500/10',     label: '已完成' },
  abandoned:   { color: 'bg-muted-foreground/50', bg: 'bg-muted',     label: '已废弃' },
}

function StatusDot({ status }: { status?: string }) {
  const c = statusConfig[status || ''] || statusConfig.maintaining
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${c.color} ${status === 'developing' ? 'animate-pulse' : ''}`} />
      <span className={`text-xs px-1.5 py-0.5 rounded ${c.bg}`}>{c.label}</span>
    </span>
  )
}

export default function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <div className="group p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <StatusDot status={project.status} />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {project.techStack && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.split(/[,，、]/).map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
            <Github className="w-4 h-4" /> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" /> Demo
          </a>
        )}
      </div>
    </div>
  )
}

export { statusConfig }
