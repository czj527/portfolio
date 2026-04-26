<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-16 animate-slide-up">友情链接</h1>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="animate-pulse h-24 rounded-xl bg-[rgb(var(--color-bg-secondary))]" />
    </div>

    <div v-else-if="!links?.length" class="text-center py-16 text-[rgb(var(--color-text-secondary))]">
      <p>暂无友情链接</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a
        v-for="(link, index) in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-4 p-5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all duration-300 animate-slide-up group"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {{ link.logo || '🔗' }}
        </div>
        <div>
          <div class="font-medium group-hover:text-[rgb(var(--color-accent))] transition-colors">{{ link.name }}</div>
          <div class="text-xs text-[rgb(var(--color-text-secondary))] truncate">{{ link.url }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FriendLink {
  id: number
  name: string
  url: string
  logo: string | null
}

const { data: links, pending } = await useLazyFetch<FriendLink[]>('/api/friend-links')
</script>
