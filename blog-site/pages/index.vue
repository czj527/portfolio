<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-accent))]/5 via-transparent to-[rgb(var(--color-accent-light))]/5" />
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgb(var(--color-accent))]/10 rounded-full blur-3xl animate-float" />
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent-light))]/10 rounded-full blur-3xl animate-float" style="animation-delay: -3s" />
      </div>

      <div class="relative text-center px-4 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up">
          你好，我是
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-light))]">
            陈子杰
          </span>
        </h1>
        <p class="text-lg md:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto mb-10 animate-slide-up" style="animation-delay: 0.1s">
          全栈开发者 · 用代码构建世界
        </p>
        <div class="flex items-center justify-center gap-4 animate-slide-up" style="animation-delay: 0.2s">
          <NuxtLink
            to="/blog"
            class="px-8 py-3 rounded-xl bg-[rgb(var(--color-accent))] text-white font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[rgb(var(--color-accent))]/25"
          >
            浏览博客
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="px-8 py-3 rounded-xl border border-[rgb(var(--color-border))] font-medium hover:bg-[rgb(var(--color-bg-secondary))] transition-all hover:scale-105"
          >
            关于我
          </NuxtLink>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold">最新文章</h2>
        <NuxtLink to="/blog" class="text-sm text-[rgb(var(--color-accent))] hover:underline">
          查看全部 →
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-48 bg-[rgb(var(--color-bg-secondary))] rounded-2xl mb-4" />
          <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-3/4 mb-2" />
          <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="!posts?.posts?.length" class="text-center py-16 text-[rgb(var(--color-text-secondary))]">
        <p>暂无文章，敬请期待</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="(post, index) in posts.posts"
          :key="post.id"
          class="group cursor-pointer animate-slide-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="navigateTo(`/blog/${post.slug}`)"
        >
          <div class="relative overflow-hidden rounded-2xl mb-4 bg-[rgb(var(--color-bg-secondary))] aspect-[16/10]">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="absolute inset-0 flex items-center justify-center text-4xl">
              📝
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-if="post.category"
              class="px-2.5 py-1 text-xs rounded-full bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]"
            >
              {{ post.category.name }}
            </span>
            <span
              v-for="tag in post.tags"
              :key="tag.id"
              class="px-2.5 py-1 text-xs rounded-full bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))]"
            >
              {{ tag.name }}
            </span>
          </div>
          <h3 class="text-lg font-semibold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors line-clamp-2">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-3">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center gap-4 text-xs text-[rgb(var(--color-text-secondary))]">
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>· {{ post.views }} 阅读</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Projects Preview Section -->
    <section class="bg-[rgb(var(--color-bg-secondary))]/50 py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-3xl font-bold">精选项目</h2>
          <NuxtLink to="/projects" class="text-sm text-[rgb(var(--color-accent))] hover:underline">
            查看全部 →
          </NuxtLink>
        </div>

        <div v-if="!projects?.length" class="text-center py-16 text-[rgb(var(--color-text-secondary))]">
          <p>暂无项目展示</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(project, index) in projects.slice(0, 3)"
            :key="project.id"
            class="group p-6 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:shadow-lg hover:border-[rgb(var(--color-accent))]/30 transition-all duration-300 animate-slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <h3 class="text-xl font-bold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-sm text-[rgb(var(--color-text-secondary))] mb-4 line-clamp-3">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tech in project.techStack.split(',')"
                :key="tech"
                class="px-2 py-1 text-xs rounded-md bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))]"
              >
                {{ tech.trim() }}
              </span>
            </div>
            <div class="flex gap-3">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
                @click.stop
              >
                GitHub →
              </a>
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                class="text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
                @click.stop
              >
                Demo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  excerpt: string | null
  slug: string
  views: number
  createdAt: string
  category: { name: string } | null
  tags: { id: number; name: string }[]
}

interface Project {
  id: number
  title: string
  description: string
  techStack: string
  githubUrl: string | null
  demoUrl: string | null
}

interface PostsResponse {
  posts: Post[]
  total: number
}

const { data: posts, pending } = await useLazyFetch<PostsResponse>('/api/posts', {
  query: { limit: 6, published: true }
})

const { data: projects } = await useLazyFetch<Project[]>('/api/projects')

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
