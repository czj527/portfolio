<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div v-if="!isAdmin" class="text-center py-24 animate-slide-up">
      <div class="text-6xl mb-6">🔒</div>
      <h1 class="text-2xl font-bold mb-4">需要管理员权限</h1>
      <p class="text-[rgb(var(--color-text-secondary))] mb-8">请先登录管理后台后再写文章</p>
      <NuxtLink
        to="/admin"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgb(var(--color-accent))] text-white font-medium hover:opacity-90 transition-all"
      >
        前往管理后台登录
      </NuxtLink>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-8 animate-slide-up">
        <h1 class="text-3xl font-bold">写文章</h1>
        <NuxtLink to="/admin" class="text-sm text-[rgb(var(--color-accent))] hover:underline">← 返回管理后台</NuxtLink>
      </div>

      <div class="space-y-6 animate-slide-up" style="animation-delay: 0.1s">
        <input
          v-model="form.title"
          type="text"
          placeholder="文章标题"
          class="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50"
        />
        <input
          v-model="form.slug"
          type="text"
          placeholder="URL 标识 (留空自动生成)"
          class="w-full px-4 py-2.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50"
        />
        <textarea
          v-model="form.excerpt"
          placeholder="文章摘要（可选）"
          rows="2"
          class="w-full px-4 py-2.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50"
        />

        <TiptapEditor v-model="form.content" />

        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <label class="text-sm text-[rgb(var(--color-text-secondary))]">分类：</label>
            <select
              v-model="form.categoryId"
              class="px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm"
            >
              <option :value="null">无分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-[rgb(var(--color-text-secondary))]">标签：</label>
            <select
              v-model="form.tagIds"
              multiple
              class="px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm min-w-[120px]"
            >
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
            </select>
          </div>
          <label class="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
            <input v-model="form.pinned" type="checkbox" class="rounded" />
            置顶
          </label>
        </div>

        <div class="flex gap-3 justify-end pt-4">
          <NuxtLink
            to="/blog"
            class="px-6 py-2.5 rounded-lg border border-[rgb(var(--color-border))] text-sm font-medium hover:bg-[rgb(var(--color-bg-secondary))] transition-all"
          >
            取消
          </NuxtLink>
          <button
            @click="submitPost(true)"
            :disabled="submitting"
            class="px-6 py-2.5 rounded-lg border border-[rgb(var(--color-border))] text-sm font-medium hover:bg-[rgb(var(--color-bg-secondary))] transition-all disabled:opacity-50"
          >
            保存草稿
          </button>
          <button
            @click="submitPost(false)"
            :disabled="submitting || !form.title || !form.content"
            class="px-6 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {{ submitting ? '发布中...' : '发布文章' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { isAdmin, login } = useAdmin()
const submitting = ref(false)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: null as number | null,
  tagIds: [] as number[],
  pinned: false,
})

const { data: categories } = await useFetch('/api/categories')
const { data: tags } = await useFetch('/api/tags')

async function submitPost(published: boolean) {
  submitting.value = true
  try {
    await $fetch('/api/blog/create', {
      method: 'POST',
      body: {
        ...form,
        password: 'admin123',
        published,
      },
    })
    navigateTo('/blog')
  } catch (e: any) {
    alert(e.message || '发布失败')
  } finally {
    submitting.value = false
  }
}
</script>
