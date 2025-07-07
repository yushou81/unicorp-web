<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioApi, competitionAwardApi, researchApi } from '@/lib/api/achievement'
import type { StudentAchievementOverviewVO, ApiResponse, PortfolioItemVO, CompetitionAwardVO, ResearchVO } from '@/lib/api/achievement'
import { apiRequest } from '@/lib/api/apiClient'
import AddAchievementModal from '@/components/achievement/AddAchievementModal.vue'

interface Achievement {
  id: string | number
  title: string
  description: string
  type: 'PORTFOLIO' | 'AWARD' | 'RESEARCH'
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  coverImageUrl?: string | null
  createdAt: string | number
  studentId?: number
  studentName?: string
  organizationName?: string
  verifyStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
  likeCount?: number
}

const router = useRouter()
const loading = ref(false)
const achievements = ref<Achievement[]>([])
const overview = ref<StudentAchievementOverviewVO | null>(null)

// 筛选条件
const filters = ref({
  type: null as string | null,
  status: null as string | null,
  keyword: ''
})

// 弹窗控制
const showModal = ref(false)
const currentType = ref<'PORTFOLIO' | 'AWARD' | 'RESEARCH' | null>(null)

// 获取个人统计数据
const fetchOverview = async () => {
  try {
    const response = await apiRequest<ApiResponse<StudentAchievementOverviewVO>>('/v1/achievement/statistics/overview')
    overview.value = response.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取成果列表
const fetchAchievements = async () => {
  loading.value = true
  try {
    const [portfolios, awards, research] = await Promise.all([
      portfolioApi.getPortfolioItems(),
      competitionAwardApi.getAwards(),
      researchApi.getResearchList()
    ])
    
    const allAchievements: Achievement[] = [
      ...portfolios.data.map((item: PortfolioItemVO) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: 'PORTFOLIO' as const,
        status: 'PENDING' as const,
        coverImageUrl: item.coverImageUrl,
        createdAt: item.createdAt,
        studentId: item.userId,
        studentName: item.userName,
        organizationName: item.organizationName,
        verifyStatus: 'PENDING' as const,
        likeCount: item.likeCount
      })),
      ...awards.data.map((item: CompetitionAwardVO) => ({
        id: item.id,
        title: item.competitionName,
        description: item.description,
        type: 'AWARD' as const,
        status: item.isVerified ? 'VERIFIED' as const : 'PENDING' as const,
        coverImageUrl: item.certificateUrl,
        createdAt: item.createdAt,
        studentId: item.userId,
        studentName: item.userName,
        organizationName: item.organizationName,
        verifyStatus: item.isVerified ? 'VERIFIED' as const : 'PENDING' as const,
        likeCount: 0
      })),
      ...research.data.map((item: ResearchVO) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: 'RESEARCH' as const,
        status: item.isVerified ? 'VERIFIED' as const : 'PENDING' as const,
        coverImageUrl: item.coverImageUrl,
        createdAt: item.createdAt,
        studentId: item.userId,
        studentName: item.userName,
        organizationName: item.organizationName,
        verifyStatus: item.isVerified ? 'VERIFIED' as const : 'PENDING' as const,
        likeCount: 0
      }))
    ]

    achievements.value = allAchievements
  } catch (error) {
    console.error('获取成果列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 筛选后的成果列表
const filteredAchievements = computed(() => {
  return achievements.value.filter(achievement => {
    const matchType = !filters.value.type || achievement.type === filters.value.type
    const matchStatus = !filters.value.status || achievement.status === filters.value.status
    const matchKeyword = !filters.value.keyword || 
      achievement.title.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
      achievement.description.toLowerCase().includes(filters.value.keyword.toLowerCase())
    return matchType && matchStatus && matchKeyword
  })
})

// 格式化日期
const formatDate = (date: string | number) => {
  return new Date(date).toLocaleDateString()
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'VERIFIED': '已认证',
    'PENDING': '待认证',
    'REJECTED': '已驳回'
  }
  return statusMap[status] || status
}

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'PORTFOLIO': '作品',
    'AWARD': '获奖',
    'RESEARCH': '科研'
  }
  return typeMap[type] || type
}

// 处理成果操作
const handleAchievementAction = {
  view: (achievement: Achievement) => {
    const routes = {
      'PORTFOLIO': '/achievement/portfolio/',
      'AWARD': '/achievement/award/',
      'RESEARCH': '/achievement/research/'
    }
    const route = routes[achievement.type]
    if (route) {
      router.push({
        path: route + achievement.id,
        query: {
          isAuthor: String(achievement.studentId === overview.value?.userId)
        }
      })
    }
  },
  edit: (achievement: Achievement) => {
    currentType.value = achievement.type
    showModal.value = true
  }
}

// 处理添加成果
const handleAdd = () => {
  showModal.value = true
}

// 处理弹窗关闭
const handleModalClose = () => {
  showModal.value = false
  currentType.value = null
}

