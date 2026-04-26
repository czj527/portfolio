'use client'

import { useState, useEffect, useCallback } from 'react'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('blog_admin')
    if (stored === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/config')
      const config = await res.json()
      if (password === config.admin_password) {
        setIsAdmin(true)
        localStorage.setItem('blog_admin', 'true')
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
    localStorage.removeItem('blog_admin')
  }, [])

  return { isAdmin, login, logout }
}
