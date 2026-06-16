import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '规划 - 陈子杰',
  description: '项目规划与进度追踪',
}

export default function RoadmapPage() {
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

        <div className="text-center py-20">
          <p className="text-4xl mb-4">🚧</p>
          <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">规划页面改造中</p>
          <p className="text-sm text-slate-400">全新的项目规划体验即将上线</p>
        </div>
      </div>
    </main>
  )
}
