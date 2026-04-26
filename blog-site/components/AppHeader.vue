<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-xl border-b"
    :class="[isScrolled ? 'bg-[rgb(var(--color-bg))]/80 shadow-sm' : 'bg-transparent']"
  >
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight hover:text-[rgb(var(--color-accent))] transition-colors">
        Blog
      </NuxtLink>

      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors relative group"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[rgb(var(--color-accent))] transition-all duration-300 group-hover:w-full" />
        </NuxtLink>

        <div v-if="isAdmin" class="flex items-center gap-3 pl-4 border-l border-[rgb(var(--color-border))]">
          <NuxtLink
            to="/new"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[rgb(var(--color-accent))] text-white hover:opacity-90 transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            写文章
          </NuxtLink>
          <NuxtLink
            to="/admin"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            管理
          </NuxtLink>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="!isAdmin"
          to="/admin"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-all text-[rgb(var(--color-text-secondary))]"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          管理
        </NuxtLink>

        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <svg v-if="isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <button @click="menuOpen = !menuOpen" class="md:hidden p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="menuOpen" class="md:hidden border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] animate-slide-down">
      <div class="px-4 py-4 space-y-3">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block py-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <hr class="border-[rgb(var(--color-border))]" />
        <NuxtLink
          v-if="isAdmin"
          to="/new"
          class="flex items-center gap-2 py-2 text-sm font-medium text-[rgb(var(--color-accent))]"
          @click="menuOpen = false"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          写文章
        </NuxtLink>
        <NuxtLink
          :to="isAdmin ? '/admin' : '/admin'"
          class="block py-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors"
          @click="menuOpen = false"
        >
          {{ isAdmin ? '管理后台' : '管理员登录' }}
        </NuxtLink>
        <button
          v-if="isAdmin"
          @click="handleLogout"
          class="w-full text-left py-2 text-sm font-medium text-red-500"
        >
          退出管理
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAdmin, logout } = useAdmin()
const isDark = ref(false)
const isScrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '博客' },
  { to: '/archive', label: '归档' },
  { to: '/projects', label: '项目' },
  { to: '/friends', label: '友链' },
  { to: '/about', label: '关于' },
]

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', handleScroll)
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', String(isDark.value))
}

function handleLogout() {
  logout()
  menuOpen.value = false
}

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>
