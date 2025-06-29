<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 relative">
    <div class="absolute top-6 right-8 z-50 flex items-center space-x-3">
      <!-- 用户信息 -->
      <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 px-3 py-1.5">
        <img :src="userAvatar" class="w-6 h-6 rounded-full border border-gray-300" alt="avatar" />
        <div class="text-xs">
          <div class="font-medium text-gray-800">{{ userInfo.nickname || userInfo.username || '企业管理员' }}</div>
          <div class="text-gray-500">{{ roleText }}</div>
        </div>
      </div>
      <Button @click="onLogout" variant="outline" size="sm" class="text-xs">退出登录</Button>
    </div>
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
        <img :src="company.logo" class="w-20 h-20 rounded border-2 border-blue-200 mr-6" alt="logo" />
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-gray-900 mr-2">{{ company.name }}</span>
            <span v-if="company.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
          </div>
          <div class="text-gray-500 text-sm mb-1">统一社会信用代码：{{ company.code }}</div>
          <div class="text-gray-500 text-sm">联系人：{{ company.contact }}</div>
        </div>
        <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑企业信息</button>
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
          <div v-if="block.footer" class="flex flex-col space-y-1">
            <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium">
              {{ block.footer.text }}
            </router-link>
            <router-link v-if="block.footer.extra" :to="block.footer.extra.link" class="text-green-600 hover:underline text-xs font-medium">
              {{ block.footer.extra.text }}
            </router-link>
          </div>
        </div>
      </div>
      <Button class="mb-4" @click="showAddMentorDialog = true">添加企业导师账号</Button>
      <div v-if="showAddMentorDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">添加企业导师账号</h2>
          <form @submit.prevent="onAddMentor">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">导师姓名</label>
              <input v-model="newMentor.name" required class="w-full px-3 py-2 border rounded" placeholder="请输入导师姓名" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">账号</label>
              <input v-model="newMentor.account" required class="w-full px-3 py-2 border rounded" placeholder="请输入账号" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">初始密码</label>
              <input v-model="newMentor.password" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入初始密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showAddMentorDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white">添加</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { BriefcaseIcon, ClipboardDocumentListIcon, BanknotesIcon, ShieldCheckIcon, BuildingOffice2Icon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const company = {
  logo: 'https://randomuser.me/api/portraits/lego/1.jpg',
  name: '字节跳动科技有限公司',
  code: '91310000MA1K4XXXX',
  contact: '李四',
  verified: false
}
const partnerSchools = [
  '清华大学',
  '北京大学',
  '上海交通大学'
]
const showAddMentorDialog = ref(false)
const newMentor = ref({ name: '', account: '', password: '' })
const mentors = [
  { id: 1, name: '王导师', account: 'mentor01' },
  { id: 2, name: '赵导师', account: 'mentor02' }
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
    footer: { 
      text: '管理项目', 
      link: '/company/projects',
      extra: { text: '发布新项目', link: '/project/publish' }
    }
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

function onAddMentor() {
  // TODO: 调用API添加企业导师账号
  alert(`已添加导师：${newMentor.value.name}，账号：${newMentor.value.account}`)
  showAddMentorDialog.value = false
  newMentor.value = { name: '', account: '', password: '' }
}
</script> 