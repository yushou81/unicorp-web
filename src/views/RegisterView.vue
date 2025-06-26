<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-700 mb-6">校企联盟平台注册</h2>
      <form @submit.prevent="onRegister">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">注册类型</label>
          <select v-model="role" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="student">学生</option>
            <option value="companyAdmin">企业管理员</option>
          </select>
        </div>
        <div v-if="role === 'student'">
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">用户名</label>
            <input v-model="username" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入用户名" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">邮箱</label>
            <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="phone" type="tel" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入手机号" />
          </div>
        </div>
        <div v-if="role === 'companyAdmin'">
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业名称</label>
            <input v-model="companyName" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业名称" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业统一社会信用代码</label>
            <input v-model="companyCode" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入统一社会信用代码" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">联系人姓名</label>
            <input v-model="contactName" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入联系人姓名" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">联系人邮箱</label>
            <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">联系人手机号</label>
            <input v-model="phone" type="tel" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入手机号" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">营业执照上传</label>
            <input type="file" accept="image/*" @change="onLicenseChange" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="licensePreview" class="mt-2">
              <img :src="licensePreview" alt="营业执照预览" class="max-h-32 rounded border" />
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">密码</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-1">确认密码</label>
          <input v-model="confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请再次输入密码" />
        </div>
        <div class="flex items-center justify-between mb-6">
          <router-link to="/login" class="text-blue-600 hover:underline text-sm">已有账号？登录</router-link>
        </div>
        <button type="submit" class="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">注册</button>
      </form>
      <div class="mt-4 text-xs text-gray-400 text-center">
        注册后信息将进入审核流程，审核通过后可正常使用平台功能。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const role = ref<'student' | 'companyAdmin'>('student')
const username = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
// 企业管理员专属
const companyName = ref('')
const companyCode = ref('')
const contactName = ref('')
const router = useRouter()
const licenseFile = ref<File|null>(null)
const licensePreview = ref<string>('')

function onLicenseChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    licenseFile.value = files[0]
    const reader = new FileReader()
    reader.onload = (ev) => {
      licensePreview.value = ev.target?.result as string
    }
    reader.readAsDataURL(files[0])
  } else {
    licenseFile.value = null
    licensePreview.value = ''
  }
}

function onRegister() {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  if (role.value === 'student') {
    if (!username.value || !email.value || !phone.value || !password.value) {
      alert('请填写完整信息')
      return
    }
    // TODO: 调用API注册学生
  } else if (role.value === 'companyAdmin') {
    if (!companyName.value || !companyCode.value || !contactName.value || !email.value || !phone.value || !password.value || !licenseFile.value) {
      alert('请填写完整企业信息并上传营业执照')
      return
    }
    // TODO: 调用API注册企业管理员，上传licenseFile，进入审核
  }
  alert('注册信息已提交，待管理员审核后可登录。')
  router.push('/login')
}
</script>