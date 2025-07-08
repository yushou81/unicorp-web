<template>
    <div>
      
      <div class="container mx-auto px-6 py-12 max-w-7xl">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-2xl font-medium text-gray-900">成果审核</h1>
          <p class="mt-1 text-base text-gray-500">审核学生提交的作品集、竞赛获奖和科研成果</p>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">总览</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">总成果数</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.totalAchievements }}</p>
              <p class="mt-1 text-sm text-gray-400">包含所有类型的成果总数</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <span class="text-sm font-medium text-green-600">已认</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">已认证成果</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.verifiedCount || 0 }}</p>
              <p class="mt-1 text-sm text-gray-400">认证率 {{ statistics.verifiedRate || 'NaN%' }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <span class="text-sm font-medium text-purple-600">作品</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">作品数量</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.portfolioCount }}</p>
              <p class="mt-1 text-sm text-gray-400">个人作品和项目展示</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <span class="text-sm font-medium text-yellow-600">获奖</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">获奖数量</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.awardCount }}</p>
              <p class="mt-1 text-sm text-gray-400">竞赛和荣誉获奖</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <span class="text-sm font-medium text-indigo-600">科研</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">科研成果</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.researchCount }}</p>
              <p class="mt-1 text-sm text-gray-400">论文、专利等科研成果</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 shadow-sm relative">
            <div class="absolute top-3 right-3">
              <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                <span class="text-sm font-medium text-pink-600">访问</span>
              </div>
            </div>
            <div class="pr-12">
              <p class="text-base text-gray-500">总访问量</p>
              <p class="mt-1 text-2xl font-semibold">{{ statistics.visitCount || 0 }}</p>
              <p class="mt-1 text-sm text-gray-400">成果展示页面访问量</p>
            </div>
          </div>
        </div>
        
        <!-- 错误提示 -->
        <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ error }}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="error = ''">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>关闭</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
        
        <!-- 筛选器 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="p-4">
            <div class="flex items-center space-x-4">
              <div class="w-48">
              <select 
                v-model="filters.type" 
                  class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
              >
                  <option value="" selected>全部类型</option>
                  <option :value="AchievementType.PORTFOLIO">作品集</option>
                  <option :value="AchievementType.AWARD">竞赛获奖</option>
                  <option :value="AchievementType.RESEARCH">科研成果</option>
              </select>
            </div>
              <div class="w-48">
              <select 
                  v-model="filters.verifyStatus" 
                  class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
              >
                  <option value="" selected>全部状态</option>
                  <option :value="AchievementStatus.PENDING">待认证</option>
                  <option :value="AchievementStatus.VERIFIED">已认证</option>
                  <option :value="AchievementStatus.REJECTED">已拒绝</option>
              </select>
            </div>
              <div class="flex-1">
                <div class="relative">
              <input 
                    type="text" 
                v-model="filters.keyword" 
                    placeholder="搜索标题、学生姓名等"
                    class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11 pl-4 pr-10"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
            </div>
          </div>
              <div class="flex space-x-3">
            <button 
                  @click="handleReset" 
                  class="px-5 py-2 text-base border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
            <button 
                  @click="handleFilterChange" 
                  class="px-5 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                  应用筛选
            </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 成果列表 -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium">成果列表</h2>
              <div class="text-base text-gray-500">
                共 {{ total }} 条记录
              </div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">标题</th>
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">类型</th>
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">学生</th>
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">提交时间</th>
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">状态</th>
                  <th class="text-left py-3 px-4 text-base font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in achievements" :key="item.id" class="hover:bg-gray-50">
                  <td class="py-3 px-4 text-base">{{ item.title }}</td>
                  <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium" :class="getTypeClass(item.type)">
                      {{ formatType(item.type) }}
                      </span>
                    </td>
                  <td class="py-3 px-4 text-base">{{ item.studentName }}</td>
                  <td class="py-3 px-4 text-base text-gray-500">{{ formatDate(item.createdAt) }}</td>
                  <td class="py-3 px-4">
                    <span 
                      :class="getStatusClass(item.verifyStatus)"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium"
                    >
                      {{ formatStatus(item.verifyStatus) }}
                      </span>
                    </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-3">
                      <button 
                        @click="viewDetail(item)" 
                        class="text-base text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        查看
                      </button>
                      <button 
                        v-if="item.verifyStatus === 'pending'"
                        @click="openVerifyModal(item)"
                        class="text-base text-green-600 hover:text-green-800 transition-colors"
                      >
                        审核
                      </button>
                    </div>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 border-t border-gray-100">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
          </div>
        </div>
        
        <!-- 审核弹窗 -->
        <div v-if="showVerifyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">审核成果</h3>
              <button @click="closeVerifyModal" class="text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mb-4">
              <label class="block text-base font-medium mb-1 text-gray-700">审核结果</label>
              <select 
                v-model="verifyForm.isVerified" 
                class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
              >
                <option :value="true">通过</option>
                <option :value="false">拒绝</option>
              </select>
              </div>
            <div class="mb-4">
              <label class="block text-base font-medium mb-1 text-gray-700">审核意见</label>
                <textarea 
                v-model="verifyForm.comment"
                rows="4"
                class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="请输入审核意见"
                ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeVerifyModal"
                class="px-5 py-2 text-base border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                @click="submitVerify"
                class="px-5 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  import Pagination from '@/components/ui/Pagination.vue'
  import { 
    type Achievement, 
    AchievementStatus,
    type VerifyAwardDTO,
    type VerifyResearchDTO,
    type CompetitionAwardVO,
    type ResearchVO,
    competitionAwardApi,
    researchApi,
    achievementStatisticsApi,
    AchievementType,
    getSchoolStudentsOverview,
    portfolioApi
  } from '@/lib/api/achievement'
  import { useAppStore } from '@/stores/app'
  import { User } from '@/types'
  import { 
    competitionAwardApi,
    portfolioApi,
    researchApi,
    achievementStatisticsApi,
    AchievementType,
    AchievementStatus
  } from '@/lib/api/achievement'
  import type { 
    Achievement,
    CompetitionAwardVO,
    PortfolioItemVO,
    ResearchVO,
    StudentAchievementOverviewVO
  } from '@/lib/api/achievement'
  import { getMe } from '@/lib/api/auth'

  // 类型定义
  interface Filters {
    type: string
    verifyStatus: string
    keyword: string
    studentId: string
    startDate: string
    endDate: string
  }

  interface VerifyForm {
    isVerified: boolean
    comment?: string
  }

  const router = useRouter()
  const appStore = useAppStore()
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)
  const achievements = ref<Achievement[]>([])
  const showVerifyModal = ref(false)
  const selectedAchievement = ref<Achievement | null>(null)
  const verifyForm = ref<VerifyForm>({
    isVerified: true,
    comment: ''
  })
  const error = ref<string>('')
  
  // 统计数据
  const statistics = ref<{
    totalAchievements: number
    verifiedCount: number
    portfolioCount: number
    awardCount: number
    researchCount: number
    visitCount: number
    verifiedRate?: string
  }>({
    totalAchievements: 0,
    verifiedCount: 0,
    portfolioCount: 0,
    awardCount: 0,
    researchCount: 0,
    visitCount: 0
  })
  
  // 筛选条件
  const filters = ref<Filters>({
    type: '',
    verifyStatus: '',
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
      if (filters.value.verifyStatus) {
        if (filters.value.verifyStatus === 'pending' && achievement.verifyStatus !== 'pending') return false
        if (filters.value.verifyStatus === 'verified' && achievement.verifyStatus !== 'verified') return false
        if (filters.value.verifyStatus === 'rejected' && achievement.verifyStatus !== 'rejected') return false
      }
      
      // 按关键词筛选
      if (filters.value.keyword) {
        const keyword = filters.value.keyword.toLowerCase()
        const title = (achievement.title || '').toLowerCase()
        const studentName = (achievement.studentName || '').toLowerCase()
        if (!title.includes(keyword) && !studentName.includes(keyword)) {
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
  
  // 检查用户权限
  const checkUserPermission = () => {
    const user = appStore.user as User
    if (!user) {
      router.push('/login')
      return false
    }

    const allowedRoles = ['TEACHER', 'SCH_ADMIN', 'SCHOOLADMIN']
    if (!allowedRoles.includes(user.role.toUpperCase())) {
      router.push('/')
      return false
    }

    return true
  }
  
  // 获取统计数据
  const fetchStatistics = async () => {
    if (!checkUserPermission()) return

    try {
      const user = appStore.user as User
      if (!user?.organizationId) return

      // 教师有权限获取组织的成果统计
      const statsResponse = await achievementStatisticsApi.getSchoolStatistics()
      
      if (statsResponse.data) {
        statistics.value = {
          totalAchievements: statsResponse.data.totalAchievements || 0,
          verifiedCount: statsResponse.data.verifiedCount || 0,
          portfolioCount: statsResponse.data.portfolioCount || 0,
          awardCount: statsResponse.data.awardCount || 0,
          researchCount: statsResponse.data.researchCount || 0,
          visitCount: statsResponse.data.totalStudents || 0,
          verifiedRate: statsResponse.data.totalAchievements > 0 
            ? `${Math.round((statsResponse.data.verifiedCount / statsResponse.data.totalAchievements) * 100)}%` 
            : '0%'
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }
  
  // 获取成果列表
  const fetchAchievements = async () => {
    if (!checkUserPermission()) return

    loading.value = true
    error.value = ''
    try {
      const user = appStore.user as User
      if (!user) {
        error.value = '用户信息不存在'
        return
      }

      if (!user.organizationId) {
        error.value = '组织ID不存在'
        return
      }

      // 添加调试日志
      console.log('开始获取成果列表，用户信息:', {
        userId: user.id,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organizationName
      })

      // 获取统计数据
      await fetchStatistics()

      try {
        // 获取学生成果概览
        const overviewResponse = await achievementStatisticsApi.getSchoolStudentsOverview({
        page: currentPage.value,
        size: 10,
          type: filters.value.type || undefined,
          verifyStatus: filters.value.verifyStatus || undefined,
          keyword: filters.value.keyword || undefined,
          startDate: filters.value.startDate || undefined,
          endDate: filters.value.endDate || undefined
        })
        
        if (!overviewResponse.data) {
          console.warn('[TeacherVerifyView] 响应中没有data字段')
          return
        }
        
        // 更新数据
        achievements.value = overviewResponse.data.content || []
        total.value = overviewResponse.data.totalElements || 0
        totalPages.value = overviewResponse.data.totalPages || 1

    } catch (err: any) {
      console.error('获取成果列表失败:', err)
      error.value = err.message || '获取成果列表失败，请稍后重试'
      achievements.value = []
      totalPages.value = 1
      
      // 如果是401错误,跳转到登录页
      if (err.status === 401) {
        appStore.logout()
        router.push('/login')
        return
      }
      
      // 如果是403错误,提示权限不足
      if (err.status === 403) {
        error.value = '您没有权限访问此页面'
        router.push('/')
        return
      }
    } finally {
      loading.value = false
    }
  }
  
  // 打开审核模态框
  const openVerifyModal = (achievement: Achievement) => {
    selectedAchievement.value = achievement
    verifyForm.value = {
      isVerified: true,
      comment: ''
    }
    showVerifyModal.value = true
  }
  
  // 关闭审核模态框
  const closeVerifyModal = () => {
    showVerifyModal.value = false
    selectedAchievement.value = null
    verifyForm.value = {
      isVerified: true,
      comment: ''
    }
  }
  
  // 提交审核
  const submitVerify = async () => {
    if (!selectedAchievement.value) return
    
    try {
      let response
      const verifyData = {
        isVerified: verifyForm.value.isVerified
        // comment: verifyForm.value.comment // Removed as per backend DTO
      }

      switch (selectedAchievement.value.type) {
        case AchievementType.PORTFOLIO:
          response = await portfolioApi.verifyPortfolio(selectedAchievement.value.id, verifyData)
          break
        case AchievementType.AWARD:
          response = await competitionAwardApi.verifyAward(selectedAchievement.value.id, verifyData)
          break
        case AchievementType.RESEARCH:
          response = await researchApi.verifyResearch(selectedAchievement.value.id, verifyData)
          break
        default:
          throw new Error('不支持的成果类型')
      }
      
      if (response.data) {
        // 刷新成果列表
      await fetchAchievements()
        closeVerifyModal()
      }
    } catch (err) {
      console.error('审核失败:', err)
      error.value = '审核失败'
    }
  }
  
  // 处理分页变化
  const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchAchievements()
  }
  
  // 筛选条件改变
  const handleFilterChange = () => {
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 重置筛选条件
  const handleReset = () => {
    filters.value = {
      type: '',
      verifyStatus: '',
      keyword: '',
      studentId: '',
      startDate: '',
      endDate: ''
    }
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 查看成果详情
  const viewDetail = (achievement: Achievement) => {
    const routes = {
      [AchievementType.PORTFOLIO]: '/achievement/portfolio/',
      [AchievementType.AWARD]: '/achievement/award/',
      [AchievementType.RESEARCH]: '/achievement/research/'
    }
    const route = routes[achievement.type]
    if (route) {
      router.push(route + achievement.id)
    }
  }
  
  // 获取成果类型显示文本
  const formatType = (type: string) => {
    switch (type) {
      case 'portfolio': return '作品'
      case 'award': return '获奖'
      case 'research': return '科研成果'
      default: return '未知类型'
    }
  }
  
  // 获取成果状态显示文本
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return '待审核'
      case 'verified': return '已认证'
      case 'rejected': return '已拒绝'
      default: return '未知状态'
    }
  }
  
  // 获取状态样式类w
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
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
  
  onMounted(async () => {
    console.log('[TeacherVerifyView] 当前用户信息:', appStore.user)
    console.log('[TeacherVerifyView] 组织ID:', appStore.user?.organizationId)
    
    // 获取完整的用户信息
    try {
      const response = await getMe()
      if (response.data) {
        console.log('[TeacherVerifyView] 获取到完整用户信息:', response.data)
        appStore.setUser(response.data)
        
        // 重新检查组织ID
        if (!appStore.user?.organizationId) {
          console.warn('[TeacherVerifyView] 警告: 获取完整用户信息后仍未获取到组织ID')
          return
        }
        
        // 有组织ID后再获取数据
        await fetchStatistics()
        await fetchAchievements()
      }
    } catch (error) {
      console.error('[TeacherVerifyView] 获取用户信息失败:', error)
    }
  })
  </script>