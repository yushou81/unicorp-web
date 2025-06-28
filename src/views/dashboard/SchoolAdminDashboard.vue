<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 relative">
    <div class="absolute top-6 right-8 z-50 flex items-center space-x-3">
      <!-- 用户信息 -->
      <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 px-3 py-1.5">
        <img :src="userAvatar" class="w-6 h-6 rounded-full border border-gray-300" alt="avatar" />
        <div class="text-xs">
          <div class="font-medium text-gray-800">{{ userInfo.nickname || userInfo.username || '学校管理员' }}</div>
          <div class="text-gray-500">{{ roleText }}</div>
        </div>
      </div>
      <Button @click="onLogout" variant="outline" size="sm" class="text-xs">退出登录</Button>
    </div>
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
        <img :src="school.logo" class="w-20 h-20 rounded border-2 border-blue-200 mr-6" alt="logo" />
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-gray-900 mr-2">{{ school.name }}</span>
            <span v-if="school.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
          </div>
          <div class="text-gray-500 text-sm mb-1">学校代码：{{ school.code }}</div>
          <div class="text-gray-500 text-sm">联系人：{{ school.contact }}</div>
        </div>
        <Button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow ml-2">编辑学校信息</Button>
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
      <Button class="mb-4" @click="showAddTeacherDialog = true">添加教师账号</Button>
      <div v-if="showAddTeacherDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">添加教师账号</h2>
          <form @submit.prevent="onAddTeacher">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">教师姓名</label>
              <input v-model="newTeacher.name" required class="w-full px-3 py-2 border rounded" placeholder="请输入教师姓名" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">账号</label>
              <input v-model="newTeacher.account" required class="w-full px-3 py-2 border rounded" placeholder="请输入账号" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">初始密码</label>
              <input v-model="newTeacher.password" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入初始密码" />
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showAddTeacherDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
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
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, ShieldCheckIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
const school = {
  logo: 'https://randomuser.me/api/portraits/lego/2.jpg',
  name: '清华大学',
  code: '10003',
  contact: '王五',
  verified: true
}
const partnerCompanies = [
  '字节跳动科技有限公司',
  '阿里巴巴集团',
  '腾讯科技有限公司'
]
const showAddTeacherDialog = ref(false)
const newTeacher = ref({ name: '', account: '', password: '' })
const teachers = [
  { id: 1, name: '李老师', account: 'teacher01' },
  { id: 2, name: '王老师', account: 'teacher02' }
]
const blocks = ref([
  {
    title: '学校信息管理',
    icon: BuildingOffice2Icon,
    color: 'text-blue-600',
    data: [
      { id: 1, label: '简介', extra: '已完善' },
      { id: 2, label: '专业设置', extra: '已完善' },
      { id: 3, label: '科研成果', extra: '3项' },
      { id: 4, label: '师资力量', extra: '20人' }
    ],
    empty: '暂无信息',
    footer: { text: '编辑学校信息', link: '/school/info/edit' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '智慧校园课题', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '教师管理',
    icon: AcademicCapIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '李老师', extra: 'teacher01' }
    ],
    empty: '暂无教师账号',
    footer: { text: '管理教师', link: '/teachers' }
  },
  {
    title: '资源管理',
    icon: DocumentTextIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无资源',
    footer: { text: '管理资源', link: '/resources' }
  },
  {
    title: '认证状态',
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
const router = useRouter()
const appStore = useAppStore()
const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/lego/2.jpg')
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
function onAddTeacher() {
  // TODO: 调用API添加教师账号
  alert(`已添加教师：${newTeacher.value.name}，账号：${newTeacher.value.account}`)
  showAddTeacherDialog.value = false
  newTeacher.value = { name: '', account: '', password: '' }
}
</script> 