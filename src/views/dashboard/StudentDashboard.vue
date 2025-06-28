<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 relative">
    <div class="container mx-auto px-4">
      <!-- 个人资料卡片 -->
      <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
        <img :src="user.avatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-gray-900 mr-2">{{ user.nickname }}</span>
            <span v-if="user.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
          </div>
          <div class="text-gray-500 text-sm mb-1">{{ user.email }}</div>
          <div class="text-gray-500 text-sm">{{ user.phone }}</div>
          <div class="text-gray-500 text-sm mt-1">所属学校：{{ user.school || '未绑定' }}</div>
        </div>
        <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
          <div class="flex items-center mb-4">
            <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
            <span class="font-semibold text-lg">{{ block.title }}</span>
          </div>
          <div v-if="block.type === 'list'">
            <ul>
              <li v-for="item in block.data" :key="item.id" class="flex justify-between items-center mb-2 text-gray-700">
                <span>{{ item.label }}</span>
                <span v-if="item.status" class="text-xs px-2 py-0.5 rounded" :class="item.statusColor">{{ item.status }}</span>
                <span v-if="item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
              </li>
              <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
            </ul>
          </div>
          <div v-else-if="block.type === 'count'">
            <div class="mb-2 text-sm text-gray-700">共 {{ block.count }} 项</div>
            <ul>
              <li v-for="item in block.data" :key="item.id" class="flex justify-between items-center mb-1">
                <span>{{ item.label }}</span>
                <span class="text-xs text-gray-400">{{ item.extra }}</span>
              </li>
              <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
            </ul>
          </div>
          <div v-else-if="block.type === 'link'">
            <router-link :to="block.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.linkText }}</router-link>
          </div>
          <div v-if="block.footer">
            <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.footer.text }}</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute top-14 right-8 z-50">
      <Button @click="onLogout" variant="outline">退出登录</Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { ref, computed } from 'vue'
import { BriefcaseIcon, BookmarkIcon, AcademicCapIcon, CalendarDaysIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const user = useAppStore().user || {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '张三',
  email: 'zhangsan@example.com',
  phone: '138****8888',
  verified: true,
  school: '清华大学'
}
// 最近投递岗位
const appliedJobs = [
  { id: 1, title: '前端开发实习生', status: '待处理' },
  { id: 2, title: '产品助理', status: '已录用' }
]
// 推荐岗位
const recommendedJobs = [
  { id: 3, title: '数据分析实习生', company: '字节跳动' },
  { id: 4, title: '运营实习生', company: '腾讯科技' }
]
// 成果摘要
const achievements = [
  { id: 1, title: '全国大学生数学建模竞赛一等奖', date: '2024-05-10' },
  { id: 2, title: 'AI创新项目论文', date: '2024-04-22' }
]
// 双师课堂
const dualCourses = [
  { id: 1, title: '大数据实战', teacher: '李老师', date: '2024-07-01' },
  { id: 2, title: '创新创业指导', teacher: '王导师', date: '2024-07-10' }
]
// 资源动态
const resources = [
  { id: 1, title: '深度学习公开课PPT', date: '2024-06-20' },
  { id: 2, title: '实验室设备借用', date: '2024-06-18' }
]

const blocks = ref([
  {
    title: '收藏/投递职位',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '前端开发实习生', extra: '已投递' },
      { id: 2, label: '产品助理', extra: '已收藏' }
    ],
    empty: '暂无职位记录',
    footer: { text: '查看全部职位', link: '/job' }
  },
  {
    title: '学习记录',
    icon: AcademicCapIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '2024-04-22' }
    ],
    empty: '暂无学习记录',
    footer: { text: '管理我的学习', link: '/learn' }
  },
  {
    title: '报名课程',
    icon: CalendarDaysIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '大数据实战', extra: '2024-07-01' }
    ],
    empty: '暂无报名课程',
    footer: { text: '查看全部课程', link: '/courses' }
  },
  {
    title: '企业申请入口',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-500',
    data: [],
    empty: '如有意向加入企业项目，请点击下方入口',
    footer: { text: '申请加入企业项目', link: '/apply' }
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

function onLogout() {
  appStore.logout()
  router.push('/login')
}

const userInfo = computed(() => appStore.user || {})
const userAvatar = computed(() => userInfo.value.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')
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