// 处理弹窗提交成功
const handleModalSuccess = () => {
  showModal.value = false
  currentType.value = null
  fetchAchievements() // 刷新列表
}

// 初始化
fetchOverview()
fetchAchievements()
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 顶部标题和统计 -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">我的成果</h2>
        <p class="mt-2 text-sm text-gray-600">展示您的学术成就和创新项目</p>
      </div>
      <button 
        @click="handleAdd" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>添加成果</span>
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 作品集 -->
      <div class="bg-blue-50 rounded-lg p-4 flex flex-col">
        <div class="flex items-center text-blue-600 mb-2">
          <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="font-medium">作品集</span>
        </div>
        <div class="text-3xl font-bold text-blue-700 mb-1">{{ overview?.portfolioCount || 0 }}</div>
        <div class="text-sm text-blue-600">已发布作品</div>
      </div>

      

      <!-- 科研成果 -->
      <div class="bg-green-50 rounded-lg p-4 flex flex-col">
        <div class="flex items-center text-green-600 mb-2">
          <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="font-medium">科研成果</span>
        </div>
        <div class="text-3xl font-bold text-green-700 mb-1">{{ overview?.researchCount || 0 }}</div>
        <div class="text-sm text-green-600">科研项目</div>
      </div>

      <!-- 获奖 -->
      <div class="bg-yellow-50 rounded-lg p-4 flex flex-col">
        <div class="flex items-center text-yellow-600 mb-2">
          <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="font-medium">获奖</span>
        </div>
        <div class="text-3xl font-bold text-yellow-700 mb-1">{{ overview?.awardCount || 0 }}</div>
        <div class="text-sm text-yellow-600">竞赛获奖</div>
      </div>

      <!-- 认证成果 -->
      <div class="bg-purple-50 rounded-lg p-4 flex flex-col">
        <div class="flex items-center text-purple-600 mb-2">
          <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span class="font-medium">认证获奖</span>
        </div>
        <div class="text-3xl font-bold text-purple-700 mb-1">{{ overview?.verifiedCount || 0 }}</div>
        <div class="text-sm text-purple-600">已认证获奖</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="filters.type" 
          class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option :value="null">全部类型</option>
          <option value="PORTFOLIO">作品</option>
          <option value="AWARD">获奖</option>
          <option value="RESEARCH">科研</option>
        </select>
        
        <select 
          v-if="filters.type === 'AWARD'"
          v-model="filters.status" 
          class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option :value="null">全部状态</option>
          <option value="PENDING">待认证</option>
          <option value="VERIFIED">已认证</option>
          <option value="REJECTED">已驳回</option>
        </select>

        <div class="flex-1">
          <input 
            v-model="filters.keyword" 
            type="text" 
            placeholder="搜索成果..." 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>
    </div>

    <!-- 成果列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="achievement in filteredAchievements" 
        :key="achievement.id"
        class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
      >
        <!-- 成果卡片头部 -->
        <div class="relative">
          <!-- 封面图片 -->
          <div class="h-48 bg-gray-100 overflow-hidden">
            <img 
              v-if="achievement.coverImageUrl" 
              :src="achievement.coverImageUrl" 
              :alt="achievement.title"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <!-- 状态标签 - 只在获奖类型显示 -->
          <div 
            v-if="achievement.type === 'AWARD'"
            class="absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-800': achievement.status === 'VERIFIED',
              'bg-yellow-100 text-yellow-800': achievement.status === 'PENDING',
              'bg-red-100 text-red-800': achievement.status === 'REJECTED'
            }"
          >
            {{ getStatusText(achievement.status) }}
          </div>
        </div>

        <!-- 成果卡片内容 -->
        <div class="p-4">
          <div class="mb-2 flex items-start justify-between">
            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ achievement.title }}</h3>
            <span 
              class="px-2 py-1 text-xs rounded-md"
              :class="{
                'bg-blue-50 text-blue-700': achievement.type === 'PORTFOLIO',
                'bg-purple-50 text-purple-700': achievement.type === 'AWARD',
                'bg-indigo-50 text-indigo-700': achievement.type === 'RESEARCH'
              }"
            >
              {{ getTypeText(achievement.type) }}
            </span>
          </div>
          
          <p class="text-sm text-gray-600 line-clamp-2 mb-4">{{ achievement.description }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ formatDate(achievement.createdAt) }}</span>
            <div class="flex items-center space-x-2">
              
              <button
                @click="handleAchievementAction.view(achievement)"
                class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>查看详情</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 空状态 -->
    <div 
      v-if="!loading && filteredAchievements.length === 0" 
      class="text-center py-12 bg-gray-50 rounded-lg"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">暂无成果</h3>
      <p class="mt-1 text-gray-500">点击右上角的添加按钮创建您的第一个成果</p>
    </div>

    <!-- 添加/编辑成果弹窗 -->
    <AddAchievementModal
      v-if="showModal"
      :show="showModal"
      :type="currentType"
      @close="handleModalClose"
      @success="handleModalSuccess"
    />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 添加渐变背景动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 