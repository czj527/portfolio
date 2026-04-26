<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-16 animate-slide-up">文章归档</h1>

    <div v-if="pending" class="space-y-8">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-6 bg-[rgb(var(--color-bg-secondary))] rounded w-32 mb-4" />
        <div class="space-y-3 ml-4">
          <div v-for="j in 3" :key="j" class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-3/4" />
        </div>
      </div>
    </div>

    <div v-else-if="!archivedPosts?.length" class="text-center py-16 text-[rgb(var(--color-text-secondary))]">
      <p>暂无文章</p>
    </div>

    <div v-else class="space-y-12">
      <div v-for="(group, yearMonth) in archivedPosts" :key="yearMonth" class="animate-slide-up">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="text-[rgb(var(--color-accent))]">{{ yearMonth }}</span>
          <span class="text-sm text-[rgb(var(--color-text-secondary))] font-normal">({{ group.length }} 篇)</span>
        </h2>
        <div class="relative ml-4 pl-8 border-l-2 border-[rgb(var(--color-border))]">
          <div
            v-for="(post, index) in group"
            :key="post.id"
            class="relative pb-8 cursor-pointer group"
            @click="navigateTo(`/blog/${post.slug}`)"
          >
            <div class="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-[rgb(var(--color-accent))] ring-4 ring-[rgb(var(--color-bg))]" />
            <time class="text-xs text-[rgb(var(--color-text-secondary))]">{{ formatDate(post.createdAt) }}</time>
            <h3 class="text-base font-medium mt-1 group-hover:text-[rgb(var(--color-accent))] transition-colors">
              {{ post.title }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ArchivePost {
  id: number
  title: string
  slug: string
  createdAt: string
}

const { data: allPosts, pending } = await useLazyFetch<{ posts: ArchivePost[] }>('/api/posts', {
  query: { limit: 100, published: true },
})

interface ArchivedGroups {
  [key: string]: ArchivePost[]
}

const archivedPosts = computed(() => {
  if (!allPosts.value?.posts) return {} as ArchivedGroups

  const groups: ArchivedGroups = {}

  for (const post of allPosts.value.posts) {
    const date = new Date(post.createdAt)
    const key = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(post)
  }

  return groups
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
