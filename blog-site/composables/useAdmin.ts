const isAdmin = ref(false)

export function useAdmin() {
  onMounted(() => {
    const stored = localStorage.getItem('blog_admin')
    if (stored === 'true') {
      isAdmin.value = true
    }
  })

  async function login(password: string): Promise<boolean> {
    try {
      const config = await $fetch<Record<string, string>>('/api/config')
      if (password === config.admin_password) {
        isAdmin.value = true
        localStorage.setItem('blog_admin', 'true')
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function logout() {
    isAdmin.value = false
    localStorage.removeItem('blog_admin')
  }

  return {
    isAdmin: readonly(isAdmin),
    login,
    logout,
  }
}
