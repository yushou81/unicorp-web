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
            <label class="block text-gray-700 mb-1">真实姓名</label>
            <input v-model="realName" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入真实姓名" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">身份证号</label>
            <input v-model="idCard" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入身份证号" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">学校</label>
            <select v-model="organizationId" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">请选择学校</option>
              <option v-for="school in schoolList" :key="school.id" :value="school.id">{{ school.name }}</option>
            </select>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { registerStudent, registerEnterprise } from '@/lib/api/auth'
import { getSchoolList } from '@/lib/api/organization'

const role = ref<'student' | 'companyAdmin'>('student')
const username = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
// 新增学生注册必填项
const realName = ref('')
const idCard = ref('')
const organizationId = ref('')
const schoolList = ref<{ id: number, name: string }[]>([])
// 企业管理员专属
const companyName = ref('')
const companyCode = ref('')
const contactName = ref('')
const router = useRouter()
const licenseFile = ref<File|null>(null)
const licensePreview = ref<string>('')

onMounted(async () => {
  if (role.value === 'student') {
    try {
      schoolList.value = await getSchoolList()
    } catch (e) {
      schoolList.value = []
    }
  }
})

async function uploadLicense(file: File): Promise<string> {
  // TODO: 实际应调用后端上传接口，这里mock返回base64
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => resolve(ev.target?.result as string)
    reader.readAsDataURL(file)
  })
}

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

function isValidPhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone)
}

async function onRegister() {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  if (role.value === 'student') {
    if (!username.value || !email.value || !phone.value || !password.value || !realName.value || !idCard.value || !organizationId.value) {
      alert('请填写完整信息，包括真实姓名、身份证号和学校')
      return
    }
    if (!isValidPhone(phone.value)) {
      alert('手机号格式不正确')
      return
    }
    const studentPayload = {
      nickname: username.value,
      password: password.value,
      email: email.value,
      phone: phone.value,
      organization_id: Number(organizationId.value),
      real_name: realName.value,
      id_card: idCard.value
    }
    console.log('[注册] 学生注册参数:', studentPayload)
    try {
      const res = await registerStudent(studentPayload)
      console.log('[注册] 学生注册成功:', res)
      alert('注册成功，请登录')
      router.push('/login')
    } catch (e: any) {
      console.error('[注册] 学生注册失败:', e)
      alert(e.message || '注册失败')
    }
  } else if (role.value === 'companyAdmin') {
    if (!companyName.value || !companyCode.value || !contactName.value || !email.value || !phone.value || !password.value || !licenseFile.value) {
      alert('请填写完整企业信息并上传营业执照')
      return
    }
    try {
      const licenseUrl = await uploadLicense(licenseFile.value)
      const enterprisePayload = {
        organization_name: companyName.value,
        description: '',
        address: '',
        website: '',
        industry: '',
        company_size: '',
        business_license_url: licenseUrl,
        admin_email: email.value,
        admin_nickname: contactName.value,
        admin_password: password.value,
        admin_phone: phone.value
      }
      console.log('[注册] 企业注册参数:', enterprisePayload)
      const res = await registerEnterprise(enterprisePayload)
      console.log('[注册] 企业注册成功:', res)
      alert('企业注册申请已提交，待审核后可登录')
      router.push('/login')
    } catch (e: any) {
      console.error('[注册] 企业注册失败:', e)
      alert(e.message || '注册失败')
    }
  }
}
</script>