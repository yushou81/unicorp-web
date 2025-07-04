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
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">我的项目申请</h2>
  
        <!-- 筛选栏 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">按状态筛选</h2>
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
        </div>
  
        <!-- 申请列表 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div v-if="applications.length > 0" class="space-y-6">
            <div v-for="application in applications" :key="application.applicationId" class="border rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    <router-link :to="`/project/detail/${application.projectId}`" class="text-blue-600 hover:text-blue-800">
                      {{ application.projectTitle }}
                    </router-link>
                  </h3>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>申请时间：{{ formatDate(application.createdAt) }}</span>
                    <span>申请方：{{ application.applicantType === 'school' ? '学校' : '企业' }}</span>
                  </div>
                </div>
                <span :class="getStatusClass(application.status)">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
              
              <div class="mb-4">
                <h4 class="font-medium text-gray-900 mb-2">申请说明</h4>
                <p class="text-gray-700">{{ application.message }}</p>
              </div>
              
              <div v-if="application.status === 'pending'" class="flex space-x-3">
                <button
                  @click="reviewApplication(application.applicationId, 'approved')"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  通过申请
                </button>
                <button
                  @click="reviewApplication(application.applicationId, 'rejected')"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  拒绝申请
                </button>
              </div>
              
              <div v-if="application.reviewComment" class="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-1">审核意见</h4>
                <p class="text-gray-700">{{ application.reviewComment }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无申请记录</h3>
            <p class="mt-1 text-sm text-gray-500">您还没有申请过任何项目</p>
          </div>
        </div>
  
        <!-- 分页 -->
        <div v-if="total > pageSize" class="flex justify-center mt-6">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            上一页
          </button>
          <span class="mx-2">第 {{ currentPage }} / {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            :disabled="currentPage === Math.ceil(total / pageSize)"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
  
        <!-- 合作申请审核列表 -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-4">合作申请审核</h2>
          <ApplicationAuditList />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAppStore } from '@/stores/app'
  import { useRouter } from 'vue-router'
  
  const appStore = useAppStore()
  const router = useRouter()
  
  // 数据
  const applications = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const selectedStatus = ref('')
  
  // 状态选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' }
  ]
  
  const activeBtn = 'px-3 py-1 rounded-md bg-blue-500 text-white font-semibold shadow'
  const inactiveBtn = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-200 shadow'
  
  // 方法
  function selectStatus(status: string) {
    selectedStatus.value = status
    currentPage.value = 1
    fetchApplications()
  }
  
  async function fetchApplications() {
    try {
      // 这里需要调用实际的API
      // const response = await getMyApplications({
      //   page: currentPage.value,
      //   size: pageSize.value,
      //   status: selectedStatus.value || undefined
      // })
      
      // 模拟数据
      const mockData = {
        total: 5,
        list: [
          {
            applicationId: 1,
            projectId: 1,
            projectTitle: '智能制造产学研合作项目',
            applicantType: 'enterprise',
            message: '我们公司有相关技术团队，愿意参与合作',
            status: 'pending',
            createdAt: '2024-01-20',
            reviewComment: ''
          },
          {
            applicationId: 2,
            projectId: 2,
            projectTitle: '人工智能技术研发',
            applicantType: 'school',
            message: '我们学校有相关研究基础，希望合作',
            status: 'approved',
            createdAt: '2024-01-15',
            reviewComment: '同意合作，请尽快联系'
          }
        ]
      }
      
      applications.value = mockData.list
      total.value = mockData.total
    } catch (error) {
      console.error('获取申请列表失败:', error)
    }
  }
  
  function changePage(page: number) {
    currentPage.value = page
    fetchApplications()
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
    return new Date(dateString).toLocaleDateString('zh-CN')
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
  
  onMounted(fetchApplications)
  </script>