<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AddAchievementModal from '@/components/achievement/AddAchievementModal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { achievementStatisticsApi, competitionAwardApi, portfolioApi, researchApi } from '@/lib/api/achievement'
import type { CompetitionAwardVO, PortfolioItemVO, ResearchVO } from '@/lib/api/achievement'

const router = useRouter()
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const showAddModal = ref(false)

interface AchievementItem {
  id: number
  type: 'portfolio' | 'award' | 'research'
  title: string
  description: string
  isVerified: boolean
  createdAt: string
  teamMembers?: string | null
  organizer?: string | null
  authors?: string | null
}

const achievements = ref<AchievementItem[]>([])

// 统计数据
const statistics = ref({
  total: 0,
  verified: 0,
  portfolio: 0,
  awards: 0,
  research: 0,
  views: 0
})

// 筛选条件
const filters = ref({
  type: '',
  status: '',
  keyword: ''
})

// 筛选后的成果列表
const filteredAchievements = computed(() => {
  let result = achievements.value

  if (filters.value.type) {
    result = result.filter(item => item.type === filters.value.type)
  }

  if (filters.value.status) {
    result = result.filter(item => 
      filters.value.status === 'verified' ? item.isVerified : !item.isVerified
    )
  }

  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

// 处理筛选
const handleApply = () => {
  currentPage.value = 1
  fetchAchievements()
}

// 重置筛选
const handleReset = () => {
  filters.value = {
    type: '',
    status: '',
    keyword: ''
  }
  currentPage.value = 1
  fetchAchievements()
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await achievementStatisticsApi.getPersonalOverview()
    if (response.data) {
      statistics.value = {
        total: response.data.portfolioCount + response.data.awardCount + response.data.researchCount,
        verified: response.data.verifiedCount,
        portfolio: response.data.portfolioCount,
        awards: response.data.awardCount,
        research: response.data.researchCount,
        views: response.data.totalViewCount
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取成果列表
const fetchAchievements = async () => {
  try {
    loading.value = true
    const [awardsRes, portfoliosRes, researchRes] = await Promise.all([
      competitionAwardApi.getAwardsByPage({ page: currentPage.value, size: 10 }),
      portfolioApi.getPortfolioItemsByPage(currentPage.value, 10),
      researchApi.getResearchByPage(currentPage.value, 10)
    ])
    
    const allAchievements = [
      ...(awardsRes.data?.records || []).map((item: CompetitionAwardVO) => ({
        id: item.id,
        type: 'award' as const,
        title: item.competitionName,
        description: item.description,
        isVerified: item.isVerified,
        createdAt: item.createdAt,
        organizer: item.organizer
      })),
      ...(portfoliosRes.data?.records || []).map((item: PortfolioItemVO) => ({
        id: item.id,
        type: 'portfolio' as const,
        title: item.title,
        description: item.description,
        isVerified: true,
        createdAt: item.createdAt,
        teamMembers: item.teamMembers
      })),
      ...(researchRes.data?.records || []).map((item: ResearchVO) => ({
        id: item.id,
        type: 'research' as const,
        title: item.title,
        description: item.description,
        isVerified: item.isVerified,
        createdAt: item.createdAt,
        authors: item.authors
      }))
    ]

    achievements.value = allAchievements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // 更新总页数
    const maxPages = Math.max(
      awardsRes.data?.pages || 0,
      portfoliosRes.data?.pages || 0,
      researchRes.data?.pages || 0
    )
    totalPages.value = maxPages
  } catch (error) {
    console.error('获取成果列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewDetail = async (achievement: AchievementItem) => {
  try {
    let detailData
    
    // 根据不同类型调用不同的API获取详情
    switch (achievement.type) {
      case 'award':
        detailData = await competitionAwardApi.getAwardDetail(achievement.id)
        router.push(`/achievement/award/${achievement.id}`)
        break
      case 'portfolio':
        detailData = await portfolioApi.getPortfolioItemDetail(achievement.id)
        router.push(`/achievement/portfolio/${achievement.id}`)
        break
      case 'research':
        detailData = await researchApi.getResearchById(achievement.id)
        router.push(`/achievement/research/${achievement.id}`)
        break
      default:
        console.error('未知的成果类型')
        return
    }

    // 可以通过vuex或其他状态管理存储详情数据，供详情页使用
    console.log('成果详情数据:', detailData)
  } catch (error) {
    console.error('获取成果详情失败:', error)
  }
}

// 添加成果成功回调
const handleAddAchievement = () => {
  showAddModal.value = false
  // 重新获取数据
  fetchStatistics()
  fetchAchievements()
}

onMounted(() => {
  console.log('组件挂载完成')
  console.log('localStorage token:', localStorage.getItem('token'))
  console.log('当前路由:', router.currentRoute.value)
  fetchStatistics()
  fetchAchievements()
})
</script>

<style scoped>
.achievement-container {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style>

<template>
  <div class="achievement-container p-6">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold mb-4">成果展示</h1>
      <p class="text-gray-600 mb-8">展示您的作品集、竞赛获奖和科研成果</p>

      <!-- 统计卡片部分 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">总成果数</h3>
          <p class="text-gray-600 text-sm mb-4">包含所有类型的成果总数</p>
          <div class="flex items-center">
            <span class="text-3xl font-bold text-blue-600">{{ statistics.total }}</span>
            <span class="ml-2 px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm">总览</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">已认证成果</h3>
          <p class="text-gray-600 text-sm mb-4">认证率 {{ ((statistics.verified / statistics.total) * 100).toFixed(1) }}%</p>
          <div class="flex items-center">
            <span class="text-3xl font-bold text-teal-600">{{ statistics.verified }}</span>
            <span class="ml-2 px-2 py-1 bg-teal-50 text-teal-600 rounded text-sm">已认证</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">作品数量</h3>
          <p class="text-gray-600 text-sm mb-4">个人作品和项目展示</p>
          <div class="flex items-center">
            <span class="text-3xl font-bold text-slate-600">{{ statistics.portfolio }}</span>
            <span class="ml-2 px-2 py-1 bg-slate-50 text-slate-600 rounded text-sm">作品</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">获奖数量</h3>
          <p class="text-gray-600 text-sm mb-4">竞赛和荣誉获奖</p>
          <div class="flex items-center">
            <span class="text-3xl font-bold text-amber-600">{{ statistics.awards }}</span>
            <span class="ml-2 px-2 py-1 bg-amber-50 text-amber-600 rounded text-sm">获奖</span>
          </div>
        </div>
      </div>

      <!-- 筛选部分 -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">筛选条件</h3>
          <div class="flex space-x-4">
            <button 
              @click="handleReset"
              class="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              重置
            </button>
            <button 
              @click="handleApply"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              应用筛选
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">成果类型</label>
            <select 
              v-model="filters.type"
              class="w-full border rounded-md px-3 py-2"
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
              class="w-full border rounded-md px-3 py-2"
            >
              <option value="">全部状态</option>
              <option value="verified">已认证</option>
              <option value="pending">待认证</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
            <input 
              v-model="filters.keyword"
              type="text"
              placeholder="搜索成果名称"
              class="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      <!-- 成果列表 -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <div class="flex justify-between items-center">
            <div class="flex space-x-4">
              <span class="text-gray-600">总计: {{ filteredAchievements.length }} 条</span>
            </div>
            <button 
              @click="showAddModal = true"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              添加成果
            </button>
          </div>
        </div>

        <div class="divide-y">
          <div 
            v-for="achievement in filteredAchievements" 
            :key="achievement.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium">{{ achievement.title }}</h3>
                <p class="text-gray-600 mt-1">{{ achievement.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span 
                    :class="{
                      'bg-slate-50 text-slate-600': achievement.type === 'portfolio',
                      'bg-amber-50 text-amber-600': achievement.type === 'award',
                      'bg-blue-50 text-blue-600': achievement.type === 'research'
                    }"
                    class="px-2 py-1 rounded text-sm"
                  >
                    {{ achievement.type === 'portfolio' ? '作品' : 
                       achievement.type === 'award' ? '获奖' : '科研' }}
                  </span>
                  <span 
                    :class="achievement.isVerified ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-600'"
                    class="px-2 py-1 rounded text-sm"
                  >
                    {{ achievement.isVerified ? '已认证' : '待认证' }}
                  </span>
                  <span class="text-gray-500 text-sm">
                    {{ new Date(achievement.createdAt).toLocaleDateString('zh-CN') }}
                  </span>
                </div>
              </div>
              <button 
                @click="viewDetail(achievement)"
                class="px-3 py-1 text-blue-500 hover:text-blue-600"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredAchievements.length > 0" class="mt-8 flex justify-center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 添加成果模态框 -->
      <AddAchievementModal 
        v-if="showAddModal"
        @close="showAddModal = false"
        @success="handleAddAchievement"
      />
    </div>
  </div>
</template> 