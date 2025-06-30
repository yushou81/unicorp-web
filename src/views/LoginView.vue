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
      <button @click="onUnifiedLogin" class="w-full py-2 rounded bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 17l-4 4m0 0l-4-4m4 4V3"/></svg>
        使用学校/企业统一认证登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login, getMe } from '@/lib/api/auth'
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
  role?: 'SYSADMIN' | 'SCH_ADMIN' | 'EN_ADMIN' | 'TEACHER' | 'EN_TEACHER' | 'MENTOR' | 'STUDENT' | string;
  account?: string;
}

// 用户信息类型
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
    else if (role === 'SCH_ADMIN') target = '/dashboard/school'
    else if (role === 'EN_ADMIN') target = '/dashboard/company'
    else if (role === 'TEACHER') target = '/dashboard/teacher'
    else if (role === 'EN_TEACHER') target = '/dashboard/mentor'
    else if (role === 'STUDENT') target = '/dashboard/student'
    router.push(target)
  } catch (e: any) {
    console.error('[登录] 登录失败:', e)
    errorMsg.value = e && e.message ? e.message : '登录失败，请检查账号、邮箱、手机号或密码是否正确'
  }
}

function onUnifiedLogin() {
  // TODO: 跳转到统一认证登录（如OAuth、CAS等）
  alert('跳转到统一认证登录（对接学校/企业统一身份认证）')
}
</script>