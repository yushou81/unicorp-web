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
    // TODO: 调用API获取概览数据
    const response = await fetch('/api/v1/achievement/statistics/overview')
    const data = await response.json()
    overview.value = data.data
  } catch (error) {
    console.error('获取成果概览失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchRecentAchievements = async () => {
  try {
    // TODO: 并行获取各类最新成果
    const [awards, portfolios, research] = await Promise.all([
      fetch('/api/v1/awards?page=1&size=3'),
      fetch('/api/v1/portfolio/items?page=1&size=3'),
      fetch('/api/v1/research/achievements?page=1&size=3')
    ])
    
    recentAwards.value = (await awards.json()).data
    recentPortfolios.value = (await portfolios.json()).data
    recentResearch.value = (await research.json()).data
  } catch (error) {
    console.error('获取最新成果失败:', error)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

const viewDetail = (achievement: any) => {
  router.push(`/achievement/${achievement.id}`)
}

const fetchAchievements = async () => {
  loading.value = true
  try {
    // TODO: 实现获取成果列表的API调用
    // const response = await achievementApi.getList({
    //   page: currentPage.value,
    //   type: filters.value.type,
    //   status: filters.value.status
    // })
    // achievements.value = response.data.records
    // totalPages.value = response.data.pages
  } catch (error) {
    console.error('获取成果列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    // TODO: 实现获取统计数据的API调用
    // const response = await achievementApi.getStatistics()
    // statistics.value = response.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 应用筛选条件
const handleApply = () => {
  fetchAchievements()
}

// 重置筛选条件
const handleReset = () => {
  filters.value.type = ''
  filters.value.status = ''
  filters.value.keyword = ''
  fetchAchievements()
}

onMounted(() => {
  fetchOverview()
  fetchRecentAchievements()
  fetchAchievements()
  fetchStatistics()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">成果展示</h1>
      <p class="mt-2 text-gray-600">展示您的作品集、竞赛获奖和科研成果</p>
    </div>

    <!-- 统计数据 -->
    <div class="mb-8">
      <AchievementStats
        :total-achievements="statistics.total"
        :verified-achievements="statistics.verified"
        :portfolio-count="statistics.portfolio"
        :award-count="statistics.awards"
        :research-count="statistics.research"
        :total-views="statistics.views"
      />
    </div>

    <!-- 筛选和排序 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">成果类型</label>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">认证状态</label>
          <select 
            v-model="filters.status" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="verified">已认证</option>
            <option value="pending">待认证</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
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
      <div class="flex justify-end mt-4">
        <button @click="handleReset" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50">重置</button>
        <button @click="handleApply" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">筛选</button>
      </div>
    </div>

    <!-- 添加成果按钮 -->
    <div class="mb-6 flex justify-end">
      <button
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        @click="showAddModal = true"
      >
        添加成果
      </button>
    </div>

    <!-- 成果列表 -->
    <div class="grid grid-cols-1 gap-6">
      <template v-if="loading">
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
      </template>
      <template v-else-if="achievements.length === 0">
        <div class="text-center py-8">
          <p class="text-gray-600">暂无成果记录</p>
        </div>
      </template>
      <template v-else>
        <component
          :is="getCardComponent(achievement.type)"
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          :achievement="achievement"
          @click="viewDetail(achievement)"
        />
      </template>
    </div>

    <!-- 分页 -->
    <div v-if="achievements.length > 0" class="mt-6 flex justify-center">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template> 