import { getSupabaseAdmin } from '@/lib/supabase'
import TaskBoard from './task-board'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '任务 - 陈子杰',
  description: '每日待办与任务追踪',
}

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const supabase = getSupabaseAdmin()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]

  const categories = {
    today: tasks?.filter((t: any) => t.due_date === today && t.status !== 'done') || [],
    upcoming: tasks?.filter((t: any) => t.due_date > today && t.status !== 'done') || [],
    backlog: tasks?.filter((t: any) => !t.due_date && t.status !== 'done') || [],
    done: tasks?.filter((t: any) => t.status === 'done') || [],
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            任务
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            每日待办 · 进度追踪
          </p>
        </header>
        <TaskBoard initialTasks={tasks || []} categories={categories} today={today} />
      </div>
    </main>
  )
}
