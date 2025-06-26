<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-700 mb-6">校企联盟平台登录</h2>
      <form @submit.prevent="onLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">邮箱/手机号/用户名</label>
          <input v-model="account" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入账号" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const account = ref('')
const password = ref('')
const router = useRouter()

function onLogin() {
  if (account.value && password.value) {
    // TODO: 调用API登录
    router.push('/dashboard')
  }
}

function onUnifiedLogin() {
  // TODO: 跳转到统一认证登录（如OAuth、CAS等）
  alert('跳转到统一认证登录（对接学校/企业统一身份认证）')
}
</script>