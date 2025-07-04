<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import AchievementCard from '@/components/achievement/AchievementCard.vue'
import AchievementStats from '@/components/achievement/AchievementStats.vue'
import PortfolioCard from '@/components/achievement/PortfolioCard.vue'
import AwardCard from '@/components/achievement/AwardCard.vue'
import ResearchCard from '@/components/achievement/ResearchCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import AddAchievementModal from '@/components/achievement/AddAchievementModal.vue'
import { achievementApi } from '@/lib/api/achievement'

interface StudentAchievementOverview {
  userId: number
  username: string
  totalAchievements: number
  verifiedAchievements: number
  competitionAwards: number
  researchAchievements: number
  portfolioItems: number
  totalViews: number
}

// 添加API返回类型定义
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface PaginatedResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

interface Achievement {
  id: number
  type: 'portfolio' | 'award' | 'research'
  title: string
  description: string
  isVerified: boolean
  createdAt: string
  coverImageUrl?: string
  viewCount: number
  [key: string]: any // 允许额外的动态属性
}

const router = useRouter()
const loading = ref(false)
const showAddModal = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

const overview = ref<StudentAchievementOverview>({
  userId: 0,
  username: '',
  totalAchievements: 0,
  verifiedAchievements: 0,
  competitionAwards: 0,
  researchAchievements: 0,
  portfolioItems: 0,
  totalViews: 0
})

const recentAwards = ref([])
const recentPortfolios = ref([])
const recentResearch = ref([])

const statistics = ref({
  total: 0,
  verified: 0,
  portfolio: 0,
  awards: 0,
  research: 0,
  views: 0
})

const filters = ref({
  type: '',
  status: '',
  keyword: ''
})

const achievements = ref([])

const filteredAchievements = computed(() => {
  return achievements.value.filter(achievement => {
    if (filters.value.type && achievement.type !== filters.value.type) return false
    if (filters.value.status === 'verified' && !achievement.isVerified) return false
    if (filters.value.status === 'pending' && achievement.isVerified) return false
    return true
  })
})

const getCardComponent = (type: string) => {
  switch (type) {
    case 'portfolio':
      return PortfolioCard
    case 'award':
      return AwardCard
    case 'research':
      return ResearchCard
    default:
      return AchievementCard
  }
}

