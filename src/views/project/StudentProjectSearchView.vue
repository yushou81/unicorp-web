<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
         <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">项目申请管理</h2>
      <!-- 搜索框 -->
      <div class="flex justify-center mb-6">
        <input
          v-model="keyword"
          @keyup.enter="fetchProjects"
          type="text"
          placeholder="请输入项目名称/项目编号"
          class="flex-1 max-w-2xl border border-blue-400 rounded-l-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
        <button
          @click="fetchProjects"
          class="px-8 py-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base"
        >查找</button>
      </div>
      <!-- 筛选栏 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">按条件选择项目</h2>
        <!-- 筛选项横向滚动 -->
        <div class="space-y-4">
          <!-- 项目难度 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">项目难度：</span>
            <div class="flex space-x-2">
              <button
                v-for="item in difficultyOptions"
                :key="item"
                @click="selectFilter('difficulty', item)"
                :class="isSelected('difficulty', item) ? activeBtn : inactiveBtn"
                class="mb-2"
              >{{ item }}</button>
            </div>
          </div>
          <!-- 支持语言 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">支持语言：</span>
            <div class="flex space-x-2">
              <button
                v-for="item in languageOptions"
                :key="item"
                @click="selectFilter('language', item)"
                :class="isSelected('language', item) ? activeBtn : inactiveBtn"
                class="mb-2"
              >{{ item }}</button>
            </div>
          </div>
          <!-- 技术领域 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">技术领域：</span>
            <div class="flex space-x-2">
              <button
                v-for="item in techOptions"
                :key="item"
                @click="selectFilter('tech', item)"
                :class="isSelected('tech', item) ? activeBtn : inactiveBtn"
                class="mb-2"
              >{{ item }}</button>
            </div>
          </div>
          <!-- 编程语言 -->
          <div class="flex items-center flex-wrap overflow-x-auto">
            <span class="mr-4 font-medium whitespace-nowrap">编程语言：</span>
            <div class="flex space-x-2">
              <button
                v-for="item in codeOptions"
                :key="item"
                @click="selectFilter('code', item)"
                :class="isSelected('code', item) ? activeBtn : inactiveBtn"
                class="mb-2"
              >{{ item }}</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 切换Tab按钮 -->
      <div class="flex justify-center mb-8">
        <button
          :class="tab === 'apply' ? activeTabClass : inactiveTabClass"
          @click="tab = 'apply'; fetchProjects()"
        >申请加入项目</button>
        <button
          :class="tab === 'my' ? activeTabClass : inactiveTabClass"
          @click="tab = 'my'; fetchMyApplications()"
        >我的申请</button>
      </div>
      <!-- 申请加入项目列表 -->
      <div v-if="tab === 'apply'">
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">项目描述</th>
                <th class="px-4 py-2">人数</th>
                <th class="px-4 py-2">组织名称</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id" class="border-b hover:bg-blue-50 transition">
                <td class="px-4 py-2 text-center">{{ project.title }}</td>
                <td class="px-4 py-2 text-center">{{ project.description }}</td>
                <td class="px-4 py-2 text-center">{{ project.memberCount || 0 }}/{{ project.maxMemberCount || '-' }}</td>
                <td class="px-4 py-2 text-center">{{ project.organizationName }}</td>
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/${project.id}/apply`">
                    <button class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs shadow hover:bg-blue-700 transition">申请加入</button>
                  </router-link>
                </td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="5" class="text-center text-gray-400 py-6">暂无可申请项目</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 我的申请列表 -->
      <div v-else>
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">项目描述</th>
                <th class="px-4 py-2">人数</th>
                <th class="px-4 py-2">组织名称</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in myApplications" :key="app.id" class="border-b hover:bg-blue-50 transition">
                <td class="px-4 py-2 text-center">{{ app.projectTitle }}</td>
                <td class="px-4 py-2 text-center">{{ app.projectDescription }}</td>
                <td class="px-4 py-2 text-center">{{ app.memberCount || 0 }}/{{ app.maxMemberCount || '-' }}</td>
                <td class="px-4 py-2 text-center">{{ app.organizationName }}</td>
                <td class="px-4 py-2 text-center">
                  <button @click="cancelApplication(app.id)" class="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition">取消申请</button>
                </td>
              </tr>
              <tr v-if="myApplications.length === 0">
                <td colspan="5" class="text-center text-gray-400 py-6">暂无申请记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, applyForProject, getMyApplications } from '@/lib/api/project'

const router = useRouter()
function goBack() {
router.back()
}

const difficultyOptions = ['不限', '基础/Basic', '进阶/Advanced']
const languageOptions = ['不限', '中文&English', '中文', 'English']
const techOptions = ['不限', '.NET', 'AI', 'ARM', 'Angular', 'AWS', 'AndroidX', 'Apache', 'Appium']
const codeOptions = ['不限', 'C', 'C++', 'Java', 'Python', 'Go', 'JavaScript', 'HTML', 'MATLAB']

const filter = ref({
  difficulty: ['不限'] as string[],
  language: ['不限'] as string[],
  tech: ['不限'] as string[],
  code: ['不限'] as string[]
})

const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'

function selectFilter(type: string, value: string) {
  if (value === '不限') {
    filter.value[type] = ['不限']
  } else {
    if (filter.value[type].includes('不限')) {
      filter.value[type] = filter.value[type].filter(item => item !== '不限')
    }
    
    if (filter.value[type].includes(value)) {
      filter.value[type] = filter.value[type].filter(item => item !== value)
      if (filter.value[type].length === 0) {
        filter.value[type] = ['不限']
      }
    } else {
      filter.value[type].push(value)
    }
  }
  fetchProjects()
}

function isSelected(type: string, value: string): boolean {
  return filter.value[type].includes(value)
}

const keyword = ref('')
const tab = ref<'apply' | 'my'>('apply')
const projects = ref<any[]>([])
const myApplications = ref<any[]>([])

const activeTabClass = 'px-6 py-2 bg-blue-600 text-white font-semibold rounded-t-lg border-b-2 border-blue-600'
const inactiveTabClass = 'px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-t-lg border-b-2 border-transparent hover:bg-blue-100'

async function fetchProjects() {
  const res = await getProjects({
    keyword: keyword.value,
    difficulty: filter.value.difficulty.length > 0 && !filter.value.difficulty.includes('不限') ? filter.value.difficulty : undefined,
    language: filter.value.language.length > 0 && !filter.value.language.includes('不限') ? filter.value.language : undefined,
    tech: filter.value.tech.length > 0 && !filter.value.tech.includes('不限') ? filter.value.tech : undefined,
    code: filter.value.code.length > 0 && !filter.value.code.includes('不限') ? filter.value.code : undefined,
  })
  projects.value = (res.data?.records || []).map((item: any) => ({
    ...item,
    memberCount: item.memberCount || 0,
    maxMemberCount: item.maxMemberCount || '-',
  }))
}

async function fetchMyApplications() {
  const res = await getMyApplications()
  myApplications.value = (res.data?.records || []).map((item: any) => ({
    ...item,
    projectTitle: item.projectTitle || item.title,
    projectDescription: item.projectDescription || item.description,
    memberCount: item.memberCount || 0,
    maxMemberCount: item.maxMemberCount || '-',
    organizationName: item.organizationName || '-',
  }))
}

async function applyProject(projectId: number) {
  try {
    await applyForProject(projectId)
    alert('申请成功！')
    fetchProjects()
    fetchMyApplications()
  } catch (e: any) {
    alert('申请失败：' + (e.message || '未知错误'))
  }
}

async function cancelApplication(appId: number) {
  alert('请联系管理员取消申请')
}

fetchProjects()
</script>