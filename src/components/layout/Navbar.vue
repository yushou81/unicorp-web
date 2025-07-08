<template>
  <header class="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-20">
    <div class="container mx-auto flex items-center justify-between h-16 px-4">
      <div class="flex items-center space-x-2">
        <img src="https://vitejs.dev/logo.svg" alt="logo" class="h-8 w-8" />
        <span class="font-bold text-xl text-blue-700">校企联盟平台</span>
      </div>
      <nav class="hidden md:flex space-x-6 text-gray-700 font-medium">
        <router-link to="/" class="hover:text-blue-600 transition">首页</router-link>
        <router-link
          v-if="isProjectDockRole"
          to="javascript:void(0)"
          class="hover:text-blue-600 transition"
          @click.prevent="goProjectDock"
        >项目对接</router-link>
        <router-link to="/job" class="hover:text-blue-600 transition">人才招聘</router-link>
        <router-link to="/classroom" class="hover:text-blue-600 transition">双师课堂</router-link>
        <router-link to="/resource" class="hover:text-blue-600 transition">资源共享</router-link>
        <router-link :to="getAchievementRoute()" class="hover:text-blue-600 transition">成果展示</router-link>
        <router-link :to="getDashboardRoute()" class="hover:text-blue-600 transition">我的</router-link>
      </nav>
      <div class="flex items-center space-x-2">
        <router-link to="/ai-assistant" class="mr-3 text-gray-600 hover:text-blue-600 transition">
          <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span class="text-blue-600 font-bold">?</span>
          </div>
        </router-link>
        <div v-if="isLoggedIn" class="flex items-center space-x-3">
          <div class="flex items-center">
            <img :src="userAvatar" class="w-8 h-8 rounded-full border border-gray-200" alt="avatar" />
            <span class="ml-2 text-sm text-gray-700">{{ userInfo.nickname || userInfo.account || '用户' }}</span>
          </div>
          <button @click="logout" class="text-sm px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">退出</button>
        </div>
        <template v-else>
          <router-link to="/login">
            <button class="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">登录</button>
          </router-link>
          <router-link to="/register">
            <button class="px-4 py-1.5 rounded bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">注册</button>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

interface UserInfo {
  id?: number;
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  organizationId?: number;
  organizationName?: string;
}

const router = useRouter()
const appStore = useAppStore()

const isLoggedIn = computed(() => !!appStore.user)
const userInfo = computed<UserInfo>(() => (appStore.user ? appStore.user as unknown as UserInfo : {}))
const userAvatar = computed(() => {
  if (!appStore.user) return ''
  return ((appStore.user as unknown) as UserInfo)?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
})

const isTeacherOrMentor = computed(() => {
  const role = (userInfo.value.role || '').toUpperCase()
  return role === 'TEACHER' || role === 'EN_TEACHER'
})

// 根据用户角色获取对应的仪表板路由
const getDashboardRoute = () => {
  if (!isLoggedIn.value) return '/login'
  
  const user = appStore.user as any || {}
  const role = (user.role || '').toUpperCase() // 统一转为大写处理
  
  console.log('当前用户角色:', role) // 调试信息
  
  switch (role) {
    case 'SYSADMIN':
      return '/dashboard/admin'
    case 'SCH_ADMIN':
    case 'SCHOOLADMIN':
      return '/dashboard/school'
    case 'EN_ADMIN':
    case 'COMPANYADMIN':
      return '/dashboard/company'
    case 'TEACHER':
      return '/dashboard/teacher'
    case 'EN_TEACHER':
    case 'MENTOR':
      return '/dashboard/mentor'
    case 'STUDENT':
      return '/dashboard/student'
    default:
      console.log('未匹配到对应角色路由，使用默认/dashboard') // 调试信息
      return '/dashboard'
  }
}


// 1. 计算属性，判断是否显示"项目对接"按钮
const isProjectDockRole = computed(() => {
  const role = (userInfo.value.role || '').toUpperCase()
  return ['SCH_ADMIN', 'EN_ADMIN', 'TEACHER', 'EN_TEACHER'].includes(role)
})

// 2. goProjectDock 方法，身份判断和跳转
const goProjectDock = () => {
  const role = (userInfo.value.role || '').toUpperCase()
  if (role === 'SCH_ADMIN' || role === 'EN_ADMIN') {
    console.log(role)
    router.push('/project/audit')
  } else if (role === 'TEACHER' || role === 'EN_TEACHER') {
    console.log(role)
    router.push('/project/dock')
  } else {
    window.alert('此功能暂不对您支持')
  }
}
// 根据用户角色获取对应的成果展示路由
const getAchievementRoute = () => {
  if (!isLoggedIn.value) return '/achievement'
  
  const user = appStore.user as any || {}
  const role = (user.role || '').toUpperCase()
  
  switch (role) {
   
    //学生
    case 'STUDENT':
      return '/achievement/student'
       //老师
    case 'TEACHER':
    //学校管理员
    case 'SCH_ADMIN':
      return '/achievement/school'
    //企业管理员
    case 'EN_ADMIN':
    // 企业老师
    case 'EN_TEACHER':
      return '/achievement/enterprise'
    //系统管理员
    case 'SYSADMIN':
      return '/achievement/admin'
    default:
      return '/achievement'

  }
}

// 退出登录
const logout = () => {
  appStore.logout()
  router.push('/login')
}
</script> 