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
            <select v-model="organizationId" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="schoolListLoading">
              <option value="">请选择学校</option>
              <option v-if="schoolListLoading" value="" disabled>加载中...</option>
              <option v-else-if="schoolListError" value="" disabled>加载失败</option>
              <option v-else v-for="school in schoolList" :key="school.id" :value="school.id">{{ school.organizationName }}</option>
            </select>
            <div v-if="schoolListError" class="mt-1 text-sm text-red-600">{{ schoolListError }}</div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">邮箱</label>
            <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">手机号</label>
            <input v-model="phone" type="tel" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入手机号" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">密码</label>
            <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">确认密码</label>
            <input v-model="confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请再次输入密码" />
          </div>
        </div>
        <div v-if="role === 'companyAdmin'">
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业名称 <span class="text-red-500">*</span></label>
            <input v-model="companyName" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业名称" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业简介</label>
            <textarea v-model="description" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业简介"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业地址</label>
            <input v-model="address" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业地址" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">在地图上选择位置</label>
            <div class="h-96 border rounded overflow-hidden">
              <MapLocationPicker 
                ref="locationPickerRef"
                @location-selected="handleLocationSelected"
              />
            </div>
            <div v-if="locationSelected" class="mt-2 text-sm text-green-600">
              已选择位置：{{ locationSelected.address.formatted_address }}
              <div class="text-xs text-gray-500">
                经度: {{ locationSelected.position.longitude.toFixed(6) }}, 
                纬度: {{ locationSelected.position.latitude.toFixed(6) }}
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业官网</label>
            <input v-model="website" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业官网" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">所属行业</label>
            <input v-model="industry" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入所属行业" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业规模</label>
            <input v-model="companySize" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入企业规模" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">企业logo <span class="text-red-500">*</span></label>
            <input type="file" @change="onLogoChange" accept="image/*" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="logoFile" class="mt-2">
              <img :src="logoPreview" alt="logo预览" class="max-h-32 rounded border" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">营业执照 <span class="text-red-500">*</span></label>
            <input type="file" @change="onLicenseChange" accept="image/*,application/pdf" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div v-if="businessLicenseFile" class="mt-2">
              <span>已选择文件：{{ businessLicenseFile.name }}</span>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">管理员昵称</label>
            <input v-model="contactName" type="text" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员昵称" />
          </div>
          <div class="mb-4 flex items-center">
            <label class="block text-gray-700 mb-1 mr-2">管理员邮箱 <span class="text-red-500">*</span></label>
            <input v-model="email" type="email" required class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员邮箱" />
            <button type="button" @click="sendVerificationCode" :disabled="countdown > 0" class="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
              {{ countdown > 0 ? countdown + '秒后重试' : '获取验证码' }}
            </button>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">邮箱验证码 <span class="text-red-500">*</span></label>
            <input v-model="emailVerificationCode" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入邮箱验证码" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">管理员手机号（选填）</label>
            <input v-model="phone" type="tel" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员手机号" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">管理员密码 <span class="text-red-500">*</span></label>
            <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">确认密码</label>
            <input v-model="confirmPassword" type="password" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请再次输入密码" />
          </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { registerStudent, registerEnterprise } from '@/lib/api/auth'
import { getAllSchools } from '@/lib/api/organization'
import MapLocationPicker from '@/components/map/MapLocationPicker.vue'
import { apiRequest } from '@/lib/api/apiClient'

// 定义位置信息接口
interface LocationInfo {
  position: {
    longitude: number;
    latitude: number;
  };
  address: {
    formatted_address: string;
    [key: string]: any;
  };
}

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
const schoolList = ref<{ id: number, organizationName: string }[]>([])
const schoolListLoading = ref(false)
const schoolListError = ref('')
// 企业管理员专属
const companyName = ref('')
const description = ref('')
const address = ref('')
const website = ref('')
const industry = ref('')
const companySize = ref('')
const contactName = ref('')
const router = useRouter()
const businessLicenseUrl = ref('')

// 地图位置选择相关
const locationPickerRef = ref<InstanceType<typeof MapLocationPicker> | null>(null)
const locationSelected = ref<LocationInfo | null>(null)
const latitude = ref(0)
const longitude = ref(0)

