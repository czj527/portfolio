'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, X, Lock, Unlock, Trash2, Users, Puzzle, FileText, Sparkles, Link2 } from 'lucide-react'

// ---- Types ----
interface Node {
  id: string; type: 'agent' | 'skill' | 'document' | 'custom'
  name: string; description: string
  position_x: number; position_y: number
  agent_id?: string | null
  // agent-specific
  role?: string; platform?: string
  // custom-specific
  custom_type?: string
}

const typeDefs = {
  agent:    { icon: Users,     color: 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/30',   label: 'Agent',  badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' },
  skill:    { icon: Puzzle,    color: 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30', label: 'Skill',  badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' },
  document: { icon: FileText,  color: 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/30',   label: '文档',   badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' },
  custom:   { icon: Sparkles,  color: 'border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/30', label: '自定义', badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' },
}

// ---- Page ----
export default function WorkflowPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)

  // ---- Data ----
  const fetchData = useCallback(async () => {
    setLoading(true)
    const tables = ['workflow_agents', 'workflow_skills', 'workflow_documents', 'workflow_custom'] as const
    const results = await Promise.all(tables.map(t =>
      fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: t, action: 'select' }) }).then(r => r.json())
    ))
    const all: Node[] = []
    results[0].data?.forEach((a: any) => all.push({ type: 'agent', ...a }))
    results[1].data?.forEach((s: any) => all.push({ type: 'skill', ...s, description: s.description || '' }))
    results[2].data?.forEach((d: any) => all.push({ type: 'document', ...d, description: d.description || '' }))
    results[3].data?.forEach((c: any) => all.push({ type: 'custom', ...c, description: c.description || '' }))
    setNodes(all)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ---- Auth ----
  const unlockEdit = async () => {
    setAuthError('')
    try {
      const res = await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'site_config', action: 'select', filters: { eq: { key: 'admin_password' } } }) })
      const d = await res.json()
      if (password === (d.data?.[0]?.value || 'admin123')) { setEditMode(true); setPassword('') }
      else setAuthError('密码错误')
    } catch { setEditMode(true) }
  }

  // ---- CRUD ----
  const tableForType = (type: string) => ({ agent: 'workflow_agents', skill: 'workflow_skills', document: 'workflow_documents', custom: 'workflow_custom' }[type] || 'workflow_custom')

  const saveNode = async () => {
    if (!editingNode) return
    const table = tableForType(editingNode.type)
    const data: any = { name: editingNode.name, description: editingNode.description, position_x: editingNode.position_x, position_y: editingNode.position_y }
    if (editingNode.type === 'agent') { data.role = editingNode.role; data.platform = editingNode.platform }
    if (editingNode.type === 'custom') data.custom_type = editingNode.custom_type
    if (editingNode.type === 'skill' || editingNode.type === 'document' || editingNode.type === 'custom') data.agent_id = editingNode.agent_id || null

    const body = editingNode.id
      ? { table, action: 'update', data, filters: { eq: { id: editingNode.id } } }
      : { table, action: 'insert', data }
    const res = await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setEditingNode(null); fetchData() }
  }

  const deleteNode = async (node: Node) => {
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: tableForType(node.type), action: 'delete', filters: { eq: { id: node.id } } }) })
    fetchData()
  }

  const updatePosition = async (node: Node, x: number, y: number) => {
    await fetch('/api/supabase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: tableForType(node.type), action: 'update', data: { position_x: x, position_y: y }, filters: { eq: { id: node.id } } }) })
  }

  const addNode = (type: Node['type']) => {
    setEditingNode({ id: '', type, name: '', description: '', position_x: 200 + nodes.length * 40, position_y: 200 + nodes.length * 40, role: '', platform: '', custom_type: '' })
    setShowAddMenu(false)
  }

  // ---- Render ----
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-14 flex flex-col items-center gap-2 pt-20 pb-4 border-r border-border bg-background/50">
        <div className="flex flex-col items-center gap-2 flex-1">
          {editMode ? (
            <>
              {/* Add Menu */}
              <div className="relative">
                <button onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center transition-all shadow-md"
                  title="新增元素">
                  <Plus className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {showAddMenu && (
                    <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                      className="absolute left-full top-0 ml-2 w-40 rounded-xl border bg-card shadow-xl p-1.5 z-50">
                      {(['agent', 'skill', 'document', 'custom'] as const).map(t => {
                        const d = typeDefs[t]
                        const Icon = d.icon
                        return <button key={t} onClick={() => addNode(t)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"><Icon className="w-4 h-4" /> {d.label}</button>
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : null}

          {/* Legend */}
          {(['agent', 'skill', 'document', 'custom'] as const).map(t => {
            const d = typeDefs[t]
            const Icon = d.icon
            return <div key={t} title={d.label} className="w-8 h-8 rounded-lg border flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" style={{ borderColor: t === 'agent' ? '#60a5fa' : t === 'skill' ? '#34d399' : t === 'document' ? '#fbbf24' : '#c084fc' }}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          })}

          {nodes.length > 0 && (
            <div className="text-[10px] text-muted-foreground mt-2 text-center">{nodes.length}</div>
          )}
        </div>

        {/* Auth */}
        <div className="flex flex-col items-center gap-2">
          {editMode ? (
            <button onClick={() => setEditMode(false)} title="退出编辑"
              className="w-10 h-10 rounded-xl border hover:bg-accent flex items-center justify-center transition-all">
              <Lock className="w-4 h-4" />
            </button>
          ) : (
            <>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="密码" className="w-10 text-center text-xs px-1 py-1.5 rounded-lg border bg-background"
                onKeyDown={e => e.key === 'Enter' && unlockEdit()} />
              <button onClick={unlockEdit} title="编辑模式"
                className="w-10 h-10 rounded-xl border hover:bg-accent flex items-center justify-center transition-all">
                <Unlock className="w-4 h-4" />
              </button>
              {authError && <span className="text-[10px] text-red-500">错误</span>}
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-auto" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="relative" style={{ width: 1600, height: 1200, minWidth: '100%', minHeight: '100%' }}>
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] dark:opacity-[0.04]">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <CanvasNode
              key={node.id}
              node={node}
              editMode={editMode}
              onEdit={() => setEditingNode(node)}
              onDelete={() => deleteNode(node)}
              onDragEnd={(x, y) => { updatePosition(node, x, y); setNodes(prev => prev.map(n => n.id === node.id ? { ...n, position_x: x, position_y: y } : n)) }}
            />
          ))}

          {/* Parent-child connection lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: 1600, height: 1200 }}>
            {nodes.filter(n => n.agent_id).map(child => {
              const parent = nodes.find(n => n.id === child.agent_id)
              if (!parent) return null
              return (
                <line key={child.id}
                  x1={parent.position_x + 130} y1={parent.position_y + 70}
                  x2={child.position_x + 100} y2={child.position_y + 20}
                  stroke="currentColor" strokeWidth={1} opacity={0.12}
                  strokeDasharray="4 2"
                />
              )
            })}
          </svg>

          {/* Empty hint */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-4xl mb-3">🔧</p>
                <p className="text-muted-foreground">点击右上角「编辑」解锁，然后「新增」元素</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingNode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditingNode(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-96 rounded-xl bg-card border shadow-2xl p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">{editingNode.id ? `编辑 ${typeDefs[editingNode.type].label}` : `添加 ${typeDefs[editingNode.type].label}`}</h3>
              <div className="space-y-3">
                <Field label="名称" value={editingNode.name} onChange={v => setEditingNode({ ...editingNode, name: v })} placeholder="输入名称" />
                <Field label="描述" value={editingNode.description} onChange={v => setEditingNode({ ...editingNode, description: v })} placeholder="简要描述" textarea />
                {editingNode.type === 'agent' && (
                  <>
                    <Field label="职责" value={editingNode.role || ''} onChange={v => setEditingNode({ ...editingNode, role: v })} placeholder="描述这个 Agent 的职责" />
                    <Field label="平台" value={editingNode.platform || ''} onChange={v => setEditingNode({ ...editingNode, platform: v })} placeholder="如：openhanako" />
                  </>
                )}
                {editingNode.type === 'custom' && (
                  <Field label="自定义类型" value={editingNode.custom_type || ''} onChange={v => setEditingNode({ ...editingNode, custom_type: v })} placeholder="如：repository、tool..." />
                )}
                {(editingNode.type === 'skill' || editingNode.type === 'document' || editingNode.type === 'custom') && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">关联 Agent（可选）</label>
                    <select value={editingNode.agent_id || ''} onChange={e => setEditingNode({ ...editingNode, agent_id: e.target.value || null })}
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-background">
                      <option value="">无关联</option>
                      {nodes.filter(n => n.type === 'agent').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setEditingNode(null)} className="px-4 py-2 text-sm rounded-lg border">取消</button>
                <button onClick={saveNode} disabled={!editingNode.name.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground disabled:opacity-50">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- Canvas Node ----
function CanvasNode({ node, editMode, onEdit, onDelete, onDragEnd }: {
  node: Node; editMode: boolean; onEdit: () => void; onDelete: () => void; onDragEnd: (x: number, y: number) => void
}) {
  const d = typeDefs[node.type]
  const Icon = d.icon
  return (
    <motion.div
      drag={editMode}
      dragMomentum={false}
      onDragEnd={(_, info) => onDragEnd(Math.round(node.position_x + info.offset.x / 3), Math.round(node.position_y + info.offset.y / 3))}
      initial={{ x: node.position_x, y: node.position_y }}
      animate={{ x: node.position_x, y: node.position_y }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className={`absolute rounded-xl border-2 shadow-md hover:shadow-lg transition-shadow ${d.color}`}
      style={{ top: 0, left: 0, width: node.type === 'agent' ? 260 : 200 }}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className={`text-[10px] px-1.5 py-px rounded-full ${d.badge}`}>
                {node.type === 'custom' ? (node.custom_type || 'custom') : d.label}
              </span>
            </div>
            <h3 className="font-semibold text-sm truncate">{node.name}</h3>
          </div>
          {editMode && (
            <div className="flex gap-0.5 flex-shrink-0">
              <button onClick={onEdit} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"><Edit3 className="w-3 h-3" /></button>
              <button onClick={onDelete} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 className="w-3 h-3 text-red-500" /></button>
            </div>
          )}
        </div>
        {node.type === 'agent' && (
          <>
            {node.role && <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-1">{node.role}</p>}
            {node.platform && <p className="text-[10px] text-muted-foreground/70">🖥 {node.platform}</p>}
          </>
        )}
        {node.type !== 'agent' && node.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{node.description}</p>
        )}
      </div>
    </motion.div>
  )
}

// ---- Form Field ----
function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; textarea?: boolean
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border bg-background resize-none" placeholder={placeholder} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border bg-background" placeholder={placeholder} />
      )}
    </div>
  )
}
