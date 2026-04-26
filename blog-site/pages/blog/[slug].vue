<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-8 bg-[rgb(var(--color-bg-secondary))] rounded w-3/4" />
      <div class="h-4 bg-[rgb(var(--color-bg-secondary))] rounded w-1/4" />
      <div class="h-64 bg-[rgb(var(--color-bg-secondary))] rounded mt-8" />
    </div>

    <template v-else-if="post">
      <article>
        <!-- Header -->
        <div class="mb-10 animate-slide-up">
          <div class="flex flex-wrap gap-2 mb-4">
            <NuxtLink
              v-if="post.category"
              :to="`/blog?category=${post.category.slug}`"
              class="px-3 py-1 text-sm rounded-full bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent))]/20 transition-colors"
            >
              {{ post.category.name }}
            </NuxtLink>
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag.id"
              :to="`/blog?tag=${tag.slug}`"
              class="px-3 py-1 text-sm rounded-full bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-accent))]/10 transition-colors"
            >
              #{{ tag.name }}
            </NuxtLink>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">{{ post.title }}</h1>

          <div class="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))] mb-8">
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>· {{ readingTime }} 分钟阅读</span>
            <span>· {{ post.views + 1 }} 次阅读</span>
          </div>

          <!-- Admin Controls -->
          <div v-if="isAdmin" class="flex gap-3 mb-8 p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))] animate-slide-down">
            <button
              @click="editMode = true"
              class="px-4 py-2 text-sm rounded-lg bg-[rgb(var(--color-accent))] text-white hover:opacity-90 transition-all"
            >
              编辑文章
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:opacity-90 transition-all"
            >
              删除文章
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="prose-custom max-w-none animate-slide-up" style="animation-delay: 0.1s" v-html="renderedContent" />

        <!-- Share -->
        <div class="flex items-center gap-4 mt-12 pt-8 border-t border-[rgb(var(--color-border))]">
          <span class="text-sm text-[rgb(var(--color-text-secondary))]">分享文章：</span>
          <button
            v-for="s in shareLinks"
            :key="s.name"
            @click="s.action"
            class="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))]"
            :title="s.name"
          >
            <span class="text-sm font-medium">{{ s.icon }}</span>
          </button>
        </div>
      </article>

      <!-- Edit Mode -->
      <div v-if="editMode" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="editMode = false">
        <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[rgb(var(--color-bg))] p-6 animate-scale-in">
          <h2 class="text-2xl font-bold mb-6">编辑文章</h2>
          <div class="space-y-4">
            <input
              v-model="editForm.title"
              placeholder="文章标题"
              class="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-lg font-semibold"
            />
            <TiptapEditor v-model="editForm.content" />
            <div class="flex gap-3 justify-end">
              <button @click="editMode = false" class="px-6 py-2 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))]">
                取消
              </button>
              <button @click="saveEdit" class="px-6 py-2 rounded-lg bg-[rgb(var(--color-accent))] text-white hover:opacity-90">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Likes & Comments -->
      <section class="mt-16 animate-slide-up" style="animation-delay: 0.2s">
        <!-- Like Button -->
        <div class="flex items-center gap-4 mb-12">
          <button
            @click="toggleLike"
            class="flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-all group"
          >
            <svg
              class="w-5 h-5 transition-all"
              :class="liked ? 'text-red-500 fill-red-500 scale-110' : 'text-[rgb(var(--color-text-secondary))] group-hover:text-red-400'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span class="text-sm font-medium">{{ likeCount }}</span>
          </button>
          <span class="text-sm text-[rgb(var(--color-text-secondary))]">
            {{ post._count.comments }} 条评论
          </span>
        </div>

        <!-- Comments -->
        <div class="space-y-6">
          <h3 class="text-xl font-bold mb-6">评论</h3>

          <CommentForm :post-id="post.id" @commented="refresh" />

          <div v-if="post.comments.length === 0" class="text-center py-12 text-[rgb(var(--color-text-secondary))]">
            暂无评论，快来抢沙发吧
          </div>

          <div v-for="comment in post.comments" :key="comment.id" class="group p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))]">
            <div class="flex items-start justify-between mb-2">
              <div>
                <span class="font-medium text-sm">{{ comment.author }}</span>
                <span class="text-xs text-[rgb(var(--color-text-secondary))] ml-3">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <button
                v-if="isAdmin"
                class="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-500 transition-all"
                @click="deleteComment(comment.id)"
              >
                删除
              </button>
            </div>
            <p class="text-sm leading-relaxed">{{ comment.content }}</p>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="text-center py-24">
      <p class="text-[rgb(var(--color-text-secondary))]">文章不存在</p>
      <NuxtLink to="/blog" class="text-[rgb(var(--color-accent))] hover:underline mt-4 inline-block">返回博客</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAdmin } = useAdmin()
