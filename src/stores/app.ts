import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const user = ref(null)
  const theme = ref('light')

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setUser = (userData: any) => {
    user.value = userData
  }

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }

  return {
    isLoading,
    user,
    theme,
    setLoading,
    setUser,
    setTheme
  }
}) 