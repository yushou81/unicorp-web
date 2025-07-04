<template>
  <div>
    <!-- 评价统计 -->
    <div v-if="ratingStatistics" class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">课程评价统计</h3>
        <div class="flex items-center">
          <span class="text-2xl font-bold text-yellow-500">{{ ratingStatistics.averageRating.toFixed(1) }}</span>
          <div class="flex ml-2">
            <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
              'h-5 w-5',
              i <= Math.round(ratingStatistics.averageRating) ? 'text-yellow-400' : 'text-gray-300'
            ]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-sm text-gray-600 ml-2">({{ ratingStatistics.totalRatings }}条评价)</span>
        </div>
      </div>
      
      <!-- 评分分布 -->
      <div class="grid grid-cols-5 gap-2">
        <div v-for="i in 5" :key="i" class="text-center">
          <div class="text-sm font-medium text-gray-700">{{ 6 - i }}星</div>
          <div class="text-xs text-gray-500">{{ ratingStatistics.ratingDistribution[6 - i] || 0 }}人</div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">课程评价</h2>
      <button 
        v-if="canRate" 
        @click="showRatingForm = true"
        class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        写评价
      </button>
    </div>
    
    <!-- 评价表单 -->
    <div v-if="showRatingForm" class="border border-gray-200 rounded-lg p-4 mb-4">
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">评分</label>
        <div class="flex">
          <button 
            v-for="i in 5" 
            :key="i" 
            @click="ratingData.rating = i"
            class="focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" :class="[
              'h-6 w-6',
              i <= ratingData.rating ? 'text-yellow-400' : 'text-gray-300'
            ]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">评价内容</label>
        <textarea 
          v-model="ratingData.content" 
          rows="3" 
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入您的评价内容..."
        ></textarea>
      </div>
      <div class="flex justify-end space-x-2">
        <button 
          @click="cancelRating" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button 
          @click="submitRating" 
          :disabled="submitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="submitting">提交中...</span>
          <span v-else>{{ isEditing ? '更新评价' : '提交评价' }}</span>
        </button>
      </div>
    </div>
    
    <!-- 评价列表 -->
    <div v-if="ratings && ratings.length > 0" class="space-y-4">
      <div v-for="rating in ratings" :key="rating.id" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-600">
              {{ rating.studentName.substring(0, 1) }}
            </div>
            <span class="font-medium text-gray-900">{{ rating.studentName }}</span>
          </div>
          <div class="flex items-center">
            <div class="flex">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
                'h-4 w-4',
                i <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
              ]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm text-gray-500 ml-2">{{ formatDate(rating.createdAt) }}</span>
            
            <!-- 操作按钮 -->
            <div v-if="canEditRating(rating)" class="ml-4 flex space-x-2">
              <button 
                @click="editRating(rating)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                编辑
              </button>
              <button 
                @click="deleteRating(rating.id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>
        <p class="text-gray-600">{{ rating.content }}</p>
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-6">
        <nav class="flex space-x-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>
    <div v-else class="text-gray-500 italic">暂无评价</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { 
  CourseRatingVO, 
  CourseRatingDTO, 
  CourseRatingStatistics,
  submitRating as submitCourseRating,
  updateRating as updateCourseRating,
  deleteRating as deleteCourseRating,
  getRatingsByCourseId,
  getRatingStatistics,
  getStudentRating
} from '@/lib/api/classroom'

const props = defineProps<{
  courseId: number
  ratings: CourseRatingVO[]
  canRate: boolean
  hasRated: boolean
}>()

const emit = defineEmits<{
  (e: 'submit-success'): void
  (e: 'error', message: string): void
  (e: 'update-ratings', ratings: CourseRatingVO[]): void
}>()

const appStore = useAppStore()
const showRatingForm = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const editingRatingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const ratingStatistics = ref<CourseRatingStatistics | null>(null)

// 评价数据
const ratingData = ref<CourseRatingDTO>({
  courseId: props.courseId,
  rating: 5,
  content: ''
})

// 获取评价统计
const fetchRatingStatistics = async () => {
  try {
    const response = await getRatingStatistics(props.courseId)
    ratingStatistics.value = response.data
  } catch (err) {
    console.error('获取评价统计失败:', err)
  }
}

// 提交评价
const submitRating = async () => {
  if (!ratingData.value.content.trim()) {
    emit('error', '请输入评价内容')
    return
  }
  
  submitting.value = true
  try {
    if (isEditing.value && editingRatingId.value) {
      await updateCourseRating(editingRatingId.value, ratingData.value)
      emit('error', '评价更新成功')
    } else {
      await submitCourseRating(ratingData.value)
      emit('error', '评价提交成功')
    }
    
    showRatingForm.value = false
    resetRatingForm()
    emit('submit-success')
    await fetchRatingStatistics()
  } catch (err: any) {
    console.error('提交评价失败:', err)
    emit('error', err.message || '提交评价失败')
  } finally {
    submitting.value = false
  }
}

// 编辑评价
const editRating = (rating: CourseRatingVO) => {
  isEditing.value = true
  editingRatingId.value = rating.id
  ratingData.value = {
    courseId: rating.courseId,
    rating: rating.rating,
    content: rating.content
  }
  showRatingForm.value = true
}

// 删除评价
const deleteRating = async (ratingId: number) => {
  if (!confirm('确定要删除这条评价吗？')) return
  
  try {
    await deleteCourseRating(ratingId)
    emit('error', '评价删除成功')
    emit('submit-success')
    await fetchRatingStatistics()
  } catch (err: any) {
    console.error('删除评价失败:', err)
    emit('error', err.message || '删除评价失败')
  }
}

// 取消评价
const cancelRating = () => {
  showRatingForm.value = false
  resetRatingForm()
}

// 重置评价表单
const resetRatingForm = () => {
  isEditing.value = false
  editingRatingId.value = null
  ratingData.value = {
    courseId: props.courseId,
    rating: 5,
    content: ''
  }
}

// 检查是否可以编辑评价
const canEditRating = (rating: CourseRatingVO) => {
  const currentUser = appStore.user
  if (!currentUser) return false
  
  // 评价作者可以编辑
  if (rating.studentId === currentUser.id) return true
  
  // 教师和管理员可以编辑
  const userRole = currentUser.role?.toUpperCase()
  return userRole === 'TEACHER' || userRole === 'ADMIN' || userRole === 'SCHOOL_ADMIN'
}

// 切换页面
const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  
  currentPage.value = page
  try {
    const response = await getRatingsByCourseId(props.courseId, page, pageSize.value)
    emit('update-ratings', response.data.records)
    totalPages.value = response.data.pages
  } catch (err) {
    console.error('获取评价列表失败:', err)
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(() => {
  fetchRatingStatistics()
})
</script> 