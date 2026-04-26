<template>
  <div class="tiptap-editor border border-[rgb(var(--color-border))] rounded-xl overflow-hidden">
    <div class="flex flex-wrap gap-1 p-2 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]">
      <button
        v-for="btn in toolbarButtons"
        :key="btn.action"
        @click="btn.action"
        class="p-2 rounded-lg hover:bg-[rgb(var(--color-card-hover))] transition-colors"
        :title="btn.title"
        v-html="btn.icon"
      />
    </div>
    <textarea
      v-model="localContent"
      @input="emitUpdate"
      class="w-full min-h-[400px] p-4 bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] font-mono text-sm resize-y focus:outline-none"
      placeholder="使用 Markdown 编写文章..."
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const localContent = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localContent.value = val
})

function emitUpdate() {
  emit('update:modelValue', localContent.value)
}

const toolbarButtons = [
  { title: '加粗', icon: '<strong>B</strong>', action: () => wrapText('**', '**') },
  { title: '斜体', icon: '<em>I</em>', action: () => wrapText('*', '*') },
  { title: '标题1', icon: 'H1', action: () => insertPrefix('# ') },
  { title: '标题2', icon: 'H2', action: () => insertPrefix('## ') },
  { title: '标题3', icon: 'H3', action: () => insertPrefix('### ') },
  { title: '列表', icon: '•', action: () => insertPrefix('- ') },
  { title: '引用', icon: '❝', action: () => insertPrefix('> ') },
  { title: '代码', icon: '&lt;/&gt;', action: () => wrapText('`', '`') },
  { title: '代码块', icon: '{}', action: () => insertPrefix('```\n') },
]

function wrapText(before: string, after: string) {
  const textarea = document.querySelector('textarea')
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = localContent.value.substring(start, end)
  localContent.value = localContent.value.substring(0, start) + before + selected + after + localContent.value.substring(end)
  emitUpdate()
}

function insertPrefix(prefix: string) {
  const textarea = document.querySelector('textarea')
  if (!textarea) return
  const start = textarea.selectionStart
  localContent.value = localContent.value.substring(0, start) + prefix + localContent.value.substring(start)
  emitUpdate()
}
</script>
