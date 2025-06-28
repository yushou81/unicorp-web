<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 relative">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h1 class="text-3xl font-bold mb-2 text-blue-700">平台管理后台</h1>
        <p class="text-gray-600">系统概览与数据统计</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
            <span class="text-2xl font-bold text-blue-700">1,234</span>
            <span class="text-gray-500 mt-2">用户总数</span>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
            <span class="text-2xl font-bold text-blue-700">56</span>
            <span class="text-gray-500 mt-2">机构数量</span>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
            <span class="text-2xl font-bold text-blue-700">789</span>
            <span class="text-gray-500 mt-2">申报项目</span>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
            <span class="text-2xl font-bold text-blue-700">98%</span>
            <span class="text-gray-500 mt-2">系统活跃度</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- 操作日志卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div class="flex items-center mb-2">
            <ClipboardDocumentListIcon class="w-7 h-7 mr-2 text-yellow-500" />
            <span class="font-semibold text-lg">操作日志</span>
          </div>
          <div class="flex-1 text-gray-500 text-sm mb-2">点击下方进入</div>
          <router-link to="/logs" class="text-blue-600 hover:underline text-xs font-medium mt-auto">查看操作日志</router-link>
        </div>
        <!-- 账户管理卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div class="flex items-center mb-2">
            <UserGroupIcon class="w-7 h-7 mr-2 text-blue-500" />
            <span class="font-semibold text-lg">账户管理</span>
          </div>
          <ul class="flex-1 mb-2">
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>admin</span><span class="text-xs text-gray-400">平台管理员</span></li>
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>school_admin</span><span class="text-xs text-gray-400">学校管理员</span></li>
            <li class="flex justify-between items-center text-gray-700 text-sm mb-1"><span>company_admin</span><span class="text-xs text-gray-400">企业管理员</span></li>
          </ul>
          <router-link to="/accounts" class="text-blue-600 hover:underline text-xs font-medium mt-auto">管理所有账户</router-link>
        </div>
        <!-- 常见操作卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div class="flex items-center mb-2">
            <Cog6ToothIcon class="w-7 h-7 mr-2 text-green-500" />
            <span class="font-semibold text-lg">常见操作</span>
          </div>
          <ul class="flex-1 mb-2">
            <li class="text-gray-700 text-sm mb-1">添加学校</li>
            <li class="text-gray-700 text-sm mb-1">添加企业</li>
            <li class="text-gray-700 text-sm mb-1">重置用户密码</li>
          </ul>
          <router-link to="/admin/actions" class="text-blue-600 hover:underline text-xs font-medium mt-auto">查看更多操作</router-link>
        </div>
      </div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-700">学校与企业列表</h2>
        <Button class="ml-2" @click="showAddSchoolDialog = true">添加学校</Button>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-bold mb-4 text-blue-700">待审核企业</h2>
        <div v-if="pendingEnterprises.length === 0" class="text-gray-400 text-center py-8">暂无待审核企业</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">企业名称</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">简介</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">网址</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">地址</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="org in pendingEnterprises" :key="org.id">
                <td class="px-4 py-2">{{ org.organizationName }}</td>
                <td class="px-4 py-2">{{ org.description || '-' }}</td>
                <td class="px-4 py-2">{{ org.website || '-' }}</td>
                <td class="px-4 py-2">{{ org.address || '-' }}</td>
                <td class="px-4 py-2">
                  <Button variant="outline" size="sm" :loading="approveLoadingId === org.id" @click="onApproveEnterprise(org.id)">审核</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-bold mb-4 text-blue-700">学校列表</h2>
        <div v-if="publicSchoolsLoading" class="text-center text-gray-400 py-8">加载中...</div>
        <div v-else-if="publicSchoolsError" class="text-center text-red-500 py-8">{{ publicSchoolsError }}</div>
        <div v-else>
          <div v-if="publicSchools.length === 0" class="text-gray-400 text-center py-8">暂无已批准学校</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="key in schoolTableKeys" :key="key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ schoolTableHeaders[key] }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="school in publicSchools" :key="school.id">
                  <td v-for="key in schoolTableKeys" :key="key" class="px-4 py-2">
                    <template v-if="key === 'website'">
                      <a v-if="school[key]" :href="school[key]" target="_blank" class="text-blue-600 hover:underline">{{ school[key] }}</a>
                      <span v-else>-</span>
                    </template>
                    <template v-else>
                      {{ school[key] ?? '-' }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-bold mb-4 text-blue-700">企业列表</h2>
        <div v-if="publicEnterprisesLoading" class="text-center text-gray-400 py-8">加载中...</div>
        <div v-else-if="publicEnterprisesError" class="text-center text-red-500 py-8">{{ publicEnterprisesError }}</div>
        <div v-else>
          <div v-if="publicEnterprises.length === 0" class="text-gray-400 text-center py-8">暂无已批准企业</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="key in enterpriseTableKeys" :key="key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ enterpriseTableHeaders[key] }}</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="enterprise in publicEnterprises" :key="enterprise.id">
                  <td v-for="key in enterpriseTableKeys" :key="key" class="px-4 py-2">
                    <template v-if="key === 'website'">
                      <a v-if="enterprise[key]" :href="enterprise[key]" target="_blank" class="text-blue-600 hover:underline">{{ enterprise[key] }}</a>
                      <span v-else>-</span>
                    </template>
                    <template v-else>
                      {{ enterprise[key] ?? '-' }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="showAddSchoolDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-t-4 border-blue-600">
          <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center"><Building2 class="w-6 h-6 mr-2" />添加新学校</h2>
          <form @submit.prevent="onAddSchool">
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">学校名称</label>
              <input v-model="newSchool.organizationName" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入学校名称" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">学校简介</label>
              <textarea v-model="newSchool.description" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入简介"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">地址</label>
              <input v-model="newSchool.address" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入地址" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">网址</label>
              <input v-model="newSchool.website" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入网址" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">管理员邮箱</label>
              <input v-model="newSchool.adminEmail" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员邮箱" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">管理员昵称</label>
              <input v-model="newSchool.adminNickname" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入管理员昵称（可选）" />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 mb-1 font-medium">初始密码</label>
              <input v-model="newSchool.adminPassword" type="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="请输入初始密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showAddSchoolDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">取消</button>
              <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="absolute top-14 right-8 z-50">
      <Button @click="onLogout" variant="outline">退出登录</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Building2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ClipboardDocumentListIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { apiRequest } from '@/lib/api/apiClient'
import { createSchool, getPendingOrganizations, approveEnterprise, getPendingEnterprises } from '@/lib/api/admin'
import { setToken } from '@/lib/api/apiClient'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getAllSchools, getAllEnterprises } from '@/lib/api/organization'

const showAddSchoolDialog = ref(false)
const newSchool = ref({
  organizationName: '',
  description: '',
  address: '',
  website: '',
  adminEmail: '',
  adminNickname: '',
  adminPassword: ''
})
const organizations = ref([])
const publicSchools = ref<any[]>([])
const publicSchoolsLoading = ref(true)
const publicSchoolsError = ref('')
const schoolTableKeys = ref<string[]>([])
const schoolTableHeaders = ref<Record<string, string>>({})
const approveLoadingId = ref<number | null>(null)
const publicEnterprises = ref<any[]>([])
const publicEnterprisesLoading = ref(true)
const publicEnterprisesError = ref('')
const enterpriseTableKeys = ref<string[]>([])
const enterpriseTableHeaders = ref<Record<string, string>>({})

const router = useRouter()
const appStore = useAppStore()

// 页面加载时自动设置 token
const token = localStorage.getItem('token')
if (token) setToken(token)

onMounted(async () => {
  try {
    const res = await getPendingOrganizations()
    organizations.value = res.data || []
  } catch (e) {
    organizations.value = []
  }
  // 获取公开学校列表
  publicSchoolsLoading.value = true
  publicSchoolsError.value = ''
  try {
    const res = await getAllSchools('detailed')
    publicSchools.value = res.data || []
    // 自动提取所有字段作为表头，过滤掉id字段
    if (publicSchools.value.length > 0) {
      const allKeys = Object.keys(publicSchools.value[0])
      schoolTableKeys.value = allKeys.filter(key => key !== 'id')
      // 设置中文表头映射
      schoolTableHeaders.value = {
        organizationName: '学校名称',
        description: '简介',
        website: '网址',
        address: '地址',
        adminEmail: '管理员邮箱',
        adminNickname: '管理员昵称',
        status: '状态',
        type: '类型',
        createdAt: '创建时间',
        updatedAt: '更新时间'
      }
    }
  } catch (e: any) {
    publicSchoolsError.value = e.message || '获取学校列表失败'
  } finally {
    publicSchoolsLoading.value = false
  }
  // 获取公开企业列表
  publicEnterprisesLoading.value = true
  publicEnterprisesError.value = ''
  try {
    const res = await getAllEnterprises('detailed')
    publicEnterprises.value = res.data || []
    // 自动提取所有字段作为表头，过滤掉id字段
    if (publicEnterprises.value.length > 0) {
      const allKeys = Object.keys(publicEnterprises.value[0])
      enterpriseTableKeys.value = allKeys.filter(key => key !== 'id')
      // 设置中文表头映射
      enterpriseTableHeaders.value = {
        organizationName: '企业名称',
        description: '简介',
        website: '网址',
        address: '地址',
        industry: '行业',
        companySize: '企业规模',
        adminEmail: '管理员邮箱',
        adminNickname: '管理员昵称',
        status: '状态',
        type: '类型',
        createdAt: '创建时间',
        updatedAt: '更新时间'
      }
    }
  } catch (e: any) {
    publicEnterprisesError.value = e.message || '获取企业列表失败'
  } finally {
    publicEnterprisesLoading.value = false
  }
})

const pendingEnterprises = computed(() =>
  organizations.value.filter(org => org.type === 'Enterprise')
)

async function onAddSchool() {
  // 简单校验
  if (!newSchool.value.organizationName || !newSchool.value.adminEmail || !newSchool.value.adminPassword) {
    alert('学校名称、管理员邮箱和初始密码为必填项！')
    return
  }
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('请先登录管理员账号！')
      return
    }
    await createSchool(newSchool.value)
    alert(`已添加学校：${newSchool.value.organizationName}`)
    showAddSchoolDialog.value = false
    newSchool.value = { organizationName: '', description: '', address: '', website: '', adminEmail: '', adminNickname: '', adminPassword: '' }
  } catch (e: any) {
    alert('添加失败：' + (e.message || '未知错误'))
  }
}

function onLogout() {
  appStore.logout()
  router.push('/login')
}

async function onApproveEnterprise(id: number) {
  if (approveLoadingId.value) return
  approveLoadingId.value = id
  try {
    await approveEnterprise(id)
    // 审核成功后刷新待审核企业列表
    const res = await getPendingEnterprises()
    organizations.value = res.data || []
  } catch (e: any) {
    alert(e.message || '审核失败')
  } finally {
    approveLoadingId.value = null
  }
}

const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg')
const roleText = computed(() => {
  const role = userInfo.value.role
  const roleMap: Record<string, string> = {
    'admin': '系统管理员',
    'SYSADMIN': '系统管理员',
    'schoolAdmin': '学校管理员',
    'SCH_ADMIN': '学校管理员',
    'companyAdmin': '企业管理员',
    'EN_ADMIN': '企业管理员',
    'teacher': '教师',
    'TEACHER': '教师',
    'mentor': '企业导师',
    'MENTOR': '企业导师',
    'student': '学生',
    'STUDENT': '学生'
  }
  return roleMap[role] || '未知角色'
})
</script> 