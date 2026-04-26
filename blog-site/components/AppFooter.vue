<template>
  <footer class="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">Blog</h3>
          <p class="text-sm text-[rgb(var(--color-text-secondary))]">
            分享技术与生活的个人博客
          </p>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">快速链接</h3>
          <ul class="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
            <li><NuxtLink to="/blog" class="hover:text-[rgb(var(--color-accent))] transition-colors">博客文章</NuxtLink></li>
            <li><NuxtLink to="/projects" class="hover:text-[rgb(var(--color-accent))] transition-colors">我的项目</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-[rgb(var(--color-accent))] transition-colors">关于我</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">订阅</h3>
          <a
            href="/rss.xml"
            target="_blank"
            class="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93v-2.83z"/></svg>
            RSS 订阅
          </a>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-[rgb(var(--color-border))] text-center text-sm text-[rgb(var(--color-text-secondary))]">
        <p>&copy; {{ new Date().getFullYear() }} Blog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
