<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 顶部导航 -->
      <Navbar v-if="!isDockMode" />
      
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
      </div>
      
      <!-- 标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ project.title }}</h1>
        <div class="flex items-center mt-2">
          <span 
            :class="getStatusClass(project.status)" 
            class="inline-block px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ getStatusText(project.status) }}
          </span>
          
          <!-- 申请合作按钮 -->
          <button 
            v-if="canApply && project.status === 'active'" 
            @click="showApplyModal = true" 
            class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            申请合作
          </button>
        </div>
      </div>
      
      <!-- 选项卡 -->
      <ProjectTabs
        :tabs="tabs"
        :active-tab="currentTab"
        @change="currentTab = $event"
      />
      
      <!-- 内容区域 -->
      <div class="mb-8">
        <!-- 基本信息 -->
        <div v-if="currentTab === '基本信息'">
          <ProjectInfoCard
            :initiator-type="project.initiatorType"
            :field="project.field"
            :description="project.description"
            :budget="project.budget"
            :contact="project.contact"
            :create-time="project.createTime"
            :attachments="project.attachments"
            :original-names="project.originalName || []"
            @download="handleDownload"
          />
        </div>
        
        <!-- 进度管理 -->
        <div v-else-if="currentTab === '进度管理'" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">项目进度</h3>
            <button 
              v-if="isProjectMember" 
              @click="showProgressModal = true"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              添加进度
            </button>
          </div>
          
          <div v-if="progressList.length === 0" class="text-center py-8 text-gray-500">
            暂无进度记录
          </div>
          <div v-else class="space-y-6">
            <div 
              v-for="(progress, index) in progressList" 
              :key="index"
              class="border-l-4 border-blue-400 pl-4 py-2"
            >
              <div class="flex justify-between">
                <span class="font-medium text-gray-900">{{ progress.stage }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(progress.createdAt) }}</span>
              </div>
              <p class="mt-2 text-gray-700">{{ progress.content }}</p>
              <div v-if="progress.attachments && progress.attachments.length > 0" class="mt-2 flex flex-wrap gap-2">
                <a 
                  v-for="(attachment, idx) in progress.attachments" 
                  :key="idx"
                  :href="attachment"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  附件{{ idx + 1 }}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 资料管理 -->
        <div v-else-if="currentTab === '资料管理'">
          <ProjectMaterialsCard
            :materials="materials"
            :is-project-member="isProjectMember"
            @add-material="showMaterialModal = true"
            @download="handleMaterialDownload"
            @delete="handleMaterialDelete"
          />
        </div>
        
        <!-- 经费管理 -->
        <div v-else-if="currentTab === '经费管理'" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">经费管理</h3>
            <button 
              v-if="isProjectMember && project.status === 'matched'" 
              @click="showFundModal = true"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              申请经费
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm text-blue-700 mb-1">总预算</div>
              <div class="text-2xl font-bold text-blue-900">¥{{ project.budget || 0 }}</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-sm text-green-700 mb-1">已使用</div>
              <div class="text-2xl font-bold text-green-900">¥{{ usedBudget }}</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-sm text-purple-700 mb-1">剩余预算</div>
              <div class="text-2xl font-bold text-purple-900">¥{{ remainingBudget }}</div>
            </div>
          </div>
          
          <div v-if="fundRecords.length === 0" class="text-center py-8 text-gray-500">
            暂无经费记录
          </div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用途</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="record in fundRecords" :key="record.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">¥{{ record.amount }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ record.purpose }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(record.createdAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(record.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ getStatusText(record.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 操作日志 -->
        <div v-else-if="currentTab === '操作日志'">
          <ProjectLogCard :logs="logs" />
        </div>
        
        <!-- 权限分配 -->
        <div v-else-if="currentTab === '权限分配'">
          <ProjectPermissionCard 
            :members="project.members || []" 
            :is-project-owner="isProjectOwner"
            :owner-id="project.initiatorId"
            @add-member="showMemberModal = true"
            @edit-member="handleEditMember"
            @remove-member="handleRemoveMember"
          />
        </div>
      </div>
    </div>
    
    <!-- 申请弹窗 -->
    <ProjectApplyDialog
      :visible="showApplyModal"
      :project-id="project.projectId"
      @close="showApplyModal = false"
      @submit="submitApply"
    />
    
    <!-- 进度弹窗 -->
    <ProjectProgressDialog
      :visible="showProgressModal"
      :project-id="project.projectId"
      @close="showProgressModal = false"
      @submit="submitProgress"
    />
    
    <!-- 经费申请弹窗 -->
    <ProjectFundDialog
      :visible="showFundModal"
      :project-id="project.projectId"
      :remaining-budget="remainingBudget"
      @close="showFundModal = false"
      @submit="submitFund"
    />
    
    <!-- 资料上传弹窗 -->
    <ProjectUploadDialog
      :visible="showMaterialModal"
      :project-id="project.projectId"
      @close="showMaterialModal = false"
      @submit="submitMaterial"
    />
    
    <!-- 成员管理弹窗 -->
    <ProjectMemberDialog
      :visible="showMemberModal"
      :project-id="project.projectId"
      :available-users="availableUsers"
      :member-to-edit="memberToEdit"
      @close="closeMemberDialog"
      @submit="submitMember"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { assignProjectPermission, getProject } from '@/lib/api/project'
import { downloadFile } from '@/lib/api/file'
import Navbar from '@/components/layout/Navbar.vue'
import ProjectInfoCard from '@/components/project/ProjectInfoCard.vue'
import ProjectTabs from '@/components/project/ProjectTabs.vue'
import ProjectApplyDialog from '@/components/project/ProjectApplyDialog.vue'
import ProjectProgressDialog from '@/components/project/ProjectProgressDialog.vue'
import ProjectFundDialog from '@/components/project/ProjectFundDialog.vue'
import ProjectUploadDialog from '@/components/project/ProjectUploadDialog.vue'
import ProjectMemberDialog from '@/components/project/ProjectMemberDialog.vue'
import ProjectMaterialsCard from '@/components/project/ProjectMaterialsCard.vue'
import ProjectLogCard from '@/components/project/ProjectLogCard.vue'
import ProjectPermissionCard from '@/components/project/ProjectPermissionCard.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 数据
const project = ref<any>({})
const progressList = ref<any[]>([])
const applications = ref<any[]>([])
const fundRecords = ref<any[]>([])
const materials = ref<any[]>([])
const logs = ref<any[]>([])
const availableUsers = ref<any[]>([])
const memberToEdit = ref<any>(null)

// 弹窗状态
const showApplyModal = ref(false)
const showProgressModal = ref(false)
const showFundModal = ref(false)
const showMaterialModal = ref(false)
const showMemberModal = ref(false)

// 选项卡
const tabs = ['基本信息', '进度管理', '资料管理', '经费管理', '操作日志', '权限分配']
const currentTab = ref('基本信息')

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
    // 模拟数据
    fundRecords.value = [
      {
        id: 1,
        amount: 5000,
        purpose: '设备采购',
        status: 'approved',
        createdAt: '2024-01-25'
      },
      {
        id: 2,
        amount: 3000,
        purpose: '人员培训',
        status: 'pending',
        createdAt: '2024-02-10'
      }
    ]
  } catch (error) {
    console.error('获取经费记录失败:', error)
  }
}

async function fetchMaterials() {
  try {
    // 模拟数据
    materials.value = [
      {
        id: 1,
        name: '项目需求文档',
        fileKey: 'doc123.pdf',
        size: 1024 * 1024 * 2.5, // 2.5MB
        uploadTime: '2024-01-15',
        uploader: '张三'
      },
      {
        id: 2,
        name: '技术方案',
        fileKey: 'doc456.docx',
        size: 1024 * 512, // 512KB
        uploadTime: '2024-01-20',
        uploader: '李四'
      }
    ]
  } catch (error) {
    console.error('获取项目资料失败:', error)
  }
}

async function fetchLogs() {
  try {
    // 模拟数据
    logs.value = [
      {
        id: 1,
        type: 'create',
        operator: '张三',
        operateTime: '2024-01-10 10:30:00',
        content: '创建了项目'
      },
      {
        id: 2,
        type: 'update',
        operator: '张三',
        operateTime: '2024-01-15 14:20:00',
        content: '更新了项目描述'
      },
      {
        id: 3,
        type: 'update',
        operator: '李四',
        operateTime: '2024-01-20 09:15:00',
        content: '添加了项目进度'
      }
    ]
  } catch (error) {
    console.error('获取操作日志失败:', error)
  }
}

async function fetchAvailableUsers() {
  try {
    // 模拟数据
    availableUsers.value = [
      {
        userId: 101,
        name: '王五',
        email: 'wangwu@example.com'
      },
      {
        userId: 102,
        name: '赵六',
        phone: '13800138000'
      }
    ]
  } catch (error) {
    console.error('获取可用用户失败:', error)
  }
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    matched: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
    terminated: 'bg-gray-100 text-gray-800',
    approved: 'bg-green-100 text-green-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    draft: '未提交',
    pending: '待审核',
    active: '待合作',
    matched: '已合作',
    closed: '已完成',
    rejected: '已拒绝',
    canceled: '已取消',
    terminated: '已终止',
    approved: '已通过'
  }
  return statusMap[status] || '未知'
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('zh-CN')
  } catch (e) {
    return dateString
  }
}

