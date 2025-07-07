<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">成果管理</h1>
      <div class="flex space-x-4">
        <Button @click="refreshData" variant="outline" :loading="loading">
          刷新数据
        </Button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">总成果数</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ filteredStats.totalAchievements }}</p>
          </div>
          <DocumentTextIcon class="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">已认证成果</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ filteredStats.verifiedAchievements }}</p>
          </div>
          <CheckBadgeIcon class="w-6 h-6 text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">待认证成果</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ filteredStats.pendingAchievements }}</p>
          </div>
          <ClockIcon class="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">总浏览量</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">{{ filteredStats.totalViews }}</p>
          </div>
          <ChartBarIcon class="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="bg-white rounded-xl shadow-sm">
      <!-- 内容区域 -->
      <div class="p-6">
        <!-- 筛选和搜索 -->
        <div class="flex justify-between mb-6">
          <div class="flex space-x-4">
            <!-- 组织选择 -->
            <select
              v-model="filters.organizationId"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部组织</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">
                {{ org.name }}
              </option>
            </select>
            
            <!-- 学生选择 -->
            <select
              v-model="filters.studentId"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部学生</option>
              <option v-for="student in filteredStudents" :key="student.id" :value="student.id">
                {{ student.name }}
              </option>
            </select>
            
            <select
              v-model="filters.type"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="award">竞赛获奖</option>
              <option value="research">科研成果</option>
              <option value="portfolio">作品集</option>
            </select>
            <select
              v-model="filters.status"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              <option value="verified">已认证</option>
              <option value="pending">待认证</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div class="flex space-x-4">
            <SearchInput v-model="searchQuery" placeholder="搜索成果..." />
            <Button @click="handleApply" variant="primary" size="sm">
              应用筛选
            </Button>
            <Button @click="handleReset" variant="outline" size="sm">
              重置
            </Button>
          </div>
        </div>

        <!-- 成果列表 -->
        <div class="space-y-4">
          <div v-if="loading" class="text-center py-12">
            <Loading />
          </div>
          <template v-else>
            <div v-if="filteredAchievements.length === 0" class="text-center py-12 text-gray-500">
              暂无数据
            </div>
            <div
              v-else
              v-for="achievement in filteredAchievements"
              :key="achievement.id"
              class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ achievement.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ achievement.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': achievement.verifyStatus === 'verified',
                        'bg-yellow-100 text-yellow-800': achievement.verifyStatus === 'pending',
                        'bg-red-100 text-red-800': achievement.verifyStatus === 'rejected'
                      }"
                    >
                      {{ achievement.verifyStatus === 'verified' ? '已认证' : achievement.verifyStatus === 'pending' ? '待认证' : '已拒绝' }}
                    </span>
                    <span class="text-sm text-gray-500">{{ achievement.type === 'award' ? '竞赛获奖' : achievement.type === 'research' ? '科研成果' : '作品集' }}</span>
                    <span class="text-sm text-gray-500">{{ achievement.createdAt }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <Button
                    v-if="achievement.verifyStatus === 'pending'"
                    @click="verifyAchievement(achievement.id, true)"
                    variant="success"
                    size="sm"
                  >
                    通过
                  </Button>
                  <Button
                    v-if="achievement.verifyStatus === 'pending'"
                    @click="verifyAchievement(achievement.id, false)"
                    variant="danger"
                    size="sm"
                  >
                    拒绝
                  </Button>
                  <Button
                    @click="viewDetails(achievement)"
                    variant="outline"
                    size="sm"
                  >
                    查看
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 分页 -->
        <div class="mt-8 flex justify-center">
          <Pagination
            :current-page="currentPage"
            :total-pages="Math.ceil(totalItems / pageSize)"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailsDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">成果详情</h3>
            <button
              @click="showDetailsDialog = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">标题</label>
              <p class="mt-1">{{ selectedAchievement?.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">描述</label>
              <p class="mt-1">{{ selectedAchievement?.description }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">类型</label>
              <p class="mt-1">{{ selectedAchievement?.type === 'award' ? '竞赛获奖' : selectedAchievement?.type === 'research' ? '科研成果' : '作品集' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">创建时间</label>
              <p class="mt-1">{{ selectedAchievement?.createdAt }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">状态</label>
              <p class="mt-1">{{ selectedAchievement?.verifyStatus === 'verified' ? '已认证' : selectedAchievement?.verifyStatus === 'pending' ? '待认证' : '已拒绝' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  type AchievementStatus,
  type AchievementType,
  type CompetitionAwardVO,
  type PortfolioItemVO,
  type ResearchVO,
  competitionAwardApi,
  portfolioApi,
  researchApi,
  achievementStatisticsApi
} from '@/lib/api/achievement'
import Button from '@/components/ui/Button.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Loading from '@/components/ui/Loading.vue'
import {
  DocumentTextIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { apiRequest } from '@/lib/api/apiClient'
import { getAllSchools, getAllEnterprises } from '@/lib/api/organization'

// 自定义Achievement接口
interface Achievement {
  id: number;
  type: AchievementType;
  title: string;
  description: string;
  verifyStatus: AchievementStatus;
  createdAt: string;
  studentId?: number;
  studentName?: string;
  organizationId?: number;
  organizationName?: string;
  viewCount?: number;
  likeCount?: number;
}

// 使用achievementStatisticsApi获取统计概览
const getStatisticsOverview = async () => {
  // 获取所有组织的统计数据
  if (filters.value.organizationId) {
    // 如果选择了特定组织，获取该组织的统计数据
    return achievementStatisticsApi.getOrganizationStatistics(parseInt(filters.value.organizationId))
  } else if (filters.value.studentId) {
    // 如果选择了特定学生，获取该学生的统计数据
    return achievementStatisticsApi.getStudentOverview(parseInt(filters.value.studentId))
  } else {
    // 否则获取访问统计数据（系统总览）
    return achievementStatisticsApi.getViewsStatistics()
  }
}

// 获取待认证的获奖列表
const getUnverifiedAwards = () => {
  return apiRequest<any>('/v1/awards/unverified')
}

// 获取待认证的科研成果列表
const getUnverifiedResearch = () => {
  return apiRequest<any>('/v1/research/unverified')
}

// 获取公开的获奖列表
const getPublicAwards = (page: number, size: number) => {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('size', size.toString())
  return apiRequest<any>(`/v1/awards/public?${queryParams.toString()}`)
}

// 获取公开的科研成果列表
const getPublicResearch = (page: number, size: number) => {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('size', size.toString())
  return apiRequest<any>(`/v1/research/public?${queryParams.toString()}`)
}

// 获取公开的作品列表
const getPublicPortfolioItems = (page: number, size: number) => {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('size', size.toString())
  return apiRequest<any>(`/v1/portfolio/public/items?${queryParams.toString()}`)
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const searchQuery = ref('')
const showDetailsDialog = ref(false)
const selectedAchievement = ref<Achievement | null>(null)
const achievements = ref<Achievement[]>([])

// 统计数据
const stats = ref({
  totalAchievements: 0,
  verifiedAchievements: 0,
  pendingAchievements: 0,
  totalViews: 0
})

// 根据筛选条件计算统计数据
const filteredStats = computed(() => {
  // 如果没有筛选条件或数据，直接返回原始统计数据
  if (!achievements.value.length) {
    return stats.value
  }

  // 根据筛选条件过滤成果
  const filtered = achievements.value.filter(achievement => {
    if (filters.value.type && achievement.type !== filters.value.type) return false
    if (filters.value.status && achievement.verifyStatus !== filters.value.status) return false
    
    // 使用organizationId进行筛选
    if (filters.value.organizationId && 
        achievement.organizationId !== parseInt(filters.value.organizationId)) return false
    
    if (filters.value.studentId && 
        achievement.studentId !== parseInt(filters.value.studentId)) return false
    
    return true
  })

  // 计算过滤后的统计数据
  const verifiedCount = filtered.filter(a => a.verifyStatus === 'verified').length
  const pendingCount = filtered.filter(a => a.verifyStatus === 'pending').length
  
  // 计算浏览量总和
  const totalViewsCount = filtered.reduce((sum, a) => sum + (a.viewCount || 0), 0)

  return {
    totalAchievements: filtered.length,
    verifiedAchievements: verifiedCount,
    pendingAchievements: pendingCount,
    totalViews: totalViewsCount
  }
})

// 筛选条件
const filters = ref({
  type: '' as AchievementType | '',
  status: '' as AchievementStatus | '',
  organizationId: '',
  studentId: ''
})

// 组织和学生数据
const organizations = ref<Array<{ id: number; name: string }>>([])
const students = ref<Array<{ id: number; name: string; organizationId: number }>>([])

// 根据选择的组织过滤学生列表
const filteredStudents = computed(() => {
  if (!filters.value.organizationId) {
    return students.value
  }
  return students.value.filter(student => 
    student.organizationId === parseInt(filters.value.organizationId as string)
  )
})

// 获取组织和学生数据
const fetchOrganizationsAndStudents = async () => {
  try {
    // 获取组织列表 - 同时获取学校和企业
    const schoolsResponse = await getAllSchools()
    const enterprisesResponse = await getAllEnterprises()
    
    const schools = schoolsResponse.data || []
    const enterprises = enterprisesResponse.data || []
    
    // 合并学校和企业数据
    organizations.value = [
      ...schools.map((org: any) => ({
        id: org.id,
        name: org.name + ' (学校)'
      })),
      ...enterprises.map((org: any) => ({
        id: org.id,
        name: org.name + ' (企业)'
      }))
    ]

    // 获取学生列表
    const studentsResponse = await apiRequest<any>('/v1/users/students')
    if (studentsResponse.data) {
      students.value = studentsResponse.data.map((student: any) => ({
        id: student.id,
        name: student.nickname || student.username,
        organizationId: student.organizationId
      }))
    }
  } catch (error) {
    console.error('获取组织和学生数据失败:', error)
  }
}

// 获取成果列表
const fetchAchievements = async () => {
  loading.value = true
  try {
    console.log('开始获取成果统计数据...')
    // 获取统计数据
    try {
      const statsResponse = await getStatisticsOverview()
      console.log('统计数据响应:', statsResponse) // 添加日志以便调试
      
      // 根据apiClient.ts中的实现，检查code值可能是0或200
      if ((statsResponse.code === 0 || statsResponse.code === 200) && statsResponse.data) {
        // 根据不同的API响应结构处理数据
        if (filters.value.studentId) {
          // 学生统计数据结构
          stats.value = {
            totalAchievements: statsResponse.data.totalAchievements || 0,
            verifiedAchievements: statsResponse.data.verifiedAchievements || 0,
            pendingAchievements: statsResponse.data.pendingAchievements || 0,
            totalViews: statsResponse.data.totalViews || 0
          }
        } else if (filters.value.organizationId) {
          // 组织统计数据结构
          stats.value = {
            totalAchievements: statsResponse.data.totalAchievements || 0,
            verifiedAchievements: statsResponse.data.verifiedAchievements || 0,
            pendingAchievements: statsResponse.data.pendingAchievements || 0,
            totalViews: statsResponse.data.totalViews || 0
          }
        } else {
          // 系统总览数据结构
        stats.value = {
          totalAchievements: statsResponse.data.totalAchievements || 0,
          verifiedAchievements: statsResponse.data.verifiedAchievements || 0,
            pendingAchievements: statsResponse.data.totalAchievements - statsResponse.data.verifiedAchievements || 0,
          totalViews: statsResponse.data.totalViews || 0
          }
        }
        console.log('统计数据已更新:', stats.value) // 添加日志以便调试
      } else {
        console.error('获取统计数据失败:', statsResponse)
      }
    } catch (statsError) {
      console.error('获取统计数据异常:', statsError)
    }

    console.log('开始获取成果列表数据...')
    
    // 获取所有类型的成果，不再根据标签页判断
    try {
      let allAchievements: Achievement[] = []
      
        // 获取所有类型的成果
        console.log('获取所有类型的成果...')
        const [awardsRes, portfoliosRes, researchRes] = await Promise.all([
          getPublicAwards(currentPage.value, pageSize.value),
          getPublicPortfolioItems(currentPage.value, pageSize.value),
          getPublicResearch(currentPage.value, pageSize.value)
        ])
        
        console.log('公开获奖数据:', awardsRes)
        console.log('公开作品集数据:', portfoliosRes)
        console.log('公开科研成果数据:', researchRes)
        
        // 处理获奖
        if (awardsRes.code === 200 && awardsRes.data) {
          const awards = awardsRes.data.records || []
          allAchievements = [
            ...allAchievements,
            ...awards.map((item: CompetitionAwardVO) => ({
              id: item.id,
              type: 'award' as const,
              title: item.competitionName,
              description: item.description,
              verifyStatus: item.isVerified ? 'verified' as AchievementStatus : 'pending' as AchievementStatus,
              createdAt: item.createdAt,
            organizationId: item.organizationId || 0,
            organizationName: item.organizer,
              studentName: item.userName,
            studentId: item.userId,
            viewCount: item.viewCount || 0
            }))
          ]
        }
        
        // 处理作品集
        if (portfoliosRes.code === 200 && portfoliosRes.data) {
          const portfolios = portfoliosRes.data.records || []
          allAchievements = [
            ...allAchievements,
            ...portfolios.map((item: PortfolioItemVO) => ({
              id: item.id,
              type: 'portfolio' as const,
              title: item.title,
              description: item.description,
              verifyStatus: 'verified' as AchievementStatus, // 公开的作品集默认为已认证
              createdAt: item.createdAt,
            organizationId: item.organizationId || 0,
            organizationName: item.organizationName,
              teamMembers: item.teamMembers,
              studentName: item.userName,
            studentId: item.userId,
            viewCount: item.viewCount || 0
            }))
          ]
        }
        
        // 处理科研成果
        if (researchRes.code === 200 && researchRes.data) {
          const research = researchRes.data.records || []
          allAchievements = [
            ...allAchievements,
            ...research.map((item: ResearchVO) => ({
              id: item.id,
              type: 'research' as const,
              title: item.title,
              description: item.description,
              verifyStatus: item.isVerified ? 'verified' as AchievementStatus : 'pending' as AchievementStatus,
              createdAt: item.createdAt,
            organizationId: item.organizationId || 0,
            organizationName: item.publisher,
              authors: item.authors,
              studentName: item.userName,
            studentId: item.userId,
            viewCount: item.viewCount || 0
            }))
          ]
      }

      // 根据筛选条件过滤
      const filteredResults = allAchievements.filter(achievement => {
        if (filters.value.type && achievement.type !== filters.value.type) return false
        if (filters.value.status && achievement.verifyStatus !== filters.value.status) return false
        if (filters.value.organizationId && achievement.organizationId !== parseInt(filters.value.organizationId)) return false
        if (filters.value.studentId && achievement.studentId !== parseInt(filters.value.studentId)) return false
        if (searchQuery.value && !achievement.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
        return true
      })

      // 更新总数和分页数据
      totalItems.value = filteredResults.length
      achievements.value = filteredResults.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      console.log('成果列表数据已更新，总数:', totalItems.value)
    } catch (listError) {
      console.error('获取成果列表数据失败:', listError)
    }
  } catch (error) {
    console.error('获取成果列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 审核成果
const verifyAchievement = async (id: number, isVerified: boolean) => {
  const achievement = achievements.value.find(a => a.id === id);
  if (!achievement) return;
  
  try {
    const data = { isVerified, comment: '' };
    
    switch (achievement.type) {
      case 'award':
        await competitionAwardApi.verifyAward(id, data);
        break;
      case 'portfolio':
        // 系统管理员应该有权限认证所有类型的成果
        // 但是API中没有提供verifyPortfolioItem方法，这里需要后端支持
        console.warn('Portfolio verification API not available');
        break;
      case 'research':
        await researchApi.verifyResearch(id, data);
        break;
    }
    
    // 刷新数据
    await fetchAchievements();
  } catch (error) {
    console.error('审核失败:', error);
  }
}

// 查看详情
const viewDetails = (achievement: Achievement) => {
  selectedAchievement.value = achievement;
  showDetailsDialog.value = true;
}

// 刷新数据
const refreshData = () => {
  currentPage.value = 1
  fetchAchievements()
}

// 使用标准API调用获取数据

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

// 计算过滤后的成果列表
const filteredAchievements = computed(() => {
  return achievements.value
})

// 重置筛选
const handleReset = () => {
  filters.value = {
    type: '',
    status: '',
    organizationId: '',
    studentId: ''
  }
  currentPage.value = 1
  fetchAchievements()
}

// 应用筛选
const handleApply = () => {
  currentPage.value = 1
  fetchAchievements()
}

// 初始化
onMounted(() => {
  fetchAchievements()
  fetchOrganizationsAndStudents()
})
</script>