'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, X, Lock, Unlock, Save, Trash2, Move } from 'lucide-react'

interface Agent {
  id: string; name: string; role: string; platform: string
  position_x: number; position_y: number
  skills: Skill[]; documents: Document[]
}
interface Skill { id: string; agent_id: string; name: string; description: string }
interface Document { id: string; agent_id: string; name: string; description: string }

const CANVAS_W = 1200
const CANVAS_H = 900

export default function WorkflowPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [addingSkillFor, setAddingSkillFor] = useState<string | null>(null)
  const [addingDocFor, setAddingDocFor] = useState<string | null>(null)
  const dragRef = useRef<{ id: string; startX: number; startY: number; mouseX: number; mouseY: number } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [aRes, sRes, dRes] = await Promise.all([
      fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_agents', action: 'select' }) }),
      fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_skills', action: 'select' }) }),
      fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_documents', action: 'select' }) }),
    ])
    const [a, s, d] = await Promise.all([aRes.json(), sRes.json(), dRes.json()])
    const skills: Skill[] = s.data || []
    const docs: Document[] = d.data || []
    const merged = (a.data || []).map((ag: any) => ({
      ...ag,
      skills: skills.filter(sk => sk.agent_id === ag.id),
      documents: docs.filter(dc => dc.agent_id === ag.id),
    }))
    setAgents(merged)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const unlockEdit = async () => {
    setAuthError('')
    try {
      const res = await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'site_config', action: 'select', filters: { eq: { key: 'admin_password' } } }) })
      const d = await res.json()
      const pwd = d.data?.[0]?.value || 'admin123'
      if (password === pwd) { setEditMode(true); setPassword('') }
      else setAuthError('密码错误')
    } catch { setEditMode(true) }
  }

  const saveAgent = async () => {
    if (!editingAgent) return
    const body = {
      table: 'workflow_agents',
      action: editingAgent.id ? 'update' : 'insert',
      data: { name: editingAgent.name, role: editingAgent.role, platform: editingAgent.platform, position_x: editingAgent.position_x, position_y: editingAgent.position_y },
      filters: editingAgent.id ? { eq: { id: editingAgent.id } } : undefined,
    }
    const res = await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setEditingAgent(null); fetchData() }
  }

  const deleteAgent = async (id: string) => {
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_agents', action: 'delete', filters: { eq: { id } } }) })
    fetchData()
  }

  const addSkill = async (agentId: string, name: string) => {
    if (!name.trim()) return
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_skills', action: 'insert', data: { agent_id: agentId, name: name.trim() } }) })
    setAddingSkillFor(null)
    fetchData()
  }

  const addDoc = async (agentId: string, name: string) => {
    if (!name.trim()) return
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_documents', action: 'insert', data: { agent_id: agentId, name: name.trim() } }) })
    setAddingDocFor(null)
    fetchData()
  }

  const deleteItem = async (table: string, id: string) => {
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, action: 'delete', filters: { eq: { id } } }) })
    fetchData()
  }

  const updatePosition = async (id: string, x: number, y: number) => {
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workflow_agents', action: 'update', data: { position_x: x, position_y: y }, filters: { eq: { id } } }) })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">工作流</h1>
          <p className="text-xs text-muted-foreground">Agent 编排 · 技能 · 文档</p>
        </div>
        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <button onClick={() => { setEditingAgent({ id: '', name: '', role: '', platform: '', position_x: 100, position_y: 100, skills: [], documents: [] }) }} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4" /> 添加 Agent
              </button>
              <button onClick={() => setEditMode(false)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border">
                <Lock className="w-4 h-4" /> 退出编辑
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="管理密码" className="w-28 px-2 py-1.5 text-sm rounded border bg-background" onKeyDown={e => e.key === 'Enter' && unlockEdit()} />
              <button onClick={unlockEdit} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border hover:bg-accent">
                <Unlock className="w-4 h-4" /> 编辑
              </button>
              {authError && <span className="text-xs text-red-500">{authError}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-auto" style={{ height: 'calc(100vh - 57px)' }}>
        <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H, minHeight: '100%' }}>
          {/* Grid background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-5">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            {agents.map(agent => {
              const cardEl = document.getElementById(`agent-${agent.id}`)
              if (!cardEl) return null
              const canvasRect = document.querySelector('[data-canvas]')?.getBoundingClientRect()
              const cardRect = cardEl.getBoundingClientRect()
              if (!canvasRect || !cardRect) return null
              const cx = cardRect.left - canvasRect.left + cardRect.width / 2
              const cy = cardRect.top - canvasRect.top + cardRect.height

              const items = [...agent.skills.map(s => ({ type: 'skill', label: s.name })), ...agent.documents.map(d => ({ type: 'doc', label: d.name }))]
              return items.map((item, i) => {
                const tx = cx + (i - items.length / 2 + 0.5) * 80
                const ty = cy + 20
                return <line key={`${agent.id}-${i}`} x1={cx} y1={cy} x2={tx} y2={ty} stroke="currentColor" strokeWidth={1} opacity={0.15} />
              })
            })}
          </svg>

          {/* Agent cards */}
          <div className="relative z-10 p-8" data-canvas>
            {agents.map(agent => (
              <motion.div
                key={agent.id}
                id={`agent-${agent.id}`}
                drag={editMode}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  const nx = Math.round(agent.position_x + info.offset.x / 4)
                  const ny = Math.round(agent.position_y + info.offset.y / 4)
                  updatePosition(agent.id, nx, ny)
                  setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, position_x: nx, position_y: ny } : a))
                }}
                initial={{ x: agent.position_x, y: agent.position_y }}
                animate={{ x: agent.position_x, y: agent.position_y }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="absolute mb-24"
                style={{ top: 0, left: 0 }}
              >
                {/* Main agent card */}
                <div className="w-72 rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.platform}</p>
                      </div>
                      {editMode && (
                        <div className="flex gap-1">
                          <button onClick={() => setEditingAgent(agent)} className="p-1 rounded hover:bg-accent"><Edit3 className="w-3 h-3" /></button>
                          <button onClick={() => deleteAgent(agent.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 className="w-3 h-3 text-red-500" /></button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{agent.role}</p>
                  </div>

                  {/* Skills */}
                  <div className="border-t px-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">技能</span>
                      {editMode && <button onClick={() => setAddingSkillFor(agent.id)} className="text-xs text-primary hover:underline">+</button>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.skills.map(s => (
                        <span key={s.id} className="group relative inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                          {s.name}
                          {editMode && <button onClick={() => deleteItem('workflow_skills', s.id)} className="hidden group-hover:block"><X className="w-2.5 h-2.5" /></button>}
                        </span>
                      ))}
                      {addingSkillFor === agent.id && (
                        <InlineAdd onSubmit={n => addSkill(agent.id, n)} onCancel={() => setAddingSkillFor(null)} placeholder="技能名" />
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="border-t px-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">文档</span>
                      {editMode && <button onClick={() => setAddingDocFor(agent.id)} className="text-xs text-primary hover:underline">+</button>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.documents.map(d => (
                        <span key={d.id} className="group relative inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                          📄 {d.name}
                          {editMode && <button onClick={() => deleteItem('workflow_documents', d.id)} className="hidden group-hover:block"><X className="w-2.5 h-2.5" /></button>}
                        </span>
                      ))}
                      {addingDocFor === agent.id && (
                        <InlineAdd onSubmit={n => addDoc(agent.id, n)} onCancel={() => setAddingDocFor(null)} placeholder="文档名" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {agents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-3">🔧</p>
                <p className="text-muted-foreground mb-4">暂无 Agent，请先解锁编辑模式</p>
                {!editMode && (
                  <div className="flex items-center justify-center gap-2">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="管理密码" className="w-28 px-2 py-1.5 text-sm rounded border bg-background" onKeyDown={e => e.key === 'Enter' && unlockEdit()} />
                    <button onClick={unlockEdit} className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground">解锁</button>
                  </div>
                )}
                {editMode && (
                  <button onClick={() => { setEditingAgent({ id: '', name: '', role: '', platform: '', position_x: 100, position_y: 100, skills: [], documents: [] }) }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 inline mr-1" /> 添加 Agent
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent edit modal */}
      <AnimatePresence>
        {editingAgent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditingAgent(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-96 rounded-xl bg-card border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">{editingAgent.id ? '编辑 Agent' : '添加 Agent'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">名称</label>
                  <input value={editingAgent.name} onChange={e => setEditingAgent({ ...editingAgent, name: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border bg-background" placeholder="例如：蓝" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">职责描述</label>
                  <textarea value={editingAgent.role} onChange={e => setEditingAgent({ ...editingAgent, role: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border bg-background resize-none" placeholder="描述这个 Agent 的职责" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">平台</label>
                  <input value={editingAgent.platform} onChange={e => setEditingAgent({ ...editingAgent, platform: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border bg-background" placeholder="例如：openhanako" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setEditingAgent(null)} className="px-4 py-2 text-sm rounded-lg border">取消</button>
                <button onClick={saveAgent} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InlineAdd({ onSubmit, onCancel, placeholder }: { onSubmit: (v: string) => void; onCancel: () => void; placeholder: string }) {
  const [v, setV] = useState('')
  return (
    <span className="inline-flex items-center gap-1">
      <input autoFocus value={v} onChange={e => setV(e.target.value)} placeholder={placeholder} className="w-20 px-1 py-0.5 text-xs rounded border bg-background" onKeyDown={e => { if (e.key === 'Enter') onSubmit(v); if (e.key === 'Escape') onCancel() }} />
      <button onClick={() => onSubmit(v)} className="text-xs text-primary">✓</button>
      <button onClick={onCancel} className="text-xs text-muted-foreground">✗</button>
    </span>
  )
}
