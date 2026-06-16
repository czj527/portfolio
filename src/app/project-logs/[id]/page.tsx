'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Log {
  id: string
  content: string
  type: string
  created_at: string
}

const typeConfig: Record<string, { color: string; label: string }> = {
  progress: { color: 'bg-emerald-400', label: '进度' },
  milestone: { color: 'bg-amber-400', label: '里程碑' },
  note: { color: 'bg-slate-400', label: '笔记' },
}

export default function ProjectLogsPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<{ title: string; description: string } | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [newLog, setNewLog] = useState('')
  const [logType, setLogType] = useState('progress')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/projects`)
      .then(r => r.json())
      .then(data => {
        const p = data.find((p: any) => String(p.id) === String(id))
        if (p) setProject({ title: p.title, description: p.description })
      })
      .catch(() => {})

    fetch('/api/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: 'project_logs',
        action: 'select',
        filters: {
          eq: { project_id: String(id) },
          order: { field: 'created_at', ascending: false },
        },
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.data) setLogs(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

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
            project_id: String(id),
            content: newLog.trim(),
            type: logType,
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '请求失败')
      }
      const data = await res.json()
      if (data.data) {
        setLogs(prev => [data.data, ...prev])
      }
      setNewLog('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回项目
        </Link>

        {project && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="mt-1 text-muted-foreground">开发日志</p>
          </motion.div>
        )}

        {/* 写日志 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl border bg-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">写日志</span>
            <div className="flex gap-1.5 ml-auto">
              {(['progress', 'milestone', 'note'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setLogType(t)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    logType === t
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {typeConfig[t].label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={newLog}
            onChange={e => setNewLog(e.target.value)}
            placeholder="记录一下开发进展..."
            rows={4}
            className="w-full text-sm p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !newLog.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 提交中</>
              ) : (
                '发布日志'
              )}
            </button>
          </div>
        </motion.div>

        {/* 日志列表 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-card border animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-muted-foreground">还没有开发日志，写第一条吧</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-5 rounded-xl border bg-card hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${typeConfig[log.type]?.color || 'bg-slate-400'}`} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {typeConfig[log.type]?.label || log.type}
                  </span>
                  <span className="text-xs text-muted-foreground/50">
                    {new Date(log.created_at).toLocaleDateString('zh-CN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