async function submitApply(data: { projectId: number | string, message: string }) {
  try {
    // 这里需要调用实际的API
    console.log('申请合作:', data)
    
    showApplyModal.value = false
    // 可以显示成功提示
  } catch (error) {
    console.error('申请失败:', error)
  }
}

async function submitProgress(formData: FormData) {
  try {
    // 这里需要调用实际的API
    console.log('提交进度:', formData)
    
    // 模拟添加进度
    progressList.value.unshift({
      stage: formData.get('stage'),
      content: formData.get('content'),
      createdAt: new Date().toISOString(),
      attachments: []
    })
    
    showProgressModal.value = false
    // 可以显示成功提示
  } catch (error) {
    console.error('提交进度失败:', error)
  }
}

async function submitFund(formData: FormData) {
  try {
    // 这里需要调用实际的API
    console.log('申请经费:', formData)
    
    // 模拟添加经费记录
    fundRecords.value.push({
      id: Date.now(),
      amount: Number(formData.get('amount')),
      purpose: formData.get('purpose'),
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    
    showFundModal.value = false
    // 可以显示成功提示
  } catch (error) {
    console.error('申请经费失败:', error)
  }
}

async function submitMaterial(formData: FormData) {
  try {
    // 这里需要调用实际的API
    console.log('上传资料:', formData)
    
    // 模拟添加资料
    const file = formData.get('file') as File
    materials.value.push({
      id: Date.now(),
      name: formData.get('name'),
      fileKey: file.name,
      size: file.size,
      uploadTime: new Date().toISOString(),
      uploader: appStore.user?.nickname || '未知用户'
    })
    
    showMaterialModal.value = false
    // 可以显示成功提示
  } catch (error) {
    console.error('上传资料失败:', error)
  }
}

function handleMaterialDownload(fileKey: string, fileName: string) {
  downloadFile(fileKey)
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
    .catch(err => {
      alert('下载失败')
    })
}

function handleMaterialDelete(materialId: number) {
  if (confirm('确定要删除这个资料吗？')) {
    // 这里需要调用实际的API
    console.log('删除资料:', materialId)
    
    // 模拟删除
    materials.value = materials.value.filter(item => item.id !== materialId)
    // 可以显示成功提示
  }
}

function handleEditMember(member: any) {
  memberToEdit.value = member
  showMemberModal.value = true
}

function closeMemberDialog() {
  showMemberModal.value = false
  memberToEdit.value = null
}

async function submitMember(data: any) {
  try {
    const res = await assignProjectPermission(project.value.projectId, data)
    if (res.code === 200) {
      // 成功提示
      showMemberModal.value = false
      memberToEdit.value = null
      
      // 重新获取项目详情
      await fetchProjectDetail()
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

async function handleRemoveMember(userId: number) {
  if (confirm('确定要移除该成员吗？')) {
    try {
      // 这里需要调用实际的API
      console.log('移除成员:', userId)
      
      // 模拟移除
      if (project.value.members) {
        project.value.members = project.value.members.filter((m: any) => m.userId !== userId)
      }
      // 可以显示成功提示
    } catch (error) {
      console.error('移除成员失败:', error)
    }
  }
}

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

onMounted(() => {
  fetchProjectDetail()
  fetchApplications()
  fetchFundRecords()
  fetchMaterials()
  fetchLogs()
  fetchAvailableUsers()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>