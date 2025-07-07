<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
      <div v-if="loading" class="flex flex-col items-center justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl font-medium text-gray-700">登录成功，正在处理...</h2>
        <p class="text-gray-500 mt-2">请稍候，我们正在为您准备页面</p>
      </div>
      
      <div v-if="error" class="py-8">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h2 class="text-xl font-medium text-gray-700">登录失败</h2>
        <p class="text-red-500 mt-2">{{ errorMessage }}</p>
        <button @click="goToLogin" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          返回登录页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { setToken } from '@/lib/api/apiClient'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const appStore = useAppStore()

onMounted(() => {
  handleLoginSuccess()
})

function handleLoginSuccess() {
  try {
    // 解析URL参数
    const token = route.query.token as string
    const refreshToken = route.query.refreshToken as string
    const nickname = route.query.nickname as string
    const role = route.query.role as string
    const avatar = route.query.avatar as string
    
    if (token) {
      // 保存令牌
      setToken(token)
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // 保存用户信息到store
      appStore.setUser({
        nickname,
        role,
        avatar
      })
      
      console.log('[登录成功] 用户信息:', { nickname, role })
      
      // 根据角色跳转到对应页面
      let target = '/dashboard'
      if (role) {
        const upperRole = role.toUpperCase()
        if (upperRole === 'SYSADMIN' || upperRole === 'ADMIN') target = '/dashboard/admin'
        else if (upperRole === 'SCHOOL_ADMIN' || upperRole === 'SCH_ADMIN') target = '/dashboard/school'
        else if (upperRole === 'ENTERPRISE_ADMIN' || upperRole === 'EN_ADMIN' || upperRole === 'COMPANYADMIN') target = '/dashboard/company'
        else if (upperRole === 'TEACHER') target = '/dashboard/teacher'
        else if (upperRole === 'MENTOR' || upperRole === 'EN_TEACHER') target = '/dashboard/mentor'
        else if (upperRole === 'STUDENT') target = '/dashboard/student'
      }
      
      // 延迟一下跳转，让用户看到成功提示
      setTimeout(() => {
        router.push(target)
      }, 1000)
    } else {
      // 处理登录失败情况
      error.value = true
      loading.value = false
      errorMessage.value = '登录失败：未获取到令牌'
      console.error('登录失败：未获取到令牌')
    }
  } catch (e: any) {
    error.value = true
    loading.value = false
    errorMessage.value = e.message || '处理登录信息时出错'
    console.error('处理登录回调错误:', e)
  }
}

function goToLogin() {
  router.push('/login')
}
</script> 