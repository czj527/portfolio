<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-16 animate-slide-up">我的项目</h1>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="h-48 bg-[rgb(var(--color-bg-secondary))] rounded-2xl mb-4" />
        <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-3/4 mb-2" />
        <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="!projects?.length" class="text-center py-24 text-[rgb(var(--color-text-secondary))]">
      <p>暂无项目展示</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="group p-6 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:shadow-xl hover:border-[rgb(var(--color-accent))]/30 transition-all duration-500 animate-slide-up hover:-translate-y-1"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <svg class="w-6 h-6 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>

        <h3 class="text-xl font-bold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors">
          {{ project.title }}
        </h3>
        <p class="text-sm text-[rgb(var(--color-text-secondary))] mb-4 leading-relaxed">
          {{ project.description }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tech in project.techStack.split(',')"
            :key="tech"
            class="px-2.5 py-1 text-xs rounded-md bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] font-mono"
          >
            {{ tech.trim() }}
          </span>
        </div>

        <div class="flex items-center gap-4 pt-4 border-t border-[rgb(var(--color-border))]">
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            class="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            v-if="project.demoUrl"
            :href="project.demoUrl"
            target="_blank"
            class="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            在线演示
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  techStack: string
  githubUrl: string | null
  demoUrl: string | null
}

const { data: projects, pending } = await useLazyFetch<Project[]>('/api/projects')
</script>
