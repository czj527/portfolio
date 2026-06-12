'use client'

import { useState, useTransition } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  project_id?: string
  priority: number
  status: string
  due_date?: string
  sort_order: number
  created_at: string
  updated_at: string
}

interface Categories {
  today: Task[]
  upcoming: Task[]
  backlog: Task[]
  done: Task[]
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { style: string; label: string }> = {
    todo: { style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', label: '待办' },
    in_progress: { style: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: '进行中' },
    done: { style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', label: '已完成' },
    blocked: { style: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', label: '阻塞' },
  }
  const c = config[status] || config.todo
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${c.style}`}>{c.label}</span>
}

function TaskCard({ task, onToggle }: { task: Task; onToggle: (id: string, status: string) => void }) {
  const isDone = task.status === 'done'
  const priorityColors: Record<string, string> = {
    '1': 'border-l-red-400',
    '2': 'border-l-amber-400',
    '3': 'border-l-blue-400',
    '4': 'border-l-slate-300',
  }

  return (
    <div className={`group flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 ${priorityColors[String(task.priority)] || priorityColors['4']} bg-white dark:bg-slate-800/50 hover:shadow-sm transition-all ${isDone ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle(task.id, task.status)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'}`}
      >
        {isDone && (
          <svg className="w-3 h-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-medium text-slate-900 dark:text-white ${isDone ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <StatusBadge status={task.status} />
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
        )}
        {task.due_date && <p className="mt-1 text-xs text-slate-400">📅 {task.due_date}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, count, icon }: { title: string; count: number; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{icon}</span>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <span className="text-sm text-slate-400">({count})</span>
    </div>
  )
}

export default function TaskBoard({ initialTasks, categories }: { initialTasks: Task[]; categories: Categories; today: string }) {
  const [isPending, startTransition] = useTransition()
  const [showDone, setShowDone] = useState(false)

  function toggleTask(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    startTransition(async () => {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      window.location.reload()
    })
  }

  return (
    <div className="space-y-8">
      {categories.today.length > 0 && (
        <section>
          <SectionHeader title="今日待办" count={categories.today.length} icon="🎯" />
          <div className="space-y-3">
            {categories.today.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} />)}
          </div>
        </section>
      )}
      {categories.upcoming.length > 0 && (
        <section>
          <SectionHeader title="即将到来" count={categories.upcoming.length} icon="📅" />
          <div className="space-y-3">
            {categories.upcoming.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} />)}
          </div>
        </section>
      )}
      {categories.backlog.length > 0 && (
        <section>
          <SectionHeader title="待规划" count={categories.backlog.length} icon="📋" />
          <div className="space-y-3">
            {categories.backlog.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} />)}
          </div>
        </section>
      )}
      {categories.done.length > 0 && (
        <section>
          <button onClick={() => setShowDone(!showDone)} className="flex items-center gap-2 mb-4 text-slate-400 hover:text-slate-600 transition-colors">
            <span className="text-lg">✅</span>
            <h2 className="text-lg font-semibold">已完成</h2>
            <span className="text-sm">({categories.done.length})</span>
            <span className="text-xs">{showDone ? '收起' : '展开'}</span>
          </button>
          {showDone && (
            <div className="space-y-3">
              {categories.done.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} />)}
            </div>
          )}
        </section>
      )}
      {initialTasks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-slate-500 dark:text-slate-400">暂无任务，享受自由时光</p>
        </div>
      )}
    </div>
  )
}
