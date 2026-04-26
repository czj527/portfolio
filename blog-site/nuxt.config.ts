export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: '个人博客',
      meta: [
        { name: 'description', content: '个人博客 - 分享技术与生活' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts'
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-04-26'
})
