<template>
  <form @submit.prevent="submitComment" class="mb-8 p-4 rounded-xl bg-[rgb(var(--color-bg-secondary))]">
    <h4 class="text-sm font-medium mb-4">发表评论</h4>
    <div class="space-y-3">
      <input
        v-model="author"
        type="text"
        placeholder="你的昵称"
        required
        class="w-full px-4 py-2.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50"
      />
      <textarea
        v-model="content"
        placeholder="写下你的评论..."
        required
        rows="3"
        class="w-full px-4 py-2.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/50"
      />
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="submitting || !author || !content"
          class="px-6 py-2 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {{ submitting ? '提交中...' : '发表评论' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ postId: number }>()
const emit = defineEmits<{ commented: [] }>()

const author = ref('')
const content = ref('')
const submitting = ref(false)

async function submitComment() {
  if (!author.value || !content.value) return
  submitting.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        postId: props.postId,
        author: author.value,
        content: content.value,
      },
    })
    author.value = ''
    content.value = ''
    emit('commented')
  } catch (e) {
    console.error('评论失败', e)
  } finally {
    submitting.value = false
  }
}
</script>