const fetchOverview = async () => {
  try {
    loading.value = true
    const response = await achievementApi.getOverview()
    overview.value = response.data
  } catch (error) {
    console.error('获取成果概览失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchRecentAchievements = async () => {
  /* 注释掉使用模拟数据的代码
  // 直接使用模拟数据显示最新成果
  console.log('直接使用模拟数据显示最新成果')
  const portfolioSample = mockAchievements.filter(item => item.type === 'portfolio')
  const awardSample = mockAchievements.filter(item => item.type === 'award')
  const researchSample = mockAchievements.filter(item => item.type === 'research')
  
  recentPortfolios.value = portfolioSample
  recentAwards.value = awardSample
  recentResearch.value = researchSample
  
  achievements.value = mockAchievements
  */
  
  // 使用API接口获取数据
  try {
    //  并行获取各类最新成果
    const [awardsRes, portfoliosRes, researchRes] = await Promise.all([
      achievementApi.getAwards({ page: 1, size: 3 }) as Promise<ApiResponse<PaginatedResponse<Achievement>>>,
      achievementApi.getPortfolios({ page: 1, size: 3 }) as Promise<ApiResponse<PaginatedResponse<Achievement>>>,
      achievementApi.getResearch({ page: 1, size: 3 }) as Promise<ApiResponse<PaginatedResponse<Achievement>>>
    ])
    
    // 检查是否获取到数据
    recentAwards.value = awardsRes.data?.records || []
    recentPortfolios.value = portfoliosRes.data?.records || []
    recentResearch.value = researchRes.data?.records || []
      
      // 合并所有成果到列表中
      achievements.value = [
        ...recentAwards.value,
        ...recentPortfolios.value, 
        ...recentResearch.value
      ]
  } catch (error) {
    console.error('获取最新成果失败:', error)
    recentAwards.value = []
    recentPortfolios.value = []
    recentResearch.value = []
    achievements.value = []
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

const viewDetail = (achievement: any) => {
  router.push(`/achievement/detail/${achievement.type}/${achievement.id}`)
}

// 添加模拟数据用于调试界面
/* 
const mockAchievements = [
  // 作品类型示例数据
  {
    id: 1,
    type: 'portfolio',
    title: '智能校园导航系统',
    description: '基于微信小程序的校园导航系统，包含地图导航、课表查询、校园信息等功能。使用Vue、微信小程序API开发。',
    isVerified: true,
    createdAt: '2023-09-15',
    coverImageUrl: 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=校园导航系统',
    projectUrl: 'https://github.com/example/campus-navigator',
    teamMembers: '张三、李四、王五',
    category: '移动应用',
    tags: ['微信小程序', 'Vue', '校园服务'],
    viewCount: 128
  },
  // 获奖类型示例数据
  {
    id: 2,
    type: 'award',
    title: '全国大学生计算机设计大赛一等奖',
    description: '参加2023年全国大学生计算机设计大赛，作品"智能出行助手"获得一等奖。该作品解决了老年人出行难题，获得评委一致好评。',
    isVerified: true,
    createdAt: '2023-08-20',
    coverImageUrl: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=计算机设计大赛',
    competitionName: '全国大学生计算机设计大赛',
    awardName: '一等奖',
    awardDate: '2023-07-15',
    organizer: '教育部高等教育司',
    level: '国家级',
    participants: '张三、李四',
    certificateUrl: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=获奖证书',
    viewCount: 245
  },
  // 科研成果类型示例数据
  {
    id: 3,
    type: 'research',
    title: '基于深度学习的医学影像分析研究',
    description: '利用卷积神经网络对肺部CT影像进行分析，辅助医生进行肺结节早期检测。模型准确率达到94.5%，优于现有主流算法。',
    isVerified: false,
    createdAt: '2023-10-10',
    coverImageUrl: 'https://via.placeholder.com/400x300/0891b2/ffffff?text=医学影像分析',
    researchType: 'paper',
    authors: '张三、李教授',
    publicationDate: '2023-09-20',
    publisher: '中国科学院计算技术研究所',
    resources: [
      {
        id: 1,
        originalFileName: '研究论文.pdf',
        description: '已发表论文全文',
        resourceUrl: '#'
      }
    ],
    viewCount: 89
  }
];
*/

const fetchAchievements = async () => {
  loading.value = true
  
  /* 注释掉模拟数据代码
  // 直接使用模拟数据，跳过API调用
  console.log('直接使用模拟数据进行界面调试')
  console.log('模拟数据:', mockAchievements)
  
  // 根据筛选条件过滤模拟数据
  let filteredData = [...mockAchievements]
  console.log('过滤前数据长度:', filteredData.length)
  
  if (filters.value.type) {
    filteredData = filteredData.filter(item => item.type === filters.value.type)
    console.log('按类型过滤后数据长度:', filteredData.length)
  }
  
  if (filters.value.status) {
    const isVerified = filters.value.status === 'verified'
    filteredData = filteredData.filter(item => item.isVerified === isVerified)
    console.log('按状态过滤后数据长度:', filteredData.length)
  }
  
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.description.toLowerCase().includes(keyword)
    )
    console.log('按关键词过滤后数据长度:', filteredData.length)
  }
  
  console.log('最终数据:', filteredData)
  achievements.value = filteredData
  totalPages.value = Math.ceil(filteredData.length / 10)
  loading.value = false
  */
  
  // 使用API调用
  try {
    // 尝试调用API获取数据
    const response = await achievementApi.getList({
      page: currentPage.value,
      size: 10,
      type: filters.value.type,
      status: filters.value.status,
      keyword: filters.value.keyword
    }) as ApiResponse<PaginatedResponse<Achievement>>
    
    // 检查API返回的数据
    if (response && response.data && response.data.records && response.data.records.length > 0) {
      achievements.value = response.data.records
      totalPages.value = response.data.pages
    } else {
      console.log('API返回数据为空')
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

const fetchStatistics = async () => {
  /* 注释掉模拟统计数据
  // 直接使用模拟统计数据
  console.log('直接使用模拟统计数据进行界面调试')
  statistics.value = {
    total: 15,
    verified: 8,
    portfolio: 6,
    awards: 5,
    research: 4,
    views: 520
  }
  */
  
  try {
    const response = await achievementApi.getStatistics() as ApiResponse<typeof statistics.value>
    if (response && response.data) {
      statistics.value = response.data
    } else {
      console.log('未获取到统计数据')
      statistics.value = {
        total: 0,
        verified: 0,
        portfolio: 0,
        awards: 0,
        research: 0,
        views: 0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    statistics.value = {
      total: 0,
      verified: 0,
      portfolio: 0,
      awards: 0,
      research: 0,
      views: 0
    }
  }
}

// 应用筛选条件
const handleApply = () => {
  currentPage.value = 1
  fetchAchievements()
}

// 重置筛选条件
const handleReset = () => {
  filters.value.type = ''
  filters.value.status = ''
  filters.value.keyword = ''
  currentPage.value = 1
  fetchAchievements()
}

// 处理添加成果
const handleAddAchievement = (data: any) => {
  loading.value = true
  
  /* 注释掉模拟添加成果代码
  // 模拟添加成果成功
  console.log('模拟添加成果:', data)
  setTimeout(() => {
    // 把新成果添加到模拟数据中
    const newAchievement = {
      ...data,
      id: mockAchievements.length + 1,
      createdAt: new Date().toISOString(),
      isVerified: false,
      viewCount: 0
    }
    mockAchievements.push(newAchievement)
    
    // 刷新列表
    fetchAchievements()
    fetchStatistics()
    showAddModal.value = false
    loading.value = false
    
    // 显示成功消息
    alert('成果添加成功！')
  }, 1000) // 模拟网络延迟
  */
  
  // 使用API接口
  achievementApi.create(data)
    .then(response => {
      // 添加成功后刷新列表
      fetchAchievements()
      fetchStatistics()
      showAddModal.value = false
      alert('成果添加成功！')
    })
    .catch(error => {
      console.error('添加成果失败:', error)
      alert('添加成果失败: ' + error.message)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  console.log('组件挂载完成')
  
  /* 注释掉直接设置模拟数据的代码
  // 直接设置模拟数据，跳过API调用
  achievements.value = mockAchievements
  console.log('直接设置模拟数据:', achievements.value)
  console.log('过滤后的数据:', filteredAchievements.value)
  */
  
  // 使用API调用
  fetchOverview()
  fetchRecentAchievements()
  fetchAchievements()
  fetchStatistics()
})
</script>

<template>
  <div>
    <!-- 添加导航栏 -->
    
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <!-- 页面标题 -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-900">成果展示</h1>
        <p class="mt-3 text-lg text-gray-600">展示您的作品集、竞赛获奖和科研成果</p>
      </div>

      <!-- 统计数据 -->
      <div class="mb-12 p-8 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 relative overflow-hidden shadow-sm border border-blue-100">
        <!-- 装饰元素 -->
        <div class="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full opacity-20 -mr-24 -mt-24"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full opacity-20 -ml-24 -mb-24"></div>
        
        <div class="relative z-10">
          <AchievementStats
            :total-achievements="statistics.total"
            :verified-achievements="statistics.verified"
            :portfolio-count="statistics.portfolio"
            :award-count="statistics.awards"
            :research-count="statistics.research"
            :total-views="statistics.views"
          />
        </div>
      </div>
      
      <div class="relative mb-12">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white px-6 text-xl font-medium text-gray-600">成果管理</span>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-12 border border-gray-100">
                  <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-800">筛选成果</h3>
            <div class="flex items-center space-x-3">
            <button @click="handleReset" class="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置
            </button>
            <button @click="handleApply" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              筛选
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">成果类型</label>
            <select 
              v-model="filters.type" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">全部类型</option>
              <option value="portfolio">作品</option>
              <option value="award">获奖</option>
              <option value="research">科研成果</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">认证状态</label>
            <select 
              v-model="filters.status" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">全部状态</option>
              <option value="verified">已认证</option>
              <option value="pending">待认证</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
            <div class="relative">
              <input 
                v-model="filters.keyword" 
                type="text" 
                placeholder="搜索成果名称、标签" 
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加成果按钮已移至页面标题处 -->

      <!-- 成果列表 -->
      <div class="grid grid-cols-1 gap-8">
        <template v-if="loading">
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-r-transparent"></div>
            <p class="mt-3 text-gray-600 text-lg">加载中...</p>
          </div>
        </template>
        <template v-else-if="achievements.length === 0">
          <div class="text-center py-12">
            <p class="text-gray-600 text-lg">暂无成果记录</p>
          </div>
        </template>
        <template v-else>
          <!-- 成果列表统计摘要 -->
          <div class="mb-8 flex justify-between items-center">
            <div class="flex space-x-10">
              <div>
                <span class="text-sm text-gray-500 mb-1 block">总成果</span>
                <div class="font-medium text-xl text-gray-800">{{ achievements.length }}</div>
              </div>
              <div>
                <span class="text-sm text-gray-500 mb-1 block">已筛选</span>
                <div class="font-medium text-xl text-gray-800">{{ filteredAchievements.length }}</div>
              </div>
            </div>
            <button
              type="button"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center text-base"
              @click="showAddModal = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              添加成果
            </button>
          </div>
          
          <!-- 成果卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <div v-for="achievement in achievements" :key="achievement.id" 
                                 class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col border-t-4"
                :class="{
                  'border-t-blue-500': achievement.type === 'portfolio',
                  'border-t-purple-500': achievement.type === 'award',
                  'border-t-cyan-500': achievement.type === 'research'
                }">
                <!-- 成果标题区 -->
                <div class="pt-6 px-6 pb-4 border-b border-gray-100">
                  <div class="flex justify-between items-center mb-3">
                    <span 
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md',
                        achievement.type === 'portfolio' ? 'bg-blue-100 text-blue-800' : 
                        achievement.type === 'award' ? 'bg-purple-100 text-purple-800' : 
                        'bg-cyan-100 text-cyan-800'
                      ]"
                    >
                      {{ 
                        achievement.type === 'portfolio' ? '作品' : 
                        achievement.type === 'award' ? '获奖' : '科研'
                      }}
                    </span>
                    <span 
                      :class="[
                        'px-3 py-1.5 text-sm font-medium rounded-md',
                        achievement.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ achievement.isVerified ? '已认证' : '待认证' }}
                    </span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 line-clamp-2">{{ achievement.title }}</h3>
                </div>
                
                <!-- 成果内容 -->
                <div class="py-6 px-6 flex-grow flex flex-col">
                  <div class="flex items-start mb-5">
                    <div :class="[
                      'h-10 w-10 mr-3 rounded-full flex items-center justify-center flex-shrink-0',
                      achievement.type === 'portfolio' ? 'bg-blue-100' : 
                      achievement.type === 'award' ? 'bg-purple-100' : 
                      'bg-cyan-100'
                    ]">
                      <svg v-if="achievement.type === 'portfolio'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <svg v-else-if="achievement.type === 'award'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <p class="text-gray-600 text-base line-clamp-3">{{ achievement.description }}</p>
                  </div>
                  
                  <!-- 额外信息 -->
                  <div class="mb-5">
                    <div v-if="achievement.type === 'portfolio'" class="flex items-center mb-2">
                      <span class="text-gray-500 mr-2">团队成员:</span>
                      <span class="text-gray-700">{{ achievement.teamMembers || '未指定' }}</span>
                    </div>
                    <div v-if="achievement.type === 'award'" class="flex items-center mb-2">
                      <span class="text-gray-500 mr-2">颁发单位:</span>
                      <span class="text-gray-700">{{ achievement.organizer || '未指定' }}</span>
                    </div>
                    <div v-if="achievement.type === 'research'" class="flex items-center mb-2">
                      <span class="text-gray-500 mr-2">作者:</span>
                      <span class="text-gray-700">{{ achievement.authors || '未指定' }}</span>
                    </div>
                  </div>
                  
                                      <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div class="text-sm text-gray-500">
                      {{ new Date(achievement.createdAt).toLocaleDateString('zh-CN') }}
                    </div>
                    <button 
                      @click="viewDetail(achievement)" 
                      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
          <!-- 注释掉动态组件方式
          <component
            :is="getCardComponent(achievement.type)"
            v-for="achievement in filteredAchievements"
            :key="achievement.id"
            :achievement="achievement"
            @click="viewDetail(achievement)"
            class="cursor-pointer hover:shadow-md transition-all duration-300 ease-in-out border border-transparent hover:border-gray-200"
          />
          -->
        </template>
      </div>

      <!-- 分页 -->
      <div v-if="achievements.length > 0" class="mt-12 flex justify-center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
      
      <!-- 添加成果模态框 -->
      <AddAchievementModal 
        :show="showAddModal"
        @close="showAddModal = false"
        @submit="handleAddAchievement"
      />
    </div>
  </div>
</template> 