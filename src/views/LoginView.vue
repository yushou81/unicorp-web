<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-700 mb-6">校企联盟平台登录</h2>
      <div v-if="errorMsg" class="mb-4 px-4 py-2 rounded bg-red-50 border border-red-200 text-red-700 text-sm flex items-center">
        <svg class="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
        {{ errorMsg }}
      </div>
      <form @submit.prevent="onLogin">
        <div class="mb-4">
          <div class="flex mb-2">
            <button
              v-for="type in loginTypes"
              :key="type.value"
              :class="['px-4 py-1 rounded-t', loginType === type.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600']"
              @click.prevent="loginType = type.value as 'account' | 'email' | 'phone'"
              type="button"
            >
              {{ type.label }}
            </button>
          </div>
          <label class="block text-gray-700 mb-1">{{ currentLabel }}</label>
          <input
            v-model="account"
            type="text"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="currentPlaceholder"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">密码</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" />
        </div>
        <div class="flex items-center justify-between mb-6">
          <router-link to="/register" class="text-blue-600 hover:underline text-sm">
            没有账号？注册（仅学生/企业管理员）
          </router-link>
          <a href="#" class="text-gray-400 hover:underline text-sm">忘记密码？</a>
        </div>
        <button type="submit" class="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mb-3">
          登录
        </button>
      </form>
      <div class="my-4 flex items-center justify-center">
        <span class="text-gray-400 text-xs">或</span>
      </div>
      <div class="flex flex-col gap-3">
        <button @click="onGithubLogin" class="w-full py-2 rounded bg-gray-800 text-white font-semibold hover:bg-gray-900 transition flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.48 0-.237-.01-1.017-.014-1.845-2.782.603-3.369-1.188-3.369-1.188-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.09-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.917.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login, getMe, getGithubLoginUrl } from '@/lib/api/auth'
import { setToken } from '@/lib/api/apiClient'
import { useAppStore } from '@/stores/app'

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 登录响应类型
interface LoginResponse {
  token: string;
  userId?: number;
  role?: 'SYSADMIN' | 'SCHOOL_ADMIN' | 'ENTERPRISE_ADMIN' | 'TEACHER' | 'MENTOR' | 'STUDENT' | string;
  account?: string;
}

// 用户信息类型
interface UserInfo {
  id: number; // 改为必需，与app.ts中的User类型一致
  account?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  organizationId?: number;
  organizationName?: string;
}

const loginTypes = [
  { value: 'account', label: '账号登录' },
  { value: 'email', label: '邮箱登录' },
  { value: 'phone', label: '手机号登录' }
]
const loginType = ref<'account'|'email'|'phone'>('account')
const account = ref('')
const password = ref('')
const router = useRouter()
const errorMsg = ref('')

const currentLabel = computed(() => {
  if (loginType.value === 'account') return '账号'
  if (loginType.value === 'email') return '邮箱'
  return '手机号'
})
const currentPlaceholder = computed(() => {
  if (loginType.value === 'account') return '请输入账号'
  if (loginType.value === 'email') return '请输入邮箱'
  return '请输入手机号'
})

async function onLogin() {
  const payload = {
    loginType: loginType.value,
    principal: account.value,
    password: password.value
  }
  console.log('[登录] 登录参数:', payload)
  try {
    const res = await login(payload) as unknown as ApiResponse<LoginResponse>
    errorMsg.value = '' // 登录成功清空错误
    console.log('[登录] 登录成功:', res)
    // 保存 token
    setToken(res.data.token)
    localStorage.setItem('token', res.data.token)
    // 保存临时角色信息
    let role = res.data.role || ''
    const appStore = useAppStore()
    
    // 保存初始用户信息
    appStore.setUser({
      id: res.data.userId,
      role: res.data.role,
      account: res.data.account || account.value,
    })
    
    // 兼容 getMe 返回的 role
    try {
      const userInfo = await getMe() as unknown as ApiResponse<UserInfo>
      if (userInfo.data) {
        appStore.setUser(userInfo.data) // 用完整的用户信息更新
        if (userInfo.data.role) role = userInfo.data.role
      }
    } catch (e) {
      // getMe 失败时依然用登录返回的 role
      console.error('[登录] 获取用户信息失败:', e)
    }
    // 跳转到对应 dashboard
    let target = '/dashboard'
    if (role === 'SYSADMIN') target = '/dashboard/admin'
    else if (role === 'SCHOOL_ADMIN') target = '/dashboard/school'
    else if (role === 'ENTERPRISE_ADMIN') target = '/dashboard/company'
    else if (role === 'TEACHER') target = '/dashboard/teacher'
    else if (role === 'MENTOR') target = '/dashboard/mentor'
    else if (role === 'STUDENT') target = '/dashboard/student'
    router.push(target)
  } catch (e: any) {
    console.error('[登录] 登录失败:', e)
    errorMsg.value = e && e.message ? e.message : '登录失败，请检查账号、邮箱、手机号或密码是否正确'
  }
}

async function onGithubLogin() {
  try {
    const res = await getGithubLoginUrl() as unknown as ApiResponse<string>
    console.log('[GitHub登录] 获取登录URL成功:', res)
    // 获取到GitHub登录URL后，跳转到该URL进行OAuth认证
    const githubUrl =res.data+"/1112123123"
    console.log('[GitHub登录] 跳转到GitHub登录URL:', githubUrl)
    window.location.href = githubUrl
  } catch (e: any) {
    console.error('[GitHub登录] 获取登录URL失败:', e)
    errorMsg.value = e && e.message ? e.message : 'GitHub登录失败，请稍后再试'
  }
}

function onUnifiedLogin() {
  // TODO: 跳转到统一认证登录（如OAuth、CAS等）
  alert('跳转到统一认证登录（对接学校/企业统一身份认证）')
}
</script>