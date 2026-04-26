<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-16 animate-slide-up">标签云</h1>

    <div v-if="pending" class="flex flex-wrap gap-4">
      <div v-for="i in 12" :key="i" class="animate-pulse h-10 rounded-full bg-[rgb(var(--color-bg-secondary))]" :style="{ width: `${60 + Math.random() * 120}px` }" />
    </div>

    <div v-else-if="!tags?.length" class="text-center py-16 text-[rgb(var(--color-text-secondary))]">
      <p>暂无标签</p>
    </div>

    <div v-else class="flex flex-wrap gap-4 justify-center">
      <NuxtLink
        v-for="(tag, index) in tags"
        :key="tag.id"
        :to="`/blog?tag=${tag.slug}`"
        class="px-6 py-3 rounded-full border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:bg-[rgb(var(--color-accent))]/5 hover:text-[rgb(var(--color-accent))] transition-all duration-300 animate-scale-in"
        :style="{ animationDelay: `${index * 0.03}s`, fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + tag._count.posts * 0.15))}rem` }"
      >
        {{ tag.name }}
        <span class="ml-2 text-xs text-[rgb(var(--color-text-secondary))]">({{ tag._count.posts }})</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TagWithCount {
  id: number
  name: string
  slug: string
  _count: { posts: number }
}

const { data: tags, pending } = await useLazyFetch<TagWithCount[]>('/api/tags')
</script>
