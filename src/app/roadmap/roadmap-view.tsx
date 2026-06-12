'use client'

interface Project {
  id: string
  name: string
  description?: string
  progress: number
  status: string
  current_phase?: string
  tech_stack?: string[]
  priority: number
  updated_at: string
}

interface Task {
  id: string
  project_id?: string
  title: string
  description?: string
  priority: number
  status: string
  due_date?: string
}

interface Activity {
  id: string
  project_id: string
  action: string
  content: string
  created_at: string
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    in_progress: { color: 'bg-emerald-400', label: '进行中' },
    active: { color: 'bg-emerald-400', label: '进行中' },
    paused: { color: 'bg-amber-400', label: '已暂停' },
    completed: { color: 'bg-blue-400', label: '已完成' },
    planning: { color: 'bg-slate-400', label: '规划中' },
  }
  const c = config[status] || config.planning
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${c.color} ${status === 'in_progress' || status === 'active' ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-slate-500 dark:text-slate-400">{c.label}</span>
    </span>
  )
}

function ProjectCard({ project, tasks }: { project: Project; tasks: Task[] }) {
  const projectTasks = tasks.filter((t) => t.project_id === project.id)
  const doneTasks = projectTasks.filter((t) => t.status === 'done').length
  const todoTasks = projectTasks.filter((t) => t.status !== 'done')

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{project.name}</h3>
          {project.current_phase && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{project.current_phase}</p>
          )}
        </div>
        <StatusDot status={project.status} />
      </div>

      {project.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>进度</span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
      </div>

      {projectTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            任务 {doneTasks}/{projectTasks.length}
          </p>
          {todoTasks.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'in_progress' ? 'bg-blue-400' : 'bg-slate-300'}`} />
              <span className="text-slate-700 dark:text-slate-300">{t.title}</span>
            </div>
          ))}
          {todoTasks.length > 3 && (
            <p className="text-xs text-slate-400">+{todoTasks.length - 3} 更多</p>
          )}
        </div>
      )}

      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tech_stack.map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-3">
      {activities.slice(0, 10).map((act) => (
        <div key={act.id} className="flex items-start gap-3 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-slate-700 dark:text-slate-300">{act.content}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(act.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RoadmapView({ projects, tasks, activities }: {
  projects: Project[]
  tasks: Task[]
  activities: Activity[]
}) {
  const active = projects.filter((p) => p.status === 'in_progress' || p.status === 'active')
  const paused = projects.filter((p) => p.status === 'paused')
  const planned = projects.filter((p) => p.status === 'planning')
  const completed = projects.filter((p) => p.status === 'completed')

  return (
    <div className="space-y-10">
      {active.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">🚀</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">活跃项目</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((p) => <ProjectCard key={p.id} project={p} tasks={tasks} />)}
          </div>
        </section>
      )}

      {paused.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">⏸️</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">暂停中</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {paused.map((p) => <ProjectCard key={p.id} project={p} tasks={tasks} />)}
          </div>
        </section>
      )}

      {planned.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">📝</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">规划中</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {planned.map((p) => <ProjectCard key={p.id} project={p} tasks={tasks} />)}
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">📡</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">近期动态</h2>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
            <ActivityFeed activities={activities} />
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors mb-4">
              <span className="text-lg">✅</span>
              <h2 className="text-xl font-bold">已完成</h2>
              <span className="text-sm">({completed.length})</span>
              <span className="text-xs group-open:hidden">展开</span>
              <span className="text-xs hidden group-open:inline">收起</span>
            </summary>
            <div className="grid gap-4 sm:grid-cols-2">
              {completed.map((p) => <ProjectCard key={p.id} project={p} tasks={tasks} />)}
            </div>
          </details>
        </section>
      )}

      {projects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="text-slate-500 dark:text-slate-400">暂无规划，开始你的第一个项目吧</p>
        </div>
      )}
    </div>
  )
}