const editMode = ref(false)
const liked = ref(false)
const likeCount = ref(0)

interface Tag { id: number; name: string; slug: string }
interface Category { id: number; name: string; slug: string }
interface Comment { id: number; author: string; content: string; createdAt: string }
interface PostDetail {
  id: number
  title: string
  content: string
  excerpt: string | null
  slug: string
  published: boolean
  pinned: boolean
  views: number
  createdAt: string
  category: Category | null
  tags: Tag[]
  comments: Comment[]
  _count: { comments: number; likes: number }
  relatedPosts: any[]
}

const { data: post, pending, refresh } = await useLazyFetch<PostDetail>(`/api/posts/${route.params.slug}`)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return renderMarkdown(post.value.content)
})

const readingTime = computed(() => {
  if (!post.value?.content) return 0
  const text = post.value.content.replace(/<[^>]*>/g, '')
  const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const en = text.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil((cn + en) / 300))
})

const editForm = ref({ title: '', content: '' })

watch(post, (val) => {
  if (val) {
    editForm.value = { title: val.title, content: val.content }
    likeCount.value = val._count.likes
  }
})

if (route.query.edit === '1' && isAdmin.value) {
  editMode.value = true
}

function renderMarkdown(content: string): string {
  let html = content
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  html = html.replace(/^\- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  html = html.replace(/^(?!<[^>]*>)(.+)$/gm, (m: string) => {
    if (m.startsWith('<')) return m
    if (m.trim() === '') return ''
    return `<p>${m}</p>`
  })
  return html
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function confirmDelete() {
  if (!confirm('确定要删除这篇文章吗？')) return
  try {
    await $fetch('/api/blog/delete', {
      method: 'POST',
      body: { id: post.value?.id, password: 'admin123' },
    })
    navigateTo('/blog')
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

async function saveEdit() {
  try {
    await $fetch('/api/blog/update', {
      method: 'POST',
      body: { ...editForm.value, id: post.value?.id, password: 'admin123' },
    })
    editMode.value = false
    await refresh()
  } catch (e: any) {
    alert(e.message || '保存失败')
  }
}

async function toggleLike() {
  try {
    const res = await $fetch('/api/likes', {
      method: 'POST',
      body: { postId: post.value?.id },
    })
    liked.value = res.liked
    if (res.count !== undefined) likeCount.value = res.count
  } catch (e) {
    console.error('点赞失败', e)
  }
}

async function deleteComment(commentId: number) {
  if (!confirm('确定要删除这条评论吗？')) return
  try {
    await $fetch('/api/comments', {
        method: 'POST',
        body: { action: 'delete', commentId, password: 'admin123' },
      })
    await refresh()
  } catch (e: any) {
    alert(e.message || '删除失败')
  }
}

const shareLinks = [
  {
    name: '微博',
    icon: 'WB',
    action: () => {
      window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(post.value?.title || '')}&url=${encodeURIComponent(window.location.href)}`)
    },
  },
  {
    name: 'Twitter',
    icon: 'X',
    action: () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.title || '')}&url=${encodeURIComponent(window.location.href)}`)
    },
  },
  {
    name: '复制链接',
    icon: '🔗',
    action: () => {
      navigator.clipboard.writeText(window.location.href)
    },
  },
]
</script>
