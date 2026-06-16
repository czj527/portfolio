'use client'

import { useState, useEffect } from 'react'
import { Github, ExternalLink, MessageSquare, Plus, X, Lock } from 'lucide-react'

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

interface Log {
  id: string
  project_id: string
  content: string
  type: string
  created_at: string
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  developing:  { color: 'bg-emerald-400',  bg: 'bg-emerald-500/10',  label: '开发中' },
  validating:  { color: 'bg-amber-400',    bg: 'bg-amber-500/10',     label: '验证中' },
  maintaining: { color: 'bg-blue-400',     bg: 'bg-blue-500/10',      label: '维护中' },
  completed:   { color: 'bg-slate-400',    bg: 'bg-slate-500/10',     label: '已完成' },
  abandoned:   { color: 'bg-muted-foreground/50', bg: 'bg-muted',     label: '已废弃' },
}

const typeLabels: Record<string, string> = {
  progress: '进度',
  milestone: '里程碑',
  note: '笔记',
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
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])
  const [logCount, setLogCount] = useState(0)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [writing, setWriting] = useState(false)
  const [newLog, setNewLog] = useState('')
  const [logType, setLogType] = useState('note')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchLogs = async () => {
    setLoadingLogs(true)
    try {
      const res = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'project_logs',
          action: 'select',
          filters: {
            select: 'id, content, type, created_at',
            eq: { project_id: String(project.id) },
            order: { field: 'created_at', ascending: false },
            limit: 20,
          },
        }),
      })
      const data = await res.json()
      if (data.data) {
        setLogs(data.data)
        setLogCount(data.data.length)
      }
    } catch (e) {
      console.error('Failed to fetch logs:', e)
    } finally {
      setLoadingLogs(false)
    }
  }

  const fetchLogCount = async () => {
    try {
      const res = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'project_logs',
          action: 'select',
          filters: {
            select: 'id',
            eq: { project_id: String(project.id) },
          },
        }),
      })
      const data = await res.json()
      if (data.data) setLogCount(data.data.length)
    } catch {}
  }

  useEffect(() => {
    fetchLogCount()
  }, [project.id])

  const handleToggleLogs = () => {
    if (!showLogs) {
      fetchLogs()
    }
    setShowLogs(!showLogs)
  }

  const handleSubmit = async () => {
    if (!newLog.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'project_logs',
          action: 'insert',
          data: {
            project_id: String(project.id),
            content: newLog.trim(),
            type: logType,
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '请求失败')
      }
      setNewLog('')
      setWriting(false)
      fetchLogs()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

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
        <button
          onClick={handleToggleLogs}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors ml-auto"
        >
          <MessageSquare className="w-4 h-4" />
          日志
          {logCount > 0 && <span className="text-xs">({logCount})</span>}
        </button>
      </div>

      {/* 日志展开区 */}
      {showLogs && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">开发日志</span>
            <button
              onClick={() => setWriting(!writing)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus className="w-3 h-3" /> 写日志
            </button>
          </div>

          {/* 写日志表单 */}
          {writing && (
            <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex gap-2 mb-2">
                {(['progress', 'milestone', 'note'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setLogType(t)}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      logType === t
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
              <textarea
                value={newLog}
                onChange={e => setNewLog(e.target.value)}
                placeholder="记录开发进展..."
                rows={3}
                className="w-full text-sm p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !newLog.trim()}
                  className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {submitting ? '提交中...' : '提交'}
                </button>
                <button
                  onClick={() => { setWriting(false); setError('') }}
                  className="px-3 py-1 text-xs rounded border border-slate-200 dark:border-slate-700"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 日志列表 */}
          {loadingLogs ? (
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">暂无日志</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    log.type === 'milestone' ? 'bg-amber-400' :
                    log.type === 'progress' ? 'bg-emerald-400' : 'bg-slate-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                      {log.content}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(log.created_at).toLocaleDateString('zh-CN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { statusConfig }
