<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm">
      <!-- 页面标题 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">课程评价管理</h1>
            <p class="text-sm text-gray-600 mt-1">管理课程的评价和反馈</p>
          </div>
          <router-link 
            :to="`/classroom/${courseId}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回课程
          </router-link>
        </div>
      </div>

      <!-- 评价统计 -->
      <div v-if="ratingStatistics" class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-500">{{ ratingStatistics.averageRating.toFixed(1) }}</div>
            <div class="text-sm text-gray-600">平均评分</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ ratingStatistics.totalRatings }}</div>
            <div class="text-sm text-gray-600">总评价数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ getCompletionRate() }}%</div>
            <div class="text-sm text-gray-600">评价完成率</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-500">{{ getRecentRatingCount() }}</div>
            <div class="text-sm text-gray-600">最近评价</div>
          </div>
        </div>
        
        <!-- 评分分布 -->
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">评分分布</h3>
          <div class="grid grid-cols-5 gap-2">
            <div v-for="i in 5" :key="i" class="text-center">
              <div class="text-sm font-medium text-gray-700">{{ 6 - i }}星</div>
              <div class="text-xs text-gray-500">{{ ratingStatistics.ratingDistribution[6 - i] || 0 }}人</div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-yellow-400 h-2 rounded-full" 
                  :style="{ width: getRatingPercentage(6 - i) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选和搜索 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <!-- 导出功能 -->
        <div class="mb-4">
          <CourseRatingExport 
            :ratings="ratings"
            :course-title="courseTitle"
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索评价内容..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="handleSearch"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="ratingFilter"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="handleFilter"
            >
              <option value="">全部评分</option>
              <option value="5">5星</option>
              <option value="4">4星</option>
              <option value="3">3星</option>
              <option value="2">2星</option>
              <option value="1">1星</option>
            </select>
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="handleSort"
            >
              <option value="createdAt">最新评价</option>
              <option value="rating">评分高低</option>
              <option value="studentName">学生姓名</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 评价列表 -->
      <div class="px-6 py-4">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <div v-else-if="filteredRatings.length === 0" class="text-center py-8">
          <div class="text-gray-500">暂无评价数据</div>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="rating in paginatedRatings" 
            :key="rating.id" 
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span class="text-gray-600 font-medium">{{ rating.studentName.substring(0, 1) }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ rating.studentName }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(rating.createdAt) }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
                    'h-5 w-5',
                    i <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                  ]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ rating.rating }}星</span>
              </div>
            </div>
            
            <div class="text-gray-700 mb-3">{{ rating.content }}</div>
            
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                评价ID: {{ rating.id }}
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="viewRatingDetail(rating)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  查看详情
                </button>
                <button
                  v-if="canDeleteRating(rating)"
                  @click="deleteRating(rating.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <nav class="flex space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="px-3 py-2 text-sm text-gray-700">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { 
  CourseRatingVO,
  CourseRatingStatistics,
  getRatingsByCourseId,
  getRatingStatistics,
  deleteRating as deleteCourseRating
} from '@/lib/api/classroom'
import CourseRatingExport from '@/components/classroom/CourseRatingExport.vue'

const route = useRoute()
const appStore = useAppStore()

const courseId = Number(route.params.courseId)
const courseTitle = ref('课程评价管理')
const loading = ref(false)
const ratings = ref<CourseRatingVO[]>([])
const ratingStatistics = ref<CourseRatingStatistics | null>(null)
const searchKeyword = ref('')
const ratingFilter = ref('')
const sortBy = ref('createdAt')
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的评价
const filteredRatings = computed(() => {
  let filtered = [...ratings.value]
  
  // 搜索过滤
  if (searchKeyword.value) {
    filtered = filtered.filter(rating => 
      rating.content.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      rating.studentName.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 评分过滤
  if (ratingFilter.value) {
    filtered = filtered.filter(rating => rating.rating === Number(ratingFilter.value))
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'rating':
        return b.rating - a.rating
      case 'studentName':
        return a.studentName.localeCompare(b.studentName)
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
  
  return filtered
})

// 分页后的评价
const paginatedRatings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRatings.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredRatings.value.length / pageSize.value)
})

// 获取评价数据
const fetchRatings = async () => {
  loading.value = true
  try {
    const response = await getRatingsByCourseId(courseId, 1, 100) // 获取所有评价
    ratings.value = response.data.records
  } catch (err) {
    console.error('获取评价失败:', err)
  } finally {
    loading.value = false
  }
}

// 获取评价统计
const fetchRatingStatistics = async () => {
  try {
    const response = await getRatingStatistics(courseId)
    ratingStatistics.value = response.data
  } catch (err) {
    console.error('获取评价统计失败:', err)
  }
}

// 删除评价
const deleteRating = async (ratingId: number) => {
  if (!confirm('确定要删除这条评价吗？此操作不可恢复。')) return
  
  try {
    await deleteCourseRating(ratingId)
    await fetchRatings()
    await fetchRatingStatistics()
    showToast('评价删除成功')
  } catch (err: any) {
    console.error('删除评价失败:', err)
    showToast(err.message || '删除评价失败')
  }
}

// 查看评价详情
const viewRatingDetail = (rating: CourseRatingVO) => {
  // 可以打开一个模态框显示详细信息
  console.log('查看评价详情:', rating)
}

// 检查是否可以删除评价
const canDeleteRating = (rating: CourseRatingVO) => {
  const currentUser = appStore.user
  if (!currentUser) return false
  
  // 教师和管理员可以删除任何评价
  const userRole = currentUser.role?.toUpperCase()
  return userRole === 'TEACHER' || userRole === 'ADMIN' || userRole === 'SCHOOL_ADMIN'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 过滤处理
const handleFilter = () => {
  currentPage.value = 1
}

// 排序处理
const handleSort = () => {
  currentPage.value = 1
}

// 获取评价完成率
const getCompletionRate = () => {
  if (!ratingStatistics.value) return 0
  // 这里可以根据实际业务逻辑计算完成率
  return Math.round((ratingStatistics.value.totalRatings / 50) * 100) // 假设总学生数为50
}

// 获取最近评价数量
const getRecentRatingCount = () => {
  if (!ratings.value.length) return 0
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return ratings.value.filter(rating => new Date(rating.createdAt) > oneWeekAgo).length
}

// 获取评分百分比
const getRatingPercentage = (rating: number) => {
  if (!ratingStatistics.value || !ratingStatistics.value.totalRatings) return 0
  const count = ratingStatistics.value.ratingDistribution[rating] || 0
  return Math.round((count / ratingStatistics.value.totalRatings) * 100)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 显示提示
const showToast = (message: string) => {
  // 这里可以使用你的toast组件
  console.log(message)
}

// 监听分页变化
watch(currentPage, () => {
  // 可以在这里添加分页逻辑
})

onMounted(() => {
  fetchRatings()
  fetchRatingStatistics()
})
</script> 