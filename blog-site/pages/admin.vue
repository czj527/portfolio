<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <!-- Login Form -->
    <div v-if="!isAdmin" class="w-full max-w-md animate-slide-up">
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-light))] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold">管理后台</h1>
        <p class="text-[rgb(var(--color-text-secondary))] mt-2">请输入密码以进行管理操作</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="relative">
          <input
            v-model="password"
            type="password"
            placeholder="请输入管理密码"
            class="w-full px-4 py-3 pl-12 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50 focus:border-transparent transition-all text-lg"
            autofocus
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center animate-slide-down">{{ error }}</p>

        <button
          type="submit"
          :disabled="logging || !password"
          class="w-full py-3 rounded-xl bg-[rgb(var(--color-accent))] text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 text-lg"
        >
          {{ logging ? '验证中...' : '进入管理后台' }}
        </button>
      </form>

      <p class="text-center text-xs text-[rgb(var(--color-text-secondary))] mt-6">
        默认密码: admin123（可在数据库修改）
      </p>
    </div>

    <!-- Dashboard -->
    <div v-else class="w-full max-w-4xl animate-slide-up">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-3xl font-bold">管理后台</h1>
          <p class="text-[rgb(var(--color-text-secondary))] mt-1">欢迎回来，管理员</p>
        </div>
        <button
          @click="logout"
          class="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-sm hover:bg-red-500/10 transition-all"
        >
          退出登录
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="p-5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <div class="text-2xl font-bold">{{ stats.posts }}</div>
          <div class="text-sm text-[rgb(var(--color-text-secondary))]">文章总数</div>
        </div>
        <div class="p-5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <div class="text-2xl font-bold">{{ stats.comments }}</div>
          <div class="text-sm text-[rgb(var(--color-text-secondary))]">评论总数</div>
        </div>
        <div class="p-5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <div class="text-2xl font-bold">{{ stats.categories }}</div>
          <div class="text-sm text-[rgb(var(--color-text-secondary))]">分类</div>
        </div>
        <div class="p-5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
          <div class="text-2xl font-bold">{{ stats.tags }}</div>
          <div class="text-sm text-[rgb(var(--color-text-secondary))]">标签</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-10">
        <h2 class="text-lg font-bold mb-4">快捷操作</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            to="/new"
            class="flex items-center gap-4 p-5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div class="font-medium">写新文章</div>
              <div class="text-xs text-[rgb(var(--color-text-secondary))]">创建并发布博客文章</div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/blog"
            class="flex items-center gap-4 p-5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div class="font-medium">管理文章</div>
              <div class="text-xs text-[rgb(var(--color-text-secondary))]">编辑或删除已有文章</div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/"
            class="flex items-center gap-4 p-5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all group"
          >
            <div class="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent))]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <div class="font-medium">返回首页</div>
              <div class="text-xs text-[rgb(var(--color-text-secondary))]">查看网站前台</div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Posts -->
      <div>
        <h2 class="text-lg font-bold mb-4">最近文章</h2>
        <div class="space-y-3">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex items-center justify-between p-4 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 transition-all"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-2 h-2 rounded-full shrink-0" :class="post.published ? 'bg-green-500' : 'bg-yellow-500'" :title="post.published ? '已发布' : '草稿'" />
              <div class="min-w-0">
                <NuxtLink :to="`/blog/${post.slug}`" class="font-medium text-sm hover:text-[rgb(var(--color-accent))] transition-colors truncate block">
                  {{ post.title }}
                </NuxtLink>
                <div class="text-xs text-[rgb(var(--color-text-secondary))]">
                  {{ formatDate(post.createdAt) }} · {{ post._count.comments }} 评论 · {{ post._count.likes }} 赞 · {{ post.views }} 阅读
                </div>
              </div>
            </div>
            <div class="flex gap-2 shrink-0 ml-4">
              <NuxtLink
                :to="`/blog/${post.slug}?edit=1`"
                class="px-3 py-1.5 text-xs rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-all"
              >
                编辑
              </NuxtLink>
              <button
                @click="deletePost(post.id, post.title)"
                class="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
              >
                删除
              </button>
            </div>
          </div>

          <div v-if="!recentPosts?.length" class="text-center py-8 text-[rgb(var(--color-text-secondary))] text-sm">
            暂无文章
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAdmin, login, logout } = useAdmin()

const password = ref('')
const error = ref('')
const logging = ref(false)
const recentPosts = ref<any[]>([])
const stats = ref({ posts: 0, comments: 0, categories: 0, tags: 0 })

onMounted(async () => {
  if (isAdmin.value) {
    await loadData()
  }
})

async function handleLogin() {
  logging.value = true
  error.value = ''

  const success = await login(password.value)
  if (success) {
    await loadData()
  } else {
    error.value = '密码错误，请重试'
  }
  logging.value = false
}

async function loadData() {
  try {
    const [postsRes, categories, tags] = await Promise.all([
      $fetch<{ posts: any[]; total: number }>('/api/posts', { query: { limit: 10, published: undefined } }),
      $fetch<any[]>('/api/categories'),
      $fetch<any[]>('/api/tags'),
    ])

    recentPosts.value = postsRes.posts
    stats.value = {
      posts: postsRes.total,
      comments: postsRes.posts.reduce((sum, p) => sum + (p._count?.comments || 0), 0),
      categories: categories.length,
      tags: tags.length,
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

async function deletePost(id: number, title: string) {
  if (!confirm(`确定要删除「${title}」吗？`)) return
  try {
    await $fetch('/api/blog/delete', {
      method: 'POST',
      body: { id, password: 'admin123' },
    })
    await loadData()
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
