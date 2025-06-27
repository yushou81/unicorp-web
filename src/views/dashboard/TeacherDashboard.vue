<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
        <img :src="teacher.avatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-gray-900 mr-2">{{ teacher.name }}</span>
            <span v-if="teacher.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
          </div>
          <div class="text-gray-500 text-sm mb-1">{{ teacher.email }}</div>
          <div class="text-gray-500 text-sm">{{ teacher.phone }}</div>
          <div class="text-gray-500 text-sm mt-1">所属学校：{{ teacher.school || '未绑定' }}</div>
        </div>
        <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { UserGroupIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpTrayIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'

const teacher = {
  avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  name: '李老师',
  email: 'teacher@example.com',
  phone: '139****8888',
  verified: true,
  school: '清华大学',
  company: '字节跳动科技有限公司'
}

const students = [
  { id: 1, name: '王五', major: '计算机' },
  { id: 2, name: '赵六', major: '人工智能' }
]
const projects = [
  { id: 1, title: '智慧校园课题', date: '2024-06-01' },
  { id: 2, title: 'AI创新实验', date: '2024-05-15' }
]
const resources = [
  { id: 1, title: '教师教学资源', date: '2024-06-20' }
]
const blocks = ref([
  {
    title: '双师课堂管理',
    icon: UserGroupIcon,
    color: 'text-blue-500',
    data: [
      { id: 1, label: '创新创业指导', extra: '2024-07-10' }
    ],
    empty: '暂无课程',
    footer: { text: '管理课程', link: '/courses' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: '智慧校园课题', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '学生成果查看',
    icon: AcademicCapIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: '全国大学生数学建模竞赛一等奖', extra: '张三' }
    ],
    empty: '暂无成果',
    footer: { text: '查看全部成果', link: '/achievements' }
  },
  {
    title: '资源上传',
    icon: ArrowUpTrayIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无上传资源',
    footer: { text: '上传资源', link: '/resources' }
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
</script> 