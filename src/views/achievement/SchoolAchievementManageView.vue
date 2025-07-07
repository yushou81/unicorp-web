<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-medium text-gray-900">成果展示</h1>
      <p class="mt-1 text-base text-gray-500">展示所有学生的统计数据与审核认证</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
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


      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
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

      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
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

      
      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
        <div class="absolute top-3 right-3">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <span class="text-sm font-medium text-green-600">已认</span>
          </div>
         </div>
        <div class="pr-12">
          <p class="text-base text-gray-500">已认证获奖</p>
          <p class="mt-1 text-2xl font-semibold">{{ statistics.verifiedCount || 0 }}</p>
          <p class="mt-1 text-sm text-gray-400">认证率 {{ statistics.verifiedRate || 'NaN%' }}</p>
        </div>
      </div>


      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
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

      <div class="bg-white rounded-lg p-4 shadow-sm relative min-w-[200px]">
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
              @click="handleApply" 
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
          <h2 class="text-lg font-medium">未认证获奖列表</h2>
          <div class="text-base text-gray-500">
            共 {{ totalItems }} 条记录
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
                <span 
                  class="inline-flex items-center justify-center px-2.5 py-1 rounded text-sm font-medium min-w-[64px]" 
                  :class="getTypeClass(item.type)"
                >
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
                    @click="viewDetail(item.id)" 
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
            v-model="verifyForm.status" 
            class="w-full text-base rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-11"
          >
            <option :value="AchievementStatus.VERIFIED">通过</option>
            <option :value="AchievementStatus.REJECTED">拒绝</option>
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
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import Pagination from '@/components/ui/Pagination.vue'
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
import { getAllUsers } from '@/lib/api/schoolAdmin'
import { getMe } from '@/lib/api/auth'

// 定义组件
defineComponent({
  name: 'SchoolAchievementManageView',
  components: {
    Pagination
  }
})

const router = useRouter()
const appStore = useAppStore()

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

// 分页相关
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const achievements = ref<Achievement[]>([])
const students = ref<{id: number, name: string}[]>([])
const loading = ref(false)

// 筛选条件
interface Filters {
  type: '' | AchievementType
  verifyStatus: '' | AchievementStatus
  keyword: string
}

const filters = ref<Filters>({
  type: '',
  verifyStatus: '',
  keyword: ''
})

// 审核相关
const showVerifyModal = ref(false)
const currentItem = ref<Achievement | null>(null)

interface VerifyForm {
  status: AchievementStatus
  comment: string
}

const verifyForm = ref<VerifyForm>({
  status: AchievementStatus.VERIFIED,
  comment: ''
})

// 类型和状态样式映射
const typeClasses: Record<AchievementType, string> = {
  [AchievementType.PORTFOLIO]: 'bg-purple-100 text-purple-800',
  [AchievementType.AWARD]: 'bg-yellow-100 text-yellow-800',
  [AchievementType.RESEARCH]: 'bg-indigo-100 text-indigo-800'
}

const statusClasses: Record<AchievementStatus, string> = {
  [AchievementStatus.PENDING]: 'bg-gray-100 text-gray-800',
  [AchievementStatus.VERIFIED]: 'bg-green-100 text-green-800',
  [AchievementStatus.REJECTED]: 'bg-red-100 text-red-800'
}

// 格式化方法
const formatType = (type: AchievementType): string => {
  const typeMap: Record<AchievementType, string> = {
    [AchievementType.PORTFOLIO]: '作品集',
    [AchievementType.AWARD]: '获奖',
    [AchievementType.RESEARCH]: '科研'
  }
  return typeMap[type] || type
}

