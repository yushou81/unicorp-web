<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">项目搜索与对接</h2>
      
      <!-- 搜索框 -->
      <div class="flex flex-col sm:flex-row justify-center items-center mb-6 gap-2">
        <input 
          v-model="keyword" 
          @keyup.enter="onSearch" 
          type="text" 
          placeholder="请输入项目名称/项目编号" 
          class="flex-1 max-w-2xl border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
        />
        <button 
          @click="onSearch" 
          class="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
        >
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            查找项目
          </div>
        </button>
      </div>
      
      <!-- 筛选栏 -->
      <div class="mb-6">
        <ProjectFilterBar
          title="按条件筛选项目"
          :initiator-type="initiatorType"
          :selected-fields="filterField"
          @select-initiator-type="selectInitiatorType"
          @select-field="selectField"
        />
      </div>
      
      <!-- 项目列表 -->
      <ProjectList
        :projects="projects"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @page-change="changePage"
      >
        <template #actions="{ project }: { project: any }">
          <router-link :to="`/project/dock/detail/${project.projectId}`" class="text-blue-600 hover:text-blue-900 mr-3">
            查看详情
          </router-link>
          <button
            v-if="!project.hasApplied && canApplyProject(project)"
            @click="applyProject(project.projectId)"
            class="text-green-600 hover:text-green-900"
          >
            申请合作
          </button>
          <span
            v-else-if="project.hasApplied"
            class="text-gray-400"
          >
            已申请
          </span>
        </template>
      </ProjectList>
    </div>
    
    <!-- 申请合作弹窗 -->
    <div v-if="showApplyModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">申请项目合作</h3>
            
            <div class="mb-4">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">申请说明</label>
              <textarea
                id="message"
                v-model="applyMessage"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请简要说明您的合作意向、优势和期望..."
              ></textarea>
            </div>
            
            <div class="text-sm text-gray-500">
              <p>提示：清晰表达您的合作意向和优势，有助于项目发起方更好地评估合作可行性。</p>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button"
              @click="submitApply"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              提交申请
            </button>
            <button 
              type="button"
              @click="showApplyModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, applyForProject } from '@/lib/api/project'
import { useAppStore } from '@/stores/app'
import ProjectFilterBar from '@/components/project/ProjectFilterBar.vue'
import ProjectList from '@/components/project/ProjectList.vue'

const router = useRouter()
const appStore = useAppStore()

// 数据
const projects = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const fieldOptions = ['不限', '智能制造', '人工智能', '大数据', '云计算', '物联网', '区块链', '新能源', '生物医药']
const filterField = ref(['不限'])
const initiatorType = ref('')

// 发起方类型选项
const initiatorTypeOptions = [
  { value: '', label: '全部' },
  { value: 'school', label: '学校' },
  { value: 'enterprise', label: '企业' }
]

// 申请相关
const showApplyModal = ref(false)
const applyMessage = ref('')
const currentProjectId = ref<number>()

// 方法
function selectField(value: string) {
  if (value === '不限') {
    filterField.value = ['不限']
  } else {
    filterField.value = filterField.value.filter(item => item !== '不限')
    if (filterField.value.includes(value)) {
      filterField.value = filterField.value.filter(item => item !== value)
      if (filterField.value.length === 0) {
        filterField.value = ['不限']
      }
    } else {
      filterField.value.push(value)
    }
  }
  currentPage.value = 1
  fetchProjects(1)
}

function isSelected(value: string): boolean {
  return filterField.value.includes(value)
}

function selectInitiatorType(value: string) {
  initiatorType.value = value
  fetchProjects()
}

function canApplyProject(project: any): boolean {
  const userRole = appStore.user?.role
  const projectInitiatorType = project.initiatorType
  
  if (userRole === 'TEACHER' && projectInitiatorType === 'enterprise') return true
  if (userRole === 'EN_TEACHER' && projectInitiatorType === 'school') return true
  
  return false
}

async function fetchProjects(page = currentPage.value) {
  try {
    const params = {
      page,
      pageSize: pageSize.value,
      keyword: keyword.value,
      status: 'active', // 只查进行中的项目
      field: filterField.value.length > 0 && !filterField.value.includes('不限') ? filterField.value.join(',') : undefined,
      initiatorType: initiatorType.value || undefined,
      organizationId: -1
    }
    
    const res = await getProjects(params)
    if (Array.isArray(res.data)) {
      projects.value = res.data
      total.value = res.data.length
    } else if (res.data.list) {
      projects.value = res.data.list
      total.value = res.data.total
    } else {
      projects.value = []
      total.value = 0
    }
    currentPage.value = page
  } catch (error) {
    projects.value = []
    total.value = 0
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

function applyProject(projectId: number) {
  currentProjectId.value = projectId
  applyMessage.value = ''
  showApplyModal.value = true
}

async function submitApply() {
  if (!applyMessage.value.trim()) {
    alert('请填写申请说明')
    return
  }
  
  try {
    const applicantType = appStore.user?.role
    const applicantId = appStore.user?.id
    
    if (!applicantType || !applicantId) {
      alert('用户信息缺失，无法申请')
      return
    }
    
    if (!currentProjectId.value) {
      alert('项目ID缺失，无法申请')
      return
    }
    
    await applyForProject(Number(currentProjectId.value), {
      applicantType,
      applicantId,
      message: applyMessage.value
    })
    
    // 申请成功后本地更新 hasApplied 状态
    const project = projects.value.find(p => p.projectId === currentProjectId.value)
    if (project) project.hasApplied = true
    
    alert('申请已提交！')
    showApplyModal.value = false
  } catch (error) {
    alert('申请失败')
    showApplyModal.value = false
  }
}

onMounted(fetchProjects)
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.25s cubic-bezier(.4,0,.2,1);
}
</style> 