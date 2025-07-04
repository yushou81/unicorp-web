<template>
    <div>
      
      <div class="container mx-auto px-6 py-12 max-w-7xl">
        <!-- 页面标题 -->
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-gray-900">成果审核</h1>
          <p class="mt-2 text-gray-600">审核并认证学生提交的成果</p>
        </div>
        
        <!-- 筛选条件 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">成果类型</label>
              <select 
                v-model="filters.type" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部类型</option>
                <option value="portfolio">作品</option>
                <option value="award">获奖</option>
                <option value="research">科研成果</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">审核状态</label>
              <select 
                v-model="filters.status" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部状态</option>
                <option value="pending">待审核</option>
                <option value="verified">已认证</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
              <div class="relative">
                <input 
                  v-model="filters.keyword" 
                  type="text" 
                  placeholder="搜索成果名称、描述或学生姓名" 
                  class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">学生ID</label>
              <input 
                v-model="filters.studentId" 
                type="number" 
                placeholder="输入学生ID" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
              <input 
                v-model="filters.startDate" 
                type="date" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
              <input 
                v-model="filters.endDate" 
                type="date" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <button 
              @click="handleResetFilters" 
              class="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
            >
              重置
            </button>
            <button 
              @click="handleApplyFilters" 
              class="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              筛选
            </button>
          </div>
        </div>
        
        <!-- 成果列表 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成果</th>
                  <th scope="col" class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生</th>
                  <th scope="col" class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th scope="col" class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th scope="col" class="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
                  <th scope="col" class="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-if="loading">
                  <tr>
                    <td colspan="6" class="px-8 py-6 text-center">
                      <div class="flex justify-center">
                        <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-r-transparent"></div>
                      </div>
                      <p class="text-gray-500 mt-2">加载中...</p>
                    </td>
                  </tr>
                </template>
                <template v-else-if="filteredAchievements.length === 0">
                  <tr>
                    <td colspan="6" class="px-8 py-4 text-center text-gray-500">
                      没有找到符合条件的成果
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="achievement in filteredAchievements" :key="achievement.id" class="hover:bg-gray-50">
                    <td class="px-8 py-5 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600" @click="viewAchievementDetail(achievement)">
                            {{ achievement.title }}
                          </div>
                          <div class="text-sm text-gray-500 truncate max-w-md">
                            {{ achievement.description }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ achievement.studentName }}</div>
                      <div class="text-sm text-gray-500">ID: {{ achievement.studentId }}</div>
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ getTypeText(achievement.type) }}
                      </span>
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(achievement.status)">
                        {{ getStatusText(achievement.status) }}
                      </span>
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(achievement.createdAt) }}
                    </td>
                    <td class="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="viewAchievementDetail(achievement)" 
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        查看
                      </button>
                      <button 
                        v-if="achievement.status === 'pending'"
                        @click="openVerifyModal(achievement)" 
                        class="text-blue-600 hover:text-blue-900"
                      >
                        审核
                      </button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
        
        <!-- 审核模态框 -->
        <div v-if="showVerifyModal && currentAchievement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <div class="px-8 py-5 border-b flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">审核成果</h3>
              <button @click="showVerifyModal = false" class="text-gray-400 hover:text-gray-500">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="px-8 py-5">
              <div class="mb-5">
                <p class="text-sm font-medium text-gray-700">成果标题</p>
                <p class="mt-1">{{ currentAchievement.title }}</p>
              </div>
              
              <div class="mb-5">
                <p class="text-sm font-medium text-gray-700">学生</p>
                <p class="mt-1">{{ currentAchievement.studentName }}</p>
              </div>
              
              <div class="mb-5">
                <p class="text-sm font-medium text-gray-700">类型</p>
                <p class="mt-1">{{ getTypeText(currentAchievement.type) }}</p>
              </div>
              
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">审核结果</label>
                <div class="flex space-x-4">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="verifyStatus" value="verified" class="form-radio h-4 w-4 text-blue-600">
                    <span class="ml-2">通过</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="verifyStatus" value="rejected" class="form-radio h-4 w-4 text-red-600">
                    <span class="ml-2">拒绝</span>
                  </label>
                </div>
              </div>
              
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
                <textarea 
                  v-model="verifyComment" 
                  rows="3" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入审核意见或建议..."
                ></textarea>
              </div>
            </div>
            
            <div class="px-8 py-5 border-t bg-gray-50 flex justify-end">
              <button 
                @click="showVerifyModal = false" 
                class="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                @click="submitVerification" 
                class="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                :disabled="!verifyStatus"
                :class="{ 'opacity-50 cursor-not-allowed': !verifyStatus }"
              >
                提交
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
  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
  import Pagination from '@/components/ui/Pagination.vue'
  import Navbar from '@/components/layout/Navbar.vue'
  import { achievementApi } from '@/lib/api/achievement'
  
  const router = useRouter()
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const achievements = ref([])
  const showVerifyModal = ref(false)
  const currentAchievement = ref(null)
  const verifyComment = ref('')
  const verifyStatus = ref('')
  
  // 筛选条件
  const filters = ref({
    type: '',
    status: 'pending', // 默认显示待审核的成果
    keyword: '',
    studentId: '',
    startDate: '',
    endDate: ''
  })
  
  // 根据筛选条件过滤成果
  const filteredAchievements = computed(() => {
    return achievements.value.filter(achievement => {
      // 按类型筛选
      if (filters.value.type && achievement.type !== filters.value.type) return false
      
      // 按状态筛选
      if (filters.value.status) {
        if (filters.value.status === 'pending' && achievement.status !== 'pending') return false
        if (filters.value.status === 'verified' && achievement.status !== 'verified') return false
        if (filters.value.status === 'rejected' && achievement.status !== 'rejected') return false
      }
      
      // 按关键词筛选
      if (filters.value.keyword) {
        const keyword = filters.value.keyword.toLowerCase()
        const title = (achievement.title || '').toLowerCase()
        const description = (achievement.description || '').toLowerCase()
        const studentName = (achievement.studentName || '').toLowerCase()
        if (!title.includes(keyword) && !description.includes(keyword) && !studentName.includes(keyword)) {
          return false
        }
      }
      
      // 按学生ID筛选
      if (filters.value.studentId && achievement.studentId !== parseInt(filters.value.studentId)) {
        return false
      }
      
      // 按日期范围筛选
      if (filters.value.startDate && new Date(achievement.createdAt) < new Date(filters.value.startDate)) {
        return false
      }
      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate)
        endDate.setDate(endDate.getDate() + 1) // 包含结束当天
        if (new Date(achievement.createdAt) > endDate) {
          return false
        }
      }
      
      return true
    })
  })
  
  // 获取成果列表
  const fetchAchievements = async () => {
    loading.value = true
    try {
      const response = await achievementApi.getList({
        page: currentPage.value,
        size: 10,
        type: filters.value.type,
        status: filters.value.status,
        keyword: filters.value.keyword,
        studentId: filters.value.studentId,
        startDate: filters.value.startDate,
        endDate: filters.value.endDate
      })
      
      if (response && response.data) {
        achievements.value = response.data.records || []
        totalPages.value = response.data.pages || 1
      } else {
        achievements.value = []
        totalPages.value = 1
      }
    } catch (error) {
      console.error('获取成果列表失败:', error)
      achievements.value = []
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }
  
  // 打开审核模态框
  const openVerifyModal = (achievement) => {
    currentAchievement.value = achievement
    verifyComment.value = ''
    verifyStatus.value = ''
    showVerifyModal.value = true
  }
  
  // 提交审核结果
  const submitVerification = async () => {
    if (!currentAchievement.value || !verifyStatus.value) return
    
    loading.value = true
    try {
      const isApproved = verifyStatus.value === 'verified'
      await achievementApi.verifyAchievement(
        currentAchievement.value.id,
        isApproved,
        verifyComment.value
      )
      
      // 更新本地成果状态
      const index = achievements.value.findIndex(a => a.id === currentAchievement.value.id)
      if (index !== -1) {
        achievements.value[index].status = verifyStatus.value
        achievements.value[index].verifyComment = verifyComment.value
      }
      
      // 关闭模态框
      showVerifyModal.value = false
      
      // 如果当前是按状态筛选的，可能需要重新获取列表
      if (filters.value.status) {
        fetchAchievements()
      }
    } catch (error) {
      console.error('提交审核结果失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 处理分页变化
  const handlePageChange = (page) => {
    currentPage.value = page
    fetchAchievements()
  }
  
  // 应用筛选条件
  const handleApplyFilters = () => {
    currentPage.value = 1 // 重置到第一页
    fetchAchievements()
  }
  
  // 重置筛选条件
  const handleResetFilters = () => {
    filters.value = {
      type: '',
      status: 'pending',
      keyword: '',
      studentId: '',
      startDate: '',
      endDate: ''
    }
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 查看成果详情
  const viewAchievementDetail = (achievement) => {
    router.push(`/achievement/detail/${achievement.type}/${achievement.id}`)
  }
  
  // 获取成果类型显示文本
  const getTypeText = (type) => {
    switch (type) {
      case 'portfolio': return '作品'
      case 'award': return '获奖'
      case 'research': return '科研成果'
      default: return '未知类型'
    }
  }
  
  // 获取成果状态显示文本
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待审核'
      case 'verified': return '已认证'
      case 'rejected': return '已拒绝'
      default: return '未知状态'
    }
  }
  
  // 获取状态样式类
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 获取创建时间的格式化显示
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  onMounted(() => {
    fetchAchievements()
  })
  </script>