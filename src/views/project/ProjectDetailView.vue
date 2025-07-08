<template>
  <div>
    <template v-if="isDockMode">
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div class="container mx-auto px-4">
          <!-- 返回按钮 -->
          <div class="mb-6">
            <button
              @click="router.back()"
              class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center md:text-center">{{ project.title }}项目详情</h1>
          <!-- 项目基本信息卡片 -->
          <div v-if="currentTab === '基本信息'" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
               
                <div class="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                  <span>发起方：{{ project.initiatorType === 'school' ? '学校' : '企业' }}</span>
                  <span>项目领域：{{ project.field }}</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">项目描述</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ project.description }}</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">项目信息</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">预算：</span>
                    <span class="font-medium">{{ project.budget ? `¥${project.budget}` : '未设置' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">联系方式：</span>
                    <span class="font-medium">{{ project.contact }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">创建时间：</span>
                    <span class="font-medium">{{ formatDate(project.createTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 附件区 -->
            <div v-if="project.attachments && project.attachments.length > 0" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">项目附件</h3>
              <div class="flex flex-wrap gap-3">
                <a
                  v-for="(file, index) in project.attachments"
                  :key="index"
                  href="javascript:void(0)"
                  @click.prevent="handleDownload(file, index)"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg shadow hover:bg-blue-200 transition font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ project.originalName[index] }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div class="container mx-auto px-4">
          <!-- 返回按钮 -->
          <div class="mb-6">
            <button
              @click="router.back()"
              class="inline-flex items-center text-blue-600 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 active:scale-95 transition-all duration-200 text-sm font-medium px-2 py-1 rounded-md select-none"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center md:text-center">{{ project.title }}项目详情</h1>
          <!-- 项目基本信息卡片 -->
          <div v-if="currentTab === '基本信息'" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
               
                <div class="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                  <span>发起方：{{ project.initiatorType === 'school' ? '学校' : '企业' }}</span>
                  <span>项目领域：{{ project.field }}</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">项目描述</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ project.description }}</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">项目信息</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">预算：</span>
                    <span class="font-medium">{{ project.budget ? `¥${project.budget}` : '未设置' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">联系方式：</span>
                    <span class="font-medium">{{ project.contact }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">创建时间：</span>
                    <span class="font-medium">{{ formatDate(project.createTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 附件区 -->
            <div v-if="project.attachments && project.attachments.length > 0" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">项目附件</h3>
              <div class="flex flex-wrap gap-3">
                <a
                  v-for="(file, index) in project.attachments"
                  :key="index"
                  href="javascript:void(0)"
                  @click.prevent="handleDownload(file, index)"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg shadow hover:bg-blue-200 transition font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ project.originalName[index] }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { assignProjectPermission, getProject } from '@/lib/api/project'
import { downloadFile } from '@/lib/api/file'
import Navbar from '@/components/layout/Navbar.vue'


const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 数据
const project = ref<any>({})
const progressList = ref<any[]>([])
const applications = ref<any[]>([])
const fundRecords = ref<any[]>([])

// 弹窗状态
const showApplyModal = ref(false)
const showProgressModal = ref(false)
const showFundModal = ref(false)
const showEditModal = ref(false)

// 表单数据
const applyMessage = ref('')
const progressForm = ref({
  stage: '',
  content: ''
})
const fundForm = ref({
  amount: '',
  purpose: ''
})

// 计算属性
const canApply = computed(() => {
  const userType = appStore.user?.role
  const projectInitiatorType = project.value.initiatorType
  
  if (userType === 'TEACHER' && projectInitiatorType === 'enterprise') return true
  if (userType === 'EN_TEACHER' && projectInitiatorType === 'school') return true
  
  return false
})

const isProjectOwner = computed(() => {
  return project.value.initiatorId === appStore.user?.id
})

const isProjectMember = computed(() => {
  return isProjectOwner.value || project.value.members?.some((member: any) => member.userId === appStore.user?.id)
})

const usedBudget = computed(() => {
  return fundRecords.value
    .filter(record => record.status === 'approved')
    .reduce((sum, record) => sum + record.amount, 0)
})

const remainingBudget = computed(() => {
  return (project.value.budget || 0) - usedBudget.value
})

const isDockMode = computed(() => route.path.startsWith('/project/dock/'))

// 方法
async function fetchProjectDetail() {
  try {
    const projectId = Number(route.params.id || route.params.projectId)
    const response = await getProject(projectId)
    project.value = response.data
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

async function fetchApplications() {
  try {
    // 模拟数据
    applications.value = [
      {
        applicationId: 1,
        applicantType: 'enterprise',
        message: '我们公司有相关技术团队，愿意参与合作',
        status: 'pending',
        createdAt: '2024-01-20'
      }
    ]
  } catch (error) {
    console.error('获取申请列表失败:', error)
  }
}

async function fetchFundRecords() {
  try {
    // 这里需要调用实际的API
  } catch (error) {
    console.error('获取经费记录失败:', error)
  }
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
    active: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
    closed: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
    rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
    approved: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs'
  }
  return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    active: '进行中',
    closed: '已结项',
    rejected: '已拒绝',
    approved: '已通过'
  }
  return statusMap[status] || '未知'
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

async function submitApply() {
  try {
    // 这里需要调用实际的API
    console.log('申请合作:', {
      projectId: project.value.projectId,
      message: applyMessage.value
    })
    
    showApplyModal.value = false
    // 可以显示成功提示
  } catch (error) {
    console.error('申请失败:', error)
  }
}

async function reviewApplication(applicationId: number, status: string) {
  try {
    // 这里需要调用实际的API
    console.log('审核申请:', { applicationId, status })
    
    // 重新获取申请列表
    await fetchApplications()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

async function assignPermission(userId: number, roles: string[], expireAt?: string) {
  const res = await assignProjectPermission(project.value.projectId, { userId, roles, expireAt })
  if (res.code === 200) {
    // 成功提示
  }
}

const tabs = ['基本信息', '进度管理', '资料管理', '经费管理', '操作日志', '权限分配']
const currentTab = ref('基本信息')

function handleDownload(file: string, index: number) {
  // file 形如 "8500c8c3_20250703220231.doc"
  let filename = (project.value.originalName && project.value.originalName[index]) || file.split('/').pop() || '附件';
  const fileKey = file.split('/').pop() || '';
  downloadFile(fileKey)
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
    .catch(err => {
      alert('下载失败')
    })
}

function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '附件'
}

onMounted(() => {
  fetchProjectDetail()
  
  fetchApplications()
  fetchFundRecords()
})
</script>