<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div class="container mx-auto px-4">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <router-link
            to="/dashboard/teacher"
            class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </router-link>
        </div>
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">我的项目管理</h2>
        <!-- 搜索框 -->
        <div class="flex justify-center mb-6">
          <input
            v-model="keyword"
            @keyup.enter="onSearch"
            type="text"
            placeholder="请输入项目名称/项目编号"
            class="flex-1 max-w-2xl border border-blue-400 rounded-l-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          />
          <button
            @click="onSearch"
            class="px-8 py-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base"
          >查找项目</button>
        </div>
        <!-- 筛选栏 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">按条件筛选项目</h2>
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
       
        <!-- 项目表格 -->
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2">项目编号</th>
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">组织名称</th>
                <th class="px-4 py-2">附件</th>
                <th class="px-4 py-2">人数</th>
                <th class="px-4 py-2">管理人员</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id" class="border-b hover:bg-blue-50 transition">
                <td class="px-4 py-2 text-center">{{ project.id }}</td>
                <td class="px-4 py-2 text-center">{{ project.title }}</td>
                <td class="px-4 py-2 text-center">{{ project.organizationName }}</td>
                <td class="px-4 py-2 text-center">
                    <a
                        v-if="project.projectProposalUrl"
                        href="javascript:void(0)"
                        @click="downloadFileWithToken(project.projectProposalUrl)"
                        class="text-blue-600 hover:underline"
                        >下载</a>
                  <span v-else>-</span>
                </td>
                <td class="px-4 py-2 text-center">
                  {{ project.memberCount || 0 }}/{{ project.planMemberCount || '-' }}
                </td>
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/${project.id}/members`">
                    <button class="px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 transition">管理人员</button>
                  </router-link>
                </td>
                <td class="px-4 py-2 text-center">
                  <router-link :to="`/project/edit/${project.id}`">
                    <button class="px-2 py-1 rounded-md bg-gray-500 text-white text-xs mr-1 shadow hover:bg-gray-600 transition">编辑</button>
                  </router-link>
                  <button @click="deleteProjectHandler(project.id)" class="px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 transition">删除</button>
                </td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="7" class="text-center text-gray-400 py-6">暂无项目</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 表格下方，紧接着 </div> -->
        <div class="flex justify-center mt-6">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200"
          >上一页</button>
          <span class="mx-2">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize)"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200"
          >下一页</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getProjects, deleteProject } from '@/lib/api/project'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'
  import { downloadFile } from '@/lib/api/file'
  
  const appStore = useAppStore()
  const projects = ref<any[]>([])
  const keyword = ref('')
  const router = useRouter()
  
  
  // 筛选项
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
  type FilterKey = 'difficulty' | 'language' | 'tech' | 'code'
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  function selectFilter(type: FilterKey, value: string) {
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
    currentPage.value = 1
    fetchProjects(1)
  }
  
  function downloadFileWithToken(url: string) {
    // url 可能是 "resources/xxx.pdf" 或 "/files/resources/xxx.pdf"
    // 只取文件名部分
    const filename = url.split('/').pop() || url
    console.log('下载文件:', filename)
    downloadFile(filename)
      .then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
      })
      .catch(() => alert('文件下载失败或无权限'))
  }

  function isSelected(type: FilterKey, value: string): boolean {
    return filter.value[type].includes(value)
  }
  
  const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

  async function fetchProjects(page = currentPage.value) {
  const organizationId = appStore.user?.organizationId
  const res = await getProjects({
  page,
  size: pageSize.value,
  keyword: keyword.value,
  organizationId,
  difficulty: filter.value.difficulty.length > 0 && !filter.value.difficulty.includes('不限') ? filter.value.difficulty : undefined,
  supportLanguages: filter.value.language.length > 0 && !filter.value.language.includes('不限') ? filter.value.language : undefined,
  techFields: filter.value.tech.length > 0 && !filter.value.tech.includes('不限') ? filter.value.tech : undefined,
  programmingLanguages: filter.value.code.length > 0 && !filter.value.code.includes('不限') ? filter.value.code : undefined,
})

console.log('请求参数:', {
  page,
  size: pageSize.value,
  keyword: keyword.value,
  organizationId,
  difficulty: filter.value.difficulty.length > 0 && !filter.value.difficulty.includes('不限') ? filter.value.difficulty : undefined,
  supportLanguages: filter.value.language.length > 0 && !filter.value.language.includes('不限') ? filter.value.language : undefined,
  techFields: filter.value.tech.length > 0 && !filter.value.tech.includes('不限') ? filter.value.tech : undefined,
  programmingLanguages: filter.value.code.length > 0 && !filter.value.code.includes('不限') ? filter.value.code : undefined,
})

  projects.value = (res.data?.records || []).map((item: any) => ({
    ...item,
    projectProposalUrl: item.projectProposalUrl || item.planUrl || '',
    planMemberCount: item.planMemberCount || item.maxMemberCount || '-',
    memberCount: item.memberCount || 0,
  }))
  total.value = res.data?.total || 0
  currentPage.value = res.data?.current || 1
}
  
  async function deleteProjectHandler(id: number) {
    if (confirm('确定要删除该项目吗？')) {
      await deleteProject(id)
      fetchProjects()
    }
  }
  
  function changePage(page: number) {
    currentPage.value = page
    fetchProjects(page)
  }
  
  function onSearch() {
    currentPage.value = 1
    fetchProjects(1)
  }
  
  onMounted(fetchProjects)
  </script>