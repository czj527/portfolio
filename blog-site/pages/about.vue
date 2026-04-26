<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold mb-16 animate-slide-up">关于我</h1>

    <!-- Avatar & Bio -->
    <div class="flex flex-col md:flex-row items-start gap-8 mb-16 animate-slide-up" style="animation-delay: 0.05s">
      <img
        src="https://avatars.githubusercontent.com/u/211500174?v=4"
        alt="陈子杰"
        class="w-32 h-32 rounded-2xl object-cover border-2 border-[rgb(var(--color-border))] shrink-0"
      />
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-3">陈子杰 · 全栈开发者</h2>
        <p class="text-[rgb(var(--color-text-secondary))] leading-relaxed">
          热爱编程与技术探索，专注于 Web 全栈开发。熟练掌握 Java、Vue、Python 等主流技术栈，
          热衷于构建高质量的应用产品，用代码解决实际问题。
        </p>
      </div>
    </div>

    <!-- Skills -->
    <section class="mb-16 animate-slide-up" style="animation-delay: 0.1s">
      <h2 class="text-2xl font-bold mb-8">技能栈</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(skill, index) in skills"
          :key="skill.name"
          class="p-4 rounded-xl border border-[rgb(var(--color-border))] text-center hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all duration-300 animate-scale-in"
          :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
        >
          <div class="text-2xl mb-2">{{ skill.icon }}</div>
          <div class="text-sm font-medium">{{ skill.name }}</div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="animate-slide-up" style="animation-delay: 0.15s">
      <h2 class="text-2xl font-bold mb-8">联系方式</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          v-for="contact in contacts"
          :key="contact.label"
          :href="contact.url"
          target="_blank"
          class="flex items-center gap-4 p-4 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/30 hover:shadow-sm transition-all duration-300 group"
        >
          <div class="w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="text-lg">{{ contact.icon }}</span>
          </div>
          <div>
            <div class="text-sm font-medium">{{ contact.label }}</div>
            <div class="text-xs text-[rgb(var(--color-text-secondary))]">{{ contact.value }}</div>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const skills = [
  { name: 'Java', icon: '☕' },
  { name: 'Vue.js', icon: '🟢' },
  { name: 'Python', icon: '🐍' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Spring Boot', icon: '🍃' },
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Node.js', icon: '🟩' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'Docker', icon: '🐳' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'JavaScript', icon: '📜' },
]

const contacts = [
  { label: 'GitHub', value: '@czj527', url: 'https://github.com/czj527', icon: '💻' },
  { label: '邮箱', value: '2719398856@qq.com', url: 'mailto:2719398856@qq.com', icon: '📧' },
]
</script>
