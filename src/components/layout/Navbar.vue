<template>
  <header class="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-20">
    <div class="container mx-auto flex items-center justify-between h-16 px-4">
      <div class="flex items-center space-x-2">
        <img src="https://vitejs.dev/logo.svg" alt="logo" class="h-8 w-8" />
        <span class="font-bold text-xl text-blue-700">校企联盟平台</span>
      </div>
      <nav class="hidden md:flex space-x-6 text-gray-700 font-medium">
        <router-link to="/" class="hover:text-blue-600 transition">首页</router-link>
        <router-link to="/project/list" class="hover:text-blue-600 transition">项目对接</router-link>
        <router-link to="/job" class="hover:text-blue-600 transition">人才招聘</router-link>
        <router-link to="/resource" class="hover:text-blue-600 transition">资源共享</router-link>
        <router-link to="/student/achievement" class="hover:text-blue-600 transition">成果展示</router-link>
      </nav>
      <div class="flex items-center space-x-2">
        <!-- 未登录状态 -->
        <template v-if="!isLoggedIn">
          <router-link to="/login">
            <button class="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">登录</button>
          </router-link>
          <router-link to="/register">
            <button class="px-4 py-1.5 rounded bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">注册</button>
          </router-link>
        </template>
        
        <!-- 登录状态 -->
        <div v-else class="relative" v-click-outside="closeDropdown">
          <button 
            @click="toggleDropdown" 
            class="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 transition"
          >
            <span class="hidden sm:block text-sm font-medium">{{ user.nickname || user.account }}</span>
            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <img 
                v-if="user.avatar" 
                :src="user.avatar" 
                alt="用户头像" 
                class="h-full w-full object-cover" 
              />
              <span v-else class="text-blue-600 font-medium">
                {{ (user.nickname || user.account || '用户').slice(0, 1).toUpperCase() }}
              </span>
            </div>
          </button>
          
          <!-- 下拉菜单 -->
          <div 
            v-show="showDropdown" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30"
          >
            <div class="px-4 py-2 border-b">
              <div class="font-medium text-gray-900">{{ user.nickname || user.account }}</div>
              <div class="text-sm text-gray-500">{{ roleText }}</div>
            </div>
            
            <router-link 
              :to="dashboardLink" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              个人中心
            </router-link>
            
            <a 
              href="#" 
              @click.prevent="logout" 
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              退出登录
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const router = useRouter()
const showDropdown = ref(false)

// 计算是否已登录
const isLoggedIn = computed(() => !!appStore.user)

// 获取用户信息
const user = computed(() => appStore.user || {})

// 根据角色获取角色文本
const roleText = computed(() => {
  const role = user.value?.role
  const roleMap: Record<string, string> = {
    'SYSADMIN': '系统管理员',
    'SCH_ADMIN': '学校管理员',
    'EN_ADMIN': '企业管理员',
    'TEACHER': '教师',
    'MENTOR': '企业导师',
    'STUDENT': '学生'
  }
  return roleMap[role] || '用户'
})

// 根据角色获取仪表盘链接
const dashboardLink = computed(() => {
  const role = user.value?.role
  const dashboardMap: Record<string, string> = {
    'SYSADMIN': '/dashboard/admin',
    'SCH_ADMIN': '/dashboard/school',
    'EN_ADMIN': '/dashboard/company',
    'TEACHER': '/dashboard/teacher',
    'MENTOR': '/dashboard/mentor',
    'STUDENT': '/dashboard/student'
  }
  return dashboardMap[role] || '/dashboard/student'
})

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  showDropdown.value = false
}

// 退出登录
const logout = () => {
  appStore.logout()
  router.push('/login')
}

// 点击外部关闭下拉菜单的指令
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script> 