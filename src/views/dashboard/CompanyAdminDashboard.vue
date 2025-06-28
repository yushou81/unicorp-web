<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 relative">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-gray-900 mr-2">{{ company.value?.organizationName || '—' }}</span>
          </div>
          <div class="text-gray-500 text-sm">{{ company.value?.address || '—' }}</div>
        </div>
        <Button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑企业信息</Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
          <div class="flex items-center mb-4">
            <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
            <span class="font-semibold text-lg">{{ block.title }}</span>
          </div>
          <ul>
            <li v-for="item in block.data" :key="item.id || item" class="flex justify-between items-center mb-2 text-gray-700">
              <span>{{ item.label || item }}</span>
              <span v-if="item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
            </li>
            <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
          </ul>
          <div v-if="block.footer">
            <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.footer.text }}</router-link>
          </div>
        </div>
      </div>
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-bold text-blue-700">企业导师列表</h2>
          <Button @click="showAddMentorDialog = true">添加企业导师账号</Button>
        </div>
        <div v-if="mentorLoading" class="text-center text-gray-400 py-8">加载中...</div>
        <div v-else-if="mentorError" class="text-center text-red-500 py-8">{{ mentorError }}</div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="mentor in mentors" :key="mentor.id">
                <td class="px-4 py-2">{{ mentor.email }}</td>
                <td class="px-4 py-2">{{ mentor.nickname || '-' }}</td>
                <td class="px-4 py-2">{{ mentor.phone || '-' }}</td>
                <td class="px-4 py-2">{{ mentor.status || '-' }}</td>
              </tr>
              <tr v-if="mentors.length === 0">
                <td colspan="4" class="text-center text-gray-400 py-4">暂无导师</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end mt-4" v-if="mentorTotal > mentorSize">
            <button @click="mentorPage > 0 && (mentorPage--, fetchMentors())" :disabled="mentorPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
            <span class="text-sm text-gray-500">第 {{ mentorPage + 1 }} 页 / 共 {{ Math.ceil(mentorTotal / mentorSize) }} 页</span>
            <button @click="(mentorPage + 1) * mentorSize < mentorTotal && (mentorPage++, fetchMentors())" :disabled="(mentorPage + 1) * mentorSize >= mentorTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
          </div>
        </div>
      </div>
      <div v-if="showAddMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">添加企业导师账号</h2>
          <form @submit.prevent="onAddMentor">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">邮箱</label>
              <input v-model="newMentor.email" required class="w-full px-3 py-2 border rounded" placeholder="请输入导师邮箱" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">昵称</label>
              <input v-model="newMentor.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入导师昵称（可选）" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">手机号</label>
              <input v-model="newMentor.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号（可选）" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">初始密码</label>
              <input v-model="newMentor.password" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入初始密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showAddMentorDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" :disabled="addMentorLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ addMentorLoading ? '添加中...' : '添加' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="absolute top-14 right-8 z-50">
      <Button @click="onLogout" variant="outline" size="sm" class="text-xs">退出登录</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { BriefcaseIcon, ClipboardDocumentListIcon, BanknotesIcon, ShieldCheckIcon, BuildingOffice2Icon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getEnterpriseById } from '@/lib/api/organization'
import { getMentorList, createMentor } from '@/lib/api/enterpriseAdmin'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const appStore = useAppStore()

const company = ref<any>({})
const user = computed(() => appStore.user || {})

// 企业导师相关
const mentors = ref<any[]>([])
const mentorTotal = ref(0)
const mentorPage = ref(0)
const mentorSize = ref(10)
const mentorLoading = ref(false)
const mentorError = ref('')

async function fetchMentors() {
  mentorLoading.value = true
  mentorError.value = ''
  try {
    const res = await getMentorList({ page: mentorPage.value, size: mentorSize.value })
    mentors.value = res.data?.records || []
    mentorTotal.value = res.data?.total || mentors.value.length
  } catch (e: any) {
    mentorError.value = e.message || '获取导师列表失败'
    mentors.value = []
  } finally {
    mentorLoading.value = false
  }
}

const showAddMentorDialog = ref(false)
const newMentor = ref({ email: '', nickname: '', password: '', phone: '' })
const addMentorLoading = ref(false)

async function onAddMentor() {
  addMentorLoading.value = true
  try {
    await createMentor(newMentor.value)
    showAddMentorDialog.value = false
    newMentor.value = { email: '', nickname: '', password: '', phone: '' }
    await fetchMentors()
    alert('导师账号创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    addMentorLoading.value = false
  }
}

async function fetchCompany() {
  console.log('[企业dashboard] 当前user:', user.value)
  if (user.value.organization_id) {
    try {
      const res = await getEnterpriseById(user.value.organization_id)
      company.value = res.data || {}
      console.log('[企业dashboard] 获取到企业信息:', company.value)
    } catch (e) {
      company.value = { organizationName: '企业信息获取失败', address: '' }
      console.error('[企业dashboard] 获取企业信息失败:', e)
    }
  } else {
    company.value = { organizationName: '未找到企业ID', address: '' }
    console.warn('[企业dashboard] user.organization_id 为空')
  }
}

onMounted(() => {
  fetchCompany()
  fetchMentors()
})
watch(user, fetchCompany)

const partnerSchools = [
  '清华大学',
  '北京大学',
  '上海交通大学'
]
const blocks = ref([
  {
    title: '企业信息管理',
    icon: BuildingOffice2Icon,
    color: 'text-blue-600',
    data: [
      { id: 1, label: '概况', extra: '已完善' },
      { id: 2, label: '产业领域', extra: '互联网' },
      { id: 3, label: '招聘需求', extra: '2个岗位' },
      { id: 4, label: '合作案例', extra: '5个' }
    ],
    empty: '暂无信息',
    footer: { text: '编辑企业信息', link: '/company/info/edit' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: 'AI创新项目', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '职位/简历管理',
    icon: ClipboardDocumentListIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '前端开发实习生', extra: '5份简历' }
    ],
    empty: '暂无职位/简历',
    footer: { text: '管理职位/简历', link: '/job' }
  },
  {
    title: '经费管理',
    icon: BanknotesIcon,
    color: 'text-yellow-500',
    data: [
      { id: 1, label: '2024年项目经费', extra: '￥100,000' }
    ],
    empty: '暂无经费信息',
    footer: { text: '经费管理', link: '/project/fund' }
  },
  {
    title: '企业认证状态',
    icon: ShieldCheckIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '已认证', extra: '2024-01-01' }
    ],
    empty: '未认证',
    footer: { text: '查看认证详情', link: '/profile' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

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

function onLogout() {
  appStore.logout()
  router.push('/login')
}
</script> 