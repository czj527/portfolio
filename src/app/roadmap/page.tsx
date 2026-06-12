import { getSupabaseAdmin } from '@/lib/supabase'
import RoadmapView from './roadmap-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '规划 - 陈子杰',
  description: '项目规划与进度追踪',
}

export const dynamic = 'force-dynamic'

export default async function RoadmapPage() {
  const supabase = getSupabaseAdmin()

  // 获取项目列表
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('priority', { ascending: true })

  // 获取任务（按项目分组）
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('priority', { ascending: true })

  // 获取近期活动日志
  const { data: activities } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            规划
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            项目进度 · 里程碑 · 下一步行动
          </p>
        </header>
        <RoadmapView
          projects={projects || []}
          tasks={tasks || []}
          activities={activities || []}
        />
      </div>
    </main>
  )
}
