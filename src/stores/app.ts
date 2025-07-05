import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserTypeByRole } from '@/utils/userType' // 路径按实际情况调整

interface User {
  id: number
  organizationId?: number
  organizationName?: string
  username?: string
  nickname?: string
  // userType?: 'school' | 'enterprise' | 'student' | 'teacher' | 'admin' | 'mentor' // 可以去掉
  role?: string
  // 其他字段...
}

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const user = ref<User | null>(null)
  const theme = ref('light')

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setUser = (userData: User) => {
    user.value = {
      ...userData
    }
  }

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('token')
    // 如有其它本地存储项可一并清理
  }

  // 新增：判断用户是否有项目合作管理权限
  const hasProjectPermission = (permission: string) => {
    if (!user.value) return false
    
    const userRole = user.value.role?.toUpperCase()
    const userType = user.value.userType
    
    switch (permission) {
      case 'publish_project':
        return ['ADMIN', 'TEACHER', 'SCH_ADMIN', 'COMPANYADMIN'].includes(userRole || '')
      case 'apply_project':
        return ['SCHOOL', 'ENTERPRISE'].includes(userType || '')
      case 'review_application':
        return ['ADMIN', 'TEACHER', 'SCH_ADMIN', 'COMPANYADMIN'].includes(userRole || '')
      case 'manage_fund':
        return ['ADMIN', 'FINANCE', 'SCH_ADMIN', 'COMPANYADMIN'].includes(userRole || '')
      default:
        return false
    }
  }

  return {
    isLoading,
    user,
    theme,
    setLoading,
    setUser,
    setTheme,
    logout,
    hasProjectPermission
  }
}) 