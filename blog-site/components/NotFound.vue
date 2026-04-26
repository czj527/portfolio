<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div class="text-8xl mb-6 animate-float">404</div>
    <h1 class="text-2xl font-bold mb-4">页面未找到</h1>
    <p class="text-[rgb(var(--color-text-secondary))] mb-8">你访问的页面不存在或已被移除</p>
    <div class="flex gap-4">
      <NuxtLink
        to="/"
        class="px-6 py-3 rounded-xl bg-[rgb(var(--color-accent))] text-white font-medium hover:opacity-90 transition-all"
      >
        返回首页
      </NuxtLink>
      <NuxtLink
        to="/blog"
        class="px-6 py-3 rounded-xl border border-[rgb(var(--color-border))] font-medium hover:bg-[rgb(var(--color-bg-secondary))] transition-all"
      >
        浏览博客
      </NuxtLink>
    </div>
  </div>
</template>
