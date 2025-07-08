<template>
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
  
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">{{ project.title }}项目经费管理</h2>
  
        <!-- 项目信息卡片 -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">¥{{ project.budget || 0 }}</div>
              <div class="text-sm text-gray-600">总预算</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">¥{{ approvedAmount }}</div>
              <div class="text-sm text-gray-600">已拨款</div>
            </div>
          </div>
        </div>
  
        <!-- 操作按钮 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex space-x-2">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="selectStatus(status.value)"
              :class="selectedStatus === status.value ? activeBtn : inactiveBtn"
              class="transition"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
  
        <!-- 经费记录表格卡片 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2 text-center">申请时间</th>
                <th class="px-4 py-2 text-center">金额</th>
                <th class="px-4 py-2 text-center">用途</th>
                <th class="px-4 py-2 text-center">状态</th>
                <th v-if="selectedStatus === 'approved'" class="px-4 py-2 text-center">同意时间</th>
                <th v-if="selectedStatus === 'rejected'" class="px-4 py-2 text-center">拒绝时间</th>
                <th v-if="selectedStatus === 'pending'" class="px-4 py-2 text-center">操作</th>
                <th class="px-2 py-1">附件</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredRecords" :key="record.fundId" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-center">{{ formatDate(record.createTime) }}</td>
                <td class="px-4 py-3 font-medium text-center">¥{{ record.amount }}</td>
                <td class="px-4 py-3 text-center">
                  <button @click="showFundDetail(record)" class="text-blue-600 hover:underline">详情</button>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>
                <td v-if="selectedStatus === 'approved'" class="px-4 py-3 text-center">{{ formatDate(record.approvedTime) }}</td>
                <td v-if="selectedStatus === 'rejected'" class="px-4 py-3 text-center">{{ formatDate(record.rejectedTime) }}</td>
                <td v-if="selectedStatus === 'pending'" class="px-4 py-3 text-center">
                  <div class="flex justify-center space-x-2">
                    <button
                      v-if="record.status === 'pending' && canReview"
                      @click="confirmReview(record.fundId, 'approved')"
                      class="px-3 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700 text-center shadow"
                    >
                      同意
                    </button>
                    <button
                      v-if="record.status === 'pending' && canReview"
                      @click="confirmReview(record.fundId, 'rejected')"
                      class="px-3 py-1 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 text-center shadow"
                    >
                      拒绝
                    </button>
                  </div>
                </td>
                <td class="px-2 py-1 text-center">
                  <button
                    @click="showFundAttachments(record)"
                    class="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:text-blue-800 transition"
                  >
                    查看附件
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td :colspan="selectedStatus === 'approved' || selectedStatus === 'rejected' ? 6 : 7" class="text-center text-gray-400 py-8">暂无经费记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 经费详情弹窗美化 -->
      <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-[90vw] animate-fade-in">
          <h3 class="text-lg font-bold mb-4 text-center">用途详情</h3>
          <div class="space-y-4">
            <div>
              <p class="text-gray-700 ">{{ selectedRecord.purpose }}</p>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button @click="showDetailModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 shadow">关闭</button>
          </div>
        </div>
      </div>
  
      <!-- 附件弹窗美化 -->
      <div v-if="showAttachmentDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-96 animate-fade-in">
          <div class="font-bold text-lg mb-2 text-left">附件</div>
          <div v-if="currentAttachments.length === 0" class="text-gray-500">无</div>
          <ul v-else>
            <li v-for="(url, idx) in currentAttachments" :key="url" class="mb-2 flex items-center">
              <span class="truncate max-w-[200px] select-all" :title="getOriginalName(idx)">
                {{ getOriginalName(idx) }}
              </span>
              <button @click="handleDownloadFile(url, idx)" class="ml-2 text-blue-600 underline">下载</button>
            </li>
          </ul>
          <div class="flex justify-end mt-4">
            <button @click="showAttachmentDialog = false" class="px-4 py-2 bg-blue-500 text-white rounded-full shadow">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'
  import { getProject, getProjectFundList, reviewFund, applyForFund } from '@/lib/api/project'
  import { downloadFile } from '@/lib/api/file'
  import Navbar from '@/components/layout/Navbar.vue'
  
  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()
  
  // 数据
  const project = ref<any>({})
  const fundRecords = ref<any[]>([])
  const selectedStatus = ref('pending')
  const showFundModal = ref(false)
  const showDetailModal = ref(false)
  const selectedRecord = ref<any>({})
  const isSubmitting = ref(false)
  const showAttachmentDialog = ref(false)
  const currentAttachments = ref<string[]>([])
  const currentOriginalNames = ref<string[]>([])
  
  // 表单数据
  const fundForm = ref({
    amount: '',
    purpose: '',
    attachments: [] as string[]
  })
  
  // 状态选项
  const statusOptions = [
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' }
  ]
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  // 计算属性
  const filteredRecords = computed(() => {
    if (!selectedStatus.value) return fundRecords.value
    return fundRecords.value.filter(record => record.status === selectedStatus.value)
  })
  
  const approvedAmount = computed(() => {
    return fundRecords.value
      .filter(record => record.status === 'approved')
      .reduce((sum, record) => sum + (Number(record.amount) || 0), 0)
  })
  
  const totalBudget = computed(() => project.value.budget || 0)
  
  const canReview = computed(() => {
    const role = (appStore.user?.role || '').toUpperCase()
    return ['ADMIN', 'FINANCE', 'SCH_ADMIN', 'EN_ADMIN'].includes(role)
  })
  
  // 方法
  async function fetchProjectDetail() {
    try {
      const projectId = Number(route.params.id)
      const response = await getProject(projectId)
      project.value = response.data
    } catch (error) {
      project.value = {}
    }
  }
  
  async function fetchFundRecords() {
    try {
      const projectId = Number(route.params.id)
      const response = await getProjectFundList(projectId)
      fundRecords.value = response.data || []
    } catch (error) {
      fundRecords.value = []
    }
  }
  
  function selectStatus(status: string) {
    selectedStatus.value = status
  }
  
  function getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
      approved: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
  }
  
  function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝'
    }
    return statusMap[status] || '未知'
  }
  
  function formatDate(dateString: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }
  
  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    
    if (files) {
      Array.from(files).forEach(file => {
        // 这里应上传文件到服务器，获取URL后再添加
        const fileUrl = `http://example.com/uploads/${file.name}`
        fundForm.value.attachments.push(fileUrl)
      })
    }
  }
  
  
  
  async function reviewFundHandler(fundId: number, status: string) {
    try {
      const projectId = Number(route.params.id)
      await reviewFund(projectId, fundId, { status })
      await fetchFundRecords()
    } catch (error) {
      console.error('审核失败:', error)
    }
  }
  
  function showFundDetail(record: any) {
    selectedRecord.value = record
    showDetailModal.value = true
  }
  
  // 新增：操作前确认
  function confirmReview(fundId: number, status: string) {
    const action = status === 'approved' ? '同意' : '拒绝'
    if (window.confirm(`是否确认${action}该经费申请？`)) {
      reviewFundHandler(fundId, status)
    }
  }
  
  function showFundAttachments(record: any) {
    currentAttachments.value = Array.isArray(record.attachments) ? record.attachments : []
    if (Array.isArray(record.originalName)) {
      currentOriginalNames.value = record.originalName
    } else if (typeof record.originalName === 'string') {
      currentOriginalNames.value = record.originalName.split(',')
    } else {
      currentOriginalNames.value = []
    }
    showAttachmentDialog.value = true
  }
  
  function getOriginalName(idx: number) {
    return currentOriginalNames.value[idx] || getFileName(currentAttachments.value[idx])
  }
  
  function getFileName(url: string) {
    return url?.split('/').pop() || '附件'
  }
  
  async function handleDownloadFile(fileUrl: string, idx?: number) {
    let filename = fileUrl.split('/').pop();
    // 优先用 originalName
    if (typeof idx === 'number' && currentOriginalNames.value[idx]) {
      filename = currentOriginalNames.value[idx];
    }
    if (!filename) {
      alert('无法获取文件名');
      return;
    }
    try {
      const fileKey = fileUrl.split('/').pop() || '';
      const blob = await downloadFile(fileKey);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      alert('下载失败');
    }
  }
  
  onMounted(async () => {
    await fetchProjectDetail()
    await fetchFundRecords()
  })
  </script>