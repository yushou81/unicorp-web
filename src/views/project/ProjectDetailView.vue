<template>
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
  
        <!-- Tab导航 -->
        <div class="tabs flex mb-6">
          <button v-for="tab in tabs" :key="tab" :class="['tab', {active: currentTab === tab}]" @click="currentTab = tab">{{ tab }}</button>
        </div>
  
        <!-- 项目基本信息 -->
        <div v-if="currentTab === '基本信息'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ project.title }}</h1>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>发起方：{{ project.initiatorType === 'school' ? '学校' : '企业' }}</span>
                <span>项目领域：{{ project.field }}</span>
                <span>状态：<span :class="getStatusClass(project.status)">{{ getStatusText(project.status) }}</span></span>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                v-if="canApply"
                @click="showApplyModal = true"
                class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                申请合作
              </button>
              
            </div>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  
          <!-- 附件 -->
          <div v-if="project.attachments && project.attachments.length > 0" class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">项目附件</h3>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="(file, index) in project.attachments"
                :key="index"
                href="javascript:void(0)"
                @click.prevent="handleDownload(file)"
                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ getFileNameFromUrl(file) }}
              </a>
            </div>
          </div>
        </div>
  
        <!-- 项目进度 -->
        <div v-else-if="currentTab === '进度管理'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">项目进度</h2>
          <div v-if="progressList.length > 0" class="space-y-4">
            <div v-for="progress in progressList" :key="progress.progressId" class="border-l-4 border-blue-500 pl-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold text-gray-900">{{ progress.stage }}</h4>
                  <p class="text-gray-700 mt-1">{{ progress.content }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ formatDate(progress.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            暂无进度记录
          </div>
          
          <!-- 添加进度按钮 -->
          <div v-if="isProjectMember" class="mt-6">
            <button @click="showProgressModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              添加进度
            </button>
          </div>
        </div>
  
        <!-- 合作申请 -->
        <div v-else-if="currentTab === '合作申请'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">合作申请</h2>
          <div v-if="applications.length > 0" class="space-y-4">
            <div v-for="application in applications" :key="application.applicationId" class="border rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-900">{{ application.applicantType === 'school' ? '学校' : '企业' }}</p>
                  <p class="text-gray-700 mt-1">{{ application.message }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ formatDate(application.createdAt) }}</p>
                </div>
                <div v-if="application.status === 'pending'" class="flex space-x-2">
                  <button @click="reviewApplication(application.applicationId, 'approved')" class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    通过
                  </button>
                  <button @click="reviewApplication(application.applicationId, 'rejected')" class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                    拒绝
                  </button>
                </div>
                <span v-else :class="getStatusClass(application.status)">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            暂无合作申请
          </div>
        </div>
  
        <!-- 经费管理 -->
        <div v-else-if="currentTab === '经费管理'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">经费管理</h2>
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-600">
              总预算：¥{{ project.budget || 0 }} | 已使用：¥{{ usedBudget }} | 剩余：¥{{ remainingBudget }}
            </div>
            <button @click="showFundModal = true" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              申请经费
            </button>
          </div>
          
          <div v-if="fundRecords.length > 0" class="space-y-2">
            <div v-for="record in fundRecords" :key="record.fundId" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">{{ record.purpose }}</p>
                <p class="text-sm text-gray-600">¥{{ record.amount }}</p>
              </div>
              <span :class="getStatusClass(record.status)">
                {{ getStatusText(record.status) }}
              </span>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            暂无经费记录
          </div>
        </div>
  
        <!-- 资料管理 -->
        <div v-else-if="currentTab === '资料管理'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <!-- 资料上传、列表、下载 -->
          <!-- <DocumentManager :projectId="project.value.projectId" /> -->
          <div class="text-gray-400">资料管理功能开发中...</div>
        </div>
  
        <!-- 操作日志 -->
        <div v-else-if="currentTab === '操作日志'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <!-- 日志列表 -->
          <!-- <LogManager :projectId="project.value.projectId" /> -->
          <div class="text-gray-400">操作日志功能开发中...</div>
        </div>
  
        <!-- 权限分配 -->
        <div v-else-if="currentTab === '权限分配'" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <!-- 权限分配、回收、日志 -->
          <!-- <PermissionManager :projectId="project.value.projectId" /> -->
          <div class="text-gray-400">权限分配功能开发中...</div>
        </div>
      </div>
  
      <!-- 申请合作弹窗 -->
      <div v-if="showApplyModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">申请合作</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申请说明</label>
              <textarea
                v-model="applyMessage"
                rows="4"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请简要说明申请合作的原因和优势..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showApplyModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              取消
            </button>
            <button @click="submitApply" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              提交申请
            </button>
          </div>
        </div>
      </div>
  
      <!-- 添加进度弹窗 -->
      <div v-if="showProgressModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">添加项目进度</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">阶段名称</label>
              <input
                v-model="progressForm.stage"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="如：需求分析、方案设计等"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">进展描述</label>
              <textarea
                v-model="progressForm.content"
                rows="4"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请详细描述项目进展..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showProgressModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              取消
            </button>
            <button @click="submitProgress" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              提交
            </button>
          </div>
        </div>
      </div>
  
      <!-- 申请经费弹窗 -->
      <div v-if="showFundModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">申请经费</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申请金额</label>
              <input
                v-model="fundForm.amount"
                type="number"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请输入申请金额"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">用途说明</label>
              <textarea
                v-model="fundForm.purpose"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请详细说明经费用途..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showFundModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              取消
            </button>
            <button @click="submitFund" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              提交申请
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'
  import { assignProjectPermission, getProject } from '@/lib/api/project'
  import { downloadFile } from '@/lib/api/file'
  
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
  
  async function fetchProgress() {
    try {
      // 这里需要调用实际的API
      // const response = await getProjectProgress(projectId)
      // progressList.value = response.data
      
      // 模拟数据
      progressList.value = [
        {
          progressId: 1,
          stage: '需求分析',
          content: '已完成项目需求调研和分析',
          createdAt: '2024-01-15'
        },
        {
          progressId: 2,
          stage: '方案设计',
          content: '正在进行技术方案设计',
          createdAt: '2024-02-01'
        }
      ]
    } catch (error) {
      console.error('获取项目进度失败:', error)
    }
  }
  
  async function fetchApplications() {
    try {
      // 这里需要调用实际的API
      // const response = await getProjectApplications(projectId)
      // applications.value = response.data
      
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
      // const response = await getProjectFundRecords(projectId)
      // fundRecords.value = response.data
      
      // 模拟数据
      fundRecords.value = [
        {
          fundId: 1,
          amount: 5000,
          purpose: '购买实验材料',
          status: 'approved'
        },
        {
          fundId: 2,
          amount: 3000,
          purpose: '设备租赁',
          status: 'pending'
        }
      ]
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
  
  async function submitProgress() {
    try {
      // 这里需要调用实际的API
      console.log('添加进度:', progressForm.value)
      
      showProgressModal.value = false
      // 重新获取进度列表
      await fetchProgress()
    } catch (error) {
      console.error('添加进度失败:', error)
    }
  }
  
  async function submitFund() {
    try {
      // 这里需要调用实际的API
      console.log('申请经费:', fundForm.value)
      
      showFundModal.value = false
      // 重新获取经费记录
      await fetchFundRecords()
    } catch (error) {
      console.error('申请经费失败:', error)
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
  
  function handleDownload(file: string) {
    // file 形如 "8500c8c3_20250703220231.doc"
    downloadFile(file.split('/').pop() || file)
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.split('/').pop() || '附件'
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
    fetchProgress()
    fetchApplications()
    fetchFundRecords()
  })
  </script>