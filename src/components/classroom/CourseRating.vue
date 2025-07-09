<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <!-- 标题区 -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center">
        <div class="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded mr-3"></div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-wide">课程评价</h2>
      </div>
      <div v-if="canRate">
        <button @click="showRatingForm = true" class="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 font-semibold transition-all duration-200">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          写评价
        </button>
      </div>
    </div>
    <!-- 评价表单 -->
    <div v-if="showRatingForm" class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
      <div class="mb-6">
        <label class="block text-lg font-semibold text-gray-800 mb-3">评分</label>
        <div class="flex space-x-2">
          <button v-for="i in 5" :key="i" @click="ratingData.rating = i" class="focus:outline-none transform hover:scale-110 transition-transform duration-200">
            <svg :class="['h-10 w-10', i <= ratingData.rating ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300 hover:text-yellow-300']" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
        <div class="mt-2 text-sm text-gray-600">{{ ratingData.rating === 0 ? '请选择评分' : `${ratingData.rating}星评价` }}</div>
      </div>
      <div class="mb-6">
        <label class="block text-lg font-semibold text-gray-800 mb-3">评价内容</label>
        <textarea v-model="ratingData.comment" rows="4" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200" placeholder="请分享您对这门课程的看法和建议..."></textarea>
      </div>
      <div class="flex justify-end space-x-3">
        <button @click="cancelRating" class="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">取消</button>
        <button @click="submitRating" :disabled="submitting || ratingData.rating === 0" class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 font-medium shadow-lg">
          <span v-if="submitting" class="flex items-center"><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>提交中...</span>
          <span v-else>{{ isEditing ? '更新评价' : '提交评价' }}</span>
        </button>
      </div>
    </div>
    <!-- 评价列表 -->
    <div v-if="ratings && ratings.length > 0" class="space-y-6">
      <div v-for="rating in ratings" :key="rating.id" class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4 text-white font-bold text-xl shadow-lg">{{ rating.studentName.substring(0, 1) }}</div>
            <div>
              <span class="font-semibold text-gray-900 text-lg">{{ rating.studentName }}</span>
              <div class="flex items-center mt-1">
                <div class="flex mr-3">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6', i <= rating.rating ? 'text-yellow-400' : 'text-gray-300']" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                <span class="text-sm text-gray-500">{{ formatDate(rating.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div v-if="canEditRating(rating)" class="flex space-x-2">
            <button @click="editRating(rating)" class="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"><svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>编辑</button>
            <button @click="deleteRating(rating.id)" class="inline-flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"><svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>删除</button>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ rating.comment }}</p>
        </div>
      </div>
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">上一页</button>
          <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-md">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">下一页</button>
        </nav>
      </div>
    </div>
    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无评价</h3>
      <p class="text-gray-500">成为第一个评价这门课程的人吧！</p>
    </div>
  </div>
  
  <!-- 评价详情模态框 -->
  <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">评价详情</h3>
        <button @click="closeRatingDetail" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="selectedRating" class="space-y-4">
        <!-- 评价者信息 -->
        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {{ selectedRating.studentName.substring(0, 1) }}
          </div>
          <div>
            <div class="font-semibold text-gray-900">{{ selectedRating.studentName }}</div>
            <div class="text-sm text-gray-500">学生</div>
          </div>
        </div>
        
        <!-- 评分展示 -->
        <div class="flex items-center space-x-2">
          <span class="text-lg font-semibold text-gray-900">评分：</span>
          <div class="flex">
            <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
              'h-6 w-6',
              i <= selectedRating.rating ? 'text-yellow-400' : 'text-gray-300'
            ]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-lg font-bold text-yellow-500 ml-2">{{ selectedRating.rating }}.0</span>
        </div>
        
        <!-- 评价内容 -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">评价内容：</h4>
          <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedRating.comment }}</p>
          </div>
        </div>
        
        <!-- 时间信息 -->
        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span class="font-medium">创建时间：</span>
            <span>{{ formatDetailDate(selectedRating.createdAt) }}</span>
          </div>
          <div v-if="selectedRating.updatedAt !== selectedRating.createdAt">
            <span class="font-medium">更新时间：</span>
            <span>{{ formatDetailDate(selectedRating.updatedAt) }}</span>
          </div>
        </div>
        
        <!-- 课程信息 -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <h4 class="font-semibold text-gray-900 mb-2">课程信息：</h4>
          <p class="text-gray-700">{{ selectedRating.courseTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { 
  CourseRatingVO, 
  CourseRatingDTO, 
  submitRating as submitCourseRating,
  updateRating as updateCourseRating,
  deleteRating as deleteCourseRating,
  getRatingsByCourseId,
  getStudentRating,
  getRatingById
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
  (e: 'success', message: string): void
}>()

const appStore = useAppStore()
const showRatingForm = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const editingRatingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

// 评价详情相关
const showDetailModal = ref(false)
const selectedRating = ref<CourseRatingVO | null>(null)

// 评价数据
const ratingData = ref<CourseRatingDTO>({
  courseId: props.courseId,
  rating: 5,
  comment: ''
})

// 提交评价
const submitRating = async () => {
  if (!ratingData.value.comment.trim()) {
    emit('error', '请输入评价内容')
    return
  }
  
  submitting.value = true
  try {
    if (isEditing.value && editingRatingId.value) {
      await updateCourseRating(editingRatingId.value, ratingData.value)
      emit('success', '评价更新成功')
    } else {
      await submitCourseRating(ratingData.value)
      emit('success', '评价提交成功')
    }
    
    showRatingForm.value = false
    resetRatingForm()
    emit('submit-success')
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
    comment: rating.comment
  }
  showRatingForm.value = true
}

// 删除评价
const deleteRating = async (ratingId: number) => {
  if (!confirm('确定要删除这条评价吗？')) return
  
  try {
    await deleteCourseRating(ratingId)
    emit('success', '评价删除成功')
    emit('submit-success')
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
    comment: ''
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

// 格式化详细日期
const formatDetailDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 显示评价详情
const showRatingDetail = async (rating: CourseRatingVO) => {
  try {
    // 获取最新的评价详情
    const response = await getRatingById(rating.id)
    selectedRating.value = response.data
    showDetailModal.value = true
  } catch (err) {
    console.error('获取评价详情失败:', err)
    // 如果获取详情失败，使用当前数据
    selectedRating.value = rating
    showDetailModal.value = true
  }
}

// 关闭评价详情
const closeRatingDetail = () => {
  showDetailModal.value = false
  selectedRating.value = null
}

onMounted(() => {
  // Component mounted
})
</script> 