// 处理位置选择
const handleLocationSelected = (location: LocationInfo) => {
  locationSelected.value = location
  
  // 更新经纬度
  if (location && location.position) {
    latitude.value = location.position.latitude
    longitude.value = location.position.longitude
    
    // 如果地址栏为空，自动填入地址
    if (!address.value && location.address && location.address.formatted_address) {
      address.value = location.address.formatted_address
    }
  }
  
  // 选择位置后关闭搜索结果
  if (locationPickerRef.value) {
    locationPickerRef.value.clearSearchResults()
  }
}

// 获取学校列表
async function fetchSchoolList() {
  schoolListLoading.value = true
  schoolListError.value = ''
  try {
    const res: any = await getAllSchools('simple')
    console.log('[注册] 获取学校列表成功:', res)
    schoolList.value = res.data || []
  } catch (e: any) {
    console.error('[注册] 获取学校列表失败:', e)
    schoolListError.value = e.message || '获取学校列表失败'
    schoolList.value = []
  } finally {
    schoolListLoading.value = false
  }
}

// 监听角色变化，重新获取学校列表
watch(role, (newRole) => {
  if (newRole === 'student') {
    fetchSchoolList()
  }
})

onMounted(async () => {
  // 初始获取学校列表
  await fetchSchoolList()
})

function isValidPhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone)
}

const logoFile = ref<File|null>(null)
const logoPreview = ref('')
const businessLicenseFile = ref<File|null>(null)
function onLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  logoFile.value = file
  logoPreview.value = file ? URL.createObjectURL(file) : ''
}
function onLicenseChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  businessLicenseFile.value = file
}

const emailVerificationCode = ref('')
const countdown = ref(0)
let timer: any = null

function validateEmail(email: string) {
  return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)
}

async function sendVerificationCode() {
  if (!email.value || !validateEmail(email.value)) {
    alert('请输入有效的邮箱')
    return
  }
  try {
    await apiRequest('/v1/email/verification-code', {
      method: 'GET',
      params: { email: email.value }
    })
    alert('验证码已发送，请查收邮件')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e: any) {
    alert(e.message || '验证码发送失败')
  }
}

async function onRegister() {
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  if (role.value === 'companyAdmin') {
    if (!companyName.value || !email.value || !password.value || !logoFile.value || !businessLicenseFile.value || !emailVerificationCode.value) {
      alert('请填写所有必填项，包括验证码')
      return
    }
    if (!validateEmail(email.value)) {
      alert('请输入有效的邮箱')
      return
    }
    if (phone.value && !isValidPhone(phone.value)) {
      alert('管理员手机号格式不正确')
      return
    }
    if (logoFile.value && logoFile.value.size > 2 * 1024 * 1024) {
      alert('logo文件不能超过2M')
      return
    }
    if (businessLicenseFile.value && businessLicenseFile.value.size > 5 * 1024 * 1024) {
      alert('营业执照不能超过5M')
      return
    }
    const formData = new FormData()
    formData.append('organizationName', companyName.value)
    if (description.value) formData.append('description', description.value)
    if (address.value) formData.append('address', address.value)
    if (website.value) formData.append('website', website.value)
    if (industry.value) formData.append('industry', industry.value)
    if (companySize.value) formData.append('companySize', companySize.value)
    if (contactName.value) formData.append('adminNickname', contactName.value)
    formData.append('adminEmail', email.value)
    formData.append('adminPassword', password.value)
    formData.append('emailVerificationCode', emailVerificationCode.value)
    if (phone.value) formData.append('adminPhone', phone.value)
    if (latitude.value) formData.append('latitude', latitude.value.toString())
    if (longitude.value) formData.append('longitude', longitude.value.toString())
    formData.append('logo', logoFile.value)
    formData.append('businessLicense', businessLicenseFile.value)
    for (let [key, value] of formData.entries()) {
      console.log('[企业注册FormData]', key, value)
    }
    try {
      const res = await registerEnterprise(formData)
      alert('企业注册申请已提交，待审核后可登录')
      router.push('/login')
    } catch (e: any) {
      alert(e.message || '注册失败')
    }
    return
  }
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
    organizationId: Number(organizationId.value),
    realName: realName.value,
    idCard: idCard.value
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
}
</script>

<style scoped>
/* 确保地图定位组件在表单中显示正常 */
:deep(.map-location-picker) {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}
:deep(.map-container) {
  height: 100%;
}
:deep(.search-container) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
</style>