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
  
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">项目经费管理</h2>
  
        <!-- 项目信息 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ project.title }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">¥{{ project.budget || 0 }}</div>
              <div class="text-sm text-gray-600">总预算</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">¥{{ usedBudget }}</div>
              <div class="text-sm text-gray-600">已使用</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">¥{{ remainingBudget }}</div>
              <div class="text-sm text-gray-600">剩余</div>
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
            >
              {{ status.label }}
            </button>
          </div>
          <button
            @click="showFundModal = true"
            class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            申请经费
          </button>
        </div>
  
        <!-- 经费记录表格 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-base">
                <th class="px-4 py-2 text-left">申请时间</th>
                <th class="px-4 py-2 text-left">申请人</th>
                <th class="px-4 py-2 text-left">金额</th>
                <th class="px-4 py-2 text-left">用途</th>
                <th class="px-4 py-2 text-left">状态</th>
                <th class="px-4 py-2 text-left">审核人</th>
                <th class="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredRecords" :key="record.fundId" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">{{ formatDate(record.createdAt) }}</td>
                <td class="px-4 py-3">{{ record.applicantName }}</td>
                <td class="px-4 py-3 font-medium">¥{{ record.amount }}</td>
                <td class="px-4 py-3">{{ record.purpose }}</td>
                <td class="px-4 py-3">
                  <span :class="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ record.reviewerName || '-' }}</td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button
                      v-if="record.status === 'pending' && canReview"
                      @click="reviewFund(record.fundId, 'approved')"
                      class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      通过
                    </button>
                    <button
                      v-if="record.status === 'pending' && canReview"
                      @click="reviewFund(record.fundId, 'rejected')"
                      class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      拒绝
                    </button>
                    <button
                      @click="showFundDetail(record)"
                      class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      详情
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td colspan="7" class="text-center text-gray-400 py-8">暂无经费记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 申请经费弹窗 -->
      <div v-if="showFundModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">申请经费</h3>
          <form @submit.prevent="submitFund" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">申请金额 <span class="text-red-500">*</span></label>
              <input
                v-model="fundForm.amount"
                type="number"
                min="0"
                max="1000000"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请输入申请金额"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">用途说明 <span class="text-red-500">*</span></label>
              <textarea
                v-model="fundForm.purpose"
                rows="3"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="请详细说明经费用途..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">附件</label>
              <input
                type="file"
                @change="handleFileUpload"
                multiple
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p class="text-xs text-gray-500 mt-1">支持 PDF, JPG, PNG 格式，单个文件不超过 5MB</p>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showFundModal = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isSubmitting ? '提交中...' : '提交申请' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 经费详情弹窗 -->
      <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[90vw]">
          <h3 class="text-lg font-bold mb-4">经费申请详情</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">申请金额</label>
                <p class="text-lg font-semibold">¥{{ selectedRecord.amount }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">申请状态</label>
                <span :class="getStatusClass(selectedRecord.status)">
                  {{ getStatusText(selectedRecord.status) }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">用途说明</label>
              <p class="text-gray-700">{{ selectedRecord.purpose }}</p>
            </div>
            <div v-if="selectedRecord.reviewComment">
              <label class="block text-sm font-medium text-gray-700">审核意见</label>
              <p class="text-gray-700">{{ selectedRecord.reviewComment }}</p>
            </div>
            <div v-if="selectedRecord.attachments && selectedRecord.attachments.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">附件</label>
              <div class="space-y-2">
                <a
                  v-for="(url, index) in selectedRecord.attachments"
                  :key="index"
                  :href="url"
                  target="_blank"
                  class="block text-blue-600 hover:text-blue-800"
                >
                  附件{{ index + 1 }}
                </a>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button @click="showDetailModal = false" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              关闭
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
  
  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()
  
  // 数据
  const project = ref<any>({})
  const fundRecords = ref<any[]>([])
  const selectedStatus = ref('')
  const showFundModal = ref(false)
  const showDetailModal = ref(false)
  const selectedRecord = ref<any>({})
  const isSubmitting = ref(false)
  
  // 表单数据
  const fundForm = ref({
    amount: '',
    purpose: '',
    attachments: [] as string[]
  })
  
  // 状态选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'pending', label: '待审批' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
    { value: 'used', label: '已使用' }
  ]
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  // 计算属性
  const filteredRecords = computed(() => {
    if (!selectedStatus.value) return fundRecords.value
    return fundRecords.value.filter(record => record.status === selectedStatus.value)
  })
  
  const usedBudget = computed(() => {
    return fundRecords.value
      .filter(record => record.status === 'approved')
      .reduce((sum, record) => sum + record.amount, 0)
  })
  
  const remainingBudget = computed(() => {
    return (project.value.budget || 0) - usedBudget.value
  })
  
  const canReview = computed(() => {
    // 判断当前用户是否有审核权限
    return appStore.user?.role === 'admin' || appStore.user?.role === 'finance'
  })
  
  // 方法
  async function fetchProjectDetail() {
    try {
      const projectId = route.params.id
      // 这里需要调用实际的API
      // const response = await getProject(projectId)
      // project.value = response.data
      
      // 模拟数据
      project.value = {
        projectId: 1,
        title: '智能制造产学研合作项目',
        budget: 100000
      }
    } catch (error) {
      console.error('获取项目详情失败:', error)
    }
  }
  
  async function fetchFundRecords() {
    try {
      const projectId = route.params.id
      // 这里需要调用实际的API
      // const response = await getProjectFundRecords(projectId)
      // fundRecords.value = response.data
      
      // 模拟数据
      fundRecords.value = [
        {
          fundId: 1,
          amount: 5000,
          purpose: '购买实验材料',
          status: 'approved',
          applicantName: '张老师',
          reviewerName: '李财务',
          createdAt: '2024-01-15',
          reviewComment: '同意报销',
          attachments: []
        },
        {
          fundId: 2,
          amount: 3000,
          purpose: '设备租赁',
          status: 'pending',
          applicantName: '王老师',
          reviewerName: '',
          createdAt: '2024-01-20',
          reviewComment: '',
          attachments: []
        }
      ]
    } catch (error) {
      console.error('获取经费记录失败:', error)
    }
  }
  
  function selectStatus(status: string) {
    selectedStatus.value = status
  }
  
  function getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
      approved: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
      used: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs'
    }
    return statusMap[status] || 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs'
  }
  
  function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: '待审批',
      approved: '已通过',
      rejected: '已拒绝',
      used: '已使用'
    }
    return statusMap[status] || '未知'
  }
  
  function formatDate(dateString: string): string {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-CN')
  }
  
  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    
    if (files) {
      Array.from(files).forEach(file => {
        // 这里应该先上传文件到服务器，获取URL后再添加到附件列表
        const fileUrl = `http://example.com/uploads/${file.name}`
        fundForm.value.attachments.push(fileUrl)
      })
    }
  }
  
  async function submitFund() {
    if (isSubmitting.value) return
    
    try {
      isSubmitting.value = true
      
      // 这里需要调用实际的API
      console.log('提交经费申请:', fundForm.value)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showFundModal.value = false
      // 重新获取经费记录
      await fetchFundRecords()
      
      // 重置表单
      fundForm.value = {
        amount: '',
        purpose: '',
        attachments: []
      }
    } catch (error) {
      console.error('提交经费申请失败:', error)
    } finally {
      isSubmitting.value = false
    }
  }
  
  async function reviewFund(fundId: number, status: string) {
    try {
      // 这里需要调用实际的API
      console.log('审核经费:', { fundId, status })
      
      // 重新获取经费记录
      await fetchFundRecords()
    } catch (error) {
      console.error('审核失败:', error)
    }
  }
  
  function showFundDetail(record: any) {
    selectedRecord.value = record
    showDetailModal.value = true
  }
  
  onMounted(async () => {
    await fetchProjectDetail()
    await fetchFundRecords()
  })
  </script>