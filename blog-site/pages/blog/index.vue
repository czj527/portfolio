<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-8 animate-slide-up">博客文章</h1>

    <!-- Search Bar -->
    <div class="relative mb-8 animate-slide-up" style="animation-delay: 0.05s">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文章..."
        class="w-full px-4 py-3 pl-12 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50 focus:border-transparent transition-all"
        @input="debouncedSearch"
      />
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Category & Tag Filters -->
    <div class="flex flex-wrap gap-2 mb-8 animate-slide-up" style="animation-delay: 0.1s">
      <button
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          activeCategory === null
            ? 'bg-[rgb(var(--color-accent))] text-white'
            : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-accent))]/10'
        ]"
        @click="activeCategory = null; loadPosts()"
      >
        全部
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          activeCategory === cat.slug
            ? 'bg-[rgb(var(--color-accent))] text-white'
            : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-accent))]/10'
        ]"
        @click="activeCategory = cat.slug; loadPosts()"
      >
        {{ cat.name }} ({{ cat._count.posts }})
      </button>
    </div>

    <!-- Posts Grid -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="h-40 bg-[rgb(var(--color-bg-secondary))] rounded-2xl mb-4" />
        <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-3/4 mb-2" />
        <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="!postsData?.posts?.length" class="text-center py-24">
      <p class="text-[rgb(var(--color-text-secondary))]">暂无文章</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="(post, index) in postsData.posts"
        :key="post.id"
        class="group cursor-pointer animate-slide-up"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="navigateTo(`/blog/${post.slug}`)"
      >
        <div class="relative overflow-hidden rounded-2xl mb-4 bg-[rgb(var(--color-bg-secondary))] aspect-[16/10]">
          <div v-if="post.pinned" class="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs rounded-full bg-[rgb(var(--color-accent))] text-white">
            置顶
          </div>
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
        <h2 class="text-lg font-semibold mb-2 group-hover:text-[rgb(var(--color-accent))] transition-colors line-clamp-2">
          {{ post.title }}
        </h2>
        <p v-if="post.excerpt" class="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-3">
          {{ post.excerpt }}
        </p>
        <div class="flex items-center gap-4 text-xs text-[rgb(var(--color-text-secondary))]">
          <span>{{ formatDate(post.createdAt) }}</span>
          <span>· {{ post._count.comments }} 评论</span>
          <span>· {{ post._count.likes }} 赞</span>
        </div>
        <div v-if="isAdmin" class="flex gap-2 mt-3" @click.stop>
          <button
            @click="navigateTo(`/blog/${post.slug}?edit=1`)"
            class="px-3 py-1 text-xs rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-accent))]/10 hover:border-[rgb(var(--color-accent))]/30 transition-all"
          >
            编辑
          </button>
          <button
            @click="deletePost(post.id, post.title)"
            class="px-3 py-1 text-xs rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
          >
            删除
          </button>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="postsData && postsData.totalPages > 1" class="flex items-center justify-center gap-2 mt-16 animate-fade-in">
      <button
        :disabled="currentPage <= 1"
        class="px-4 py-2 rounded-lg border border-[rgb(var(--color-border))] disabled:opacity-50 hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-sm"
        @click="currentPage--; loadPosts()"
      >
        上一页
      </button>
      <span class="px-4 py-2 text-sm text-[rgb(var(--color-text-secondary))]">
        {{ currentPage }} / {{ postsData.totalPages }}
      </span>
      <button
        :disabled="currentPage >= postsData.totalPages"
        class="px-4 py-2 rounded-lg border border-[rgb(var(--color-border))] disabled:opacity-50 hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-sm"
        @click="currentPage++; loadPosts()"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAdmin } = useAdmin()
const currentPage = ref(1)
const activeCategory = ref<string | null>(null)
const searchQuery = ref('')

interface Post {
  id: number
  title: string
  excerpt: string | null
  slug: string
  pinned: boolean
  createdAt: string
  category: { name: string; slug: string } | null
  tags: { id: number; name: string; slug: string }[]
  _count: { comments: number; likes: number }
}

interface Category {
  id: number
  name: string
  slug: string
  _count: { posts: number }
}

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
}

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: postsData, pending, refresh } = await useLazyFetch<PostsResponse>('/api/posts', {
  query: { page: currentPage, limit: 9 },
  watch: [currentPage],
})

async function loadPosts() {
  await refresh()
}

async function deletePost(id: number, title: string) {
  if (!confirm(`确定要删除「${title}」吗？`)) return
  try {
    await $fetch('/api/blog/delete', {
      method: 'POST',
      body: { id, password: 'admin123' },
    })
    await refresh()
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

let debounceTimer: NodeJS.Timeout
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    currentPage.value = 1
    await refresh()
  }, 300)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