const formatStatus = (status: AchievementStatus): string => {
  const statusMap: Record<AchievementStatus, string> = {
    [AchievementStatus.PENDING]: '待认证',
    [AchievementStatus.VERIFIED]: '已认证',
    [AchievementStatus.REJECTED]: '已拒绝'
  }
  return statusMap[status] || status
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getTypeClass = (type: AchievementType): string => {
  return typeClasses[type] || ''
}

const getStatusClass = (status: AchievementStatus): string => {
  return statusClasses[status] || ''
}

// 获取学校学生列表
const fetchStudents = async () => {
  if (!appStore.user?.organizationId) {
    console.error('[SchoolAchievementManageView] fetchStudents - 无组织ID:', {
      user: appStore.user,
      organizationId: appStore.user?.organizationId
    })
    return
  }
  
  try {
    console.log('[SchoolAchievementManageView] fetchStudents - 开始获取学生列表, 组织ID:', appStore.user.organizationId)
    // 获取学校的学生列表
    const response = await getAllUsers({
      page: 1,
      size: 1000,
      role: 'student'
    })
    
    if (response.data && response.data.records) {
      students.value = response.data.records.map(user => ({
        id: user.id,
        name: user.nickname || user.username
      }))
      console.log(`[SchoolAchievementManageView] fetchStudents - 获取到${students.value.length}名学生:`, students.value)
    }
  } catch (error) {
    console.error('[SchoolAchievementManageView] fetchStudents - 获取学生列表失败:', error)
  }
}

// 获取统计数据
const fetchStatistics = async () => {
  if (!appStore.user?.organizationId) {
    console.error('[SchoolAchievementManageView] fetchStatistics - 无组织ID:', {
      user: appStore.user,
      organizationId: appStore.user?.organizationId
    })
    return
  }

  try {
    // 学校管理员有权限获取组织统计数据
    const orgStats = await achievementStatisticsApi.getSchoolStatistics()
    console.log('[SchoolAchievementManageView] fetchStatistics - 获取统计数据成功:', orgStats)

    if (orgStats.data) {
      statistics.value = {
        totalAchievements: orgStats.data.totalAchievements,
        verifiedCount: orgStats.data.totalVerifiedAchievements,
        portfolioCount: orgStats.data.totalPortfolios,
        awardCount: orgStats.data.totalAwards,
        researchCount: orgStats.data.totalResearch,
        visitCount: orgStats.data.totalStudents || 0,
        verifiedRate: orgStats.data.totalAwards > 0 
          ? `${Math.round((orgStats.data.totalVerifiedAchievements / orgStats.data.totalAwards) * 100)}%` 
          : 'NaN%'
      }

      console.log('[SchoolAchievementManageView] 统计数据更新:', statistics.value)
    }
  } catch (error) {
    console.error('[SchoolAchievementManageView] fetchStatistics - 获取统计数据失败:', error)
  }
}

// 获取成果列表
const fetchAchievements = async () => {
  if (loading.value) return
  loading.value = true
  
  try {
    // 如果学生列表为空，先获取学生列表
    if (students.value.length === 0) {
      await fetchStudents()
    }
    
    let results: Achievement[] = []
    
    try {
      // 获取学生成果概览
             const overviewResponse = await competitionAwardApi.getUnverifiedAwards(
                    appStore.user?.organizationId || 0,
          currentPage.value,
          10)
      console.log('[SchoolAchievementManageView] 获取到学生成果概览:', overviewResponse)
      
      if (!overviewResponse.data) {
        console.warn('[SchoolAchievementManageView] 响应中没有data字段')
        return
      }
      
      // 修改这里以适配后端返回的数据格式
      const records = overviewResponse.data.records || []
      console.log('[SchoolAchievementManageView] 未认证成果数量:', records.length)
      
      // 如果没有获取到未认证成果，直接使用空数组
      if (records.length === 0) {
        results = []
        console.log('[SchoolAchievementManageView] 没有找到任何未认证成果')
      } else {
        // 将 CompetitionAwardVO 转换为 Achievement
        results = records.map(award => ({
          id: award.id,
          title: award.competitionName,
          type: AchievementType.AWARD,
          studentId: award.userId,
          studentName: award.userName,
          organizationName: award.organizationName,
          description: award.description,
          verifyStatus: award.isVerified ? AchievementStatus.VERIFIED : AchievementStatus.PENDING,
          isPublic: award.isPublic,
          createdAt: award.createdAt,
          updatedAt: award.updatedAt,
          verifierId: award.verifierId,
          verifierName: award.verifierName,
          verifyDate: award.verifyDate
        }))
      }
      
      console.log('[SchoolAchievementManageView] 所有学生成果处理完成, 总成果数:', results.length)
    } catch (error) {
      console.error('[SchoolAchievementManageView] 获取学生成果概览失败:', error)
    }
    
    // 根据筛选条件过滤
    if (filters.value.type) {
      results = results.filter(item => item.type === filters.value.type)
    }

    if (filters.value.verifyStatus) {
      results = results.filter(item => item.verifyStatus === filters.value.verifyStatus)
    }

    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      results = results.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.studentName.toLowerCase().includes(keyword) ||
        (item.description && item.description.toLowerCase().includes(keyword))
      )
    }
    
    // 按创建时间排序，最新的在前面
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // 更新分页信息
    totalItems.value = results.length
    totalPages.value = Math.ceil(totalItems.value / 10)
    achievements.value = results
    
    console.log(`[SchoolAchievementManageView] 获取到${totalItems.value}个成果，当前页显示${achievements.value.length}个`)
    
  } catch (error) {
    console.error('[SchoolAchievementManageView] 获取成果列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 审核相关方法
const openVerifyModal = (item: Achievement) => {
  currentItem.value = item
  verifyForm.value = {
    status: AchievementStatus.VERIFIED,
    comment: ''
  }
  showVerifyModal.value = true
}

const closeVerifyModal = () => {
  showVerifyModal.value = false
  currentItem.value = null
  verifyForm.value = {
    status: AchievementStatus.VERIFIED,
    comment: ''
  }
}

const submitVerify = async () => {
  if (!currentItem.value) return
  
  try {
    const data = {
      isVerified: verifyForm.value.status === AchievementStatus.VERIFIED,
      comment: verifyForm.value.comment
    }

    switch (currentItem.value.type) {
      case AchievementType.AWARD:
        await competitionAwardApi.verifyAward(currentItem.value.id, data)
        break
      case AchievementType.RESEARCH:
        await researchApi.verifyResearch(currentItem.value.id, data)
        break
      // 作品暂无认证接口，因为API权限中没有提供
    }

    closeVerifyModal()
    fetchAchievements()
    fetchStatistics()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchAchievements()
}

const handleReset = () => {
  filters.value = {
    type: '',
    verifyStatus: '',
    keyword: ''
  }
}

const handleApply = () => {
  currentPage.value = 1
  fetchAchievements()
}

const viewDetail = (id: number) => {
  // 根据不同类型的成果跳转到对应的详情页
  const item = achievements.value.find(a => a.id === id)
  if (!item) return

  switch (item.type) {
    case AchievementType.PORTFOLIO:
      router.push(`/achievement/portfolio/${id}`)
      break
    case AchievementType.AWARD:
      router.push(`/achievement/award/${id}`)
      break
    case AchievementType.RESEARCH:
      router.push(`/achievement/research/${id}`)
      break
    default:
      console.error('未知的成果类型:', item.type)
  }
}

onMounted(async () => {
  console.log('[SchoolAchievementManageView] 当前用户信息:', appStore.user)
  console.log('[SchoolAchievementManageView] 组织ID:', appStore.user?.organizationId)
  
  // 获取完整的用户信息
  try {
    const response = await getMe()
    if (response.data) {
      console.log('[SchoolAchievementManageView] 获取到完整用户信息:', response.data)
      appStore.setUser(response.data)
      
      // 重新检查组织ID
      if (!appStore.user?.organizationId) {
        console.warn('[SchoolAchievementManageView] 警告: 获取完整用户信息后仍未获取到组织ID')
        return
      }
      
      // 有组织ID后再获取数据
      await fetchStatistics()
      await fetchAchievements()
    }
  } catch (error) {
    console.error('[SchoolAchievementManageView] 获取用户信息失败:', error)
  }
})
</script>