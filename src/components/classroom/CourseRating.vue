<template>
  <div>
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
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          提交评价
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
          </div>
        </div>
        <p class="text-gray-600">{{ rating.content }}</p>
      </div>
    </div>
    <div v-else class="text-gray-500 italic">暂无评价</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-ignore
import { useToast } from 'vue-toastification'
import { CourseRatingVO, CourseRatingDTO, submitRating as submitCourseRating } from '@/lib/api/classroom'

const props = defineProps<{
  courseId: number
  ratings: CourseRatingVO[]
  canRate: boolean
  hasRated: boolean
}>()

const emit = defineEmits<{
  (e: 'submit-success'): void
  (e: 'error', message: string): void
}>()

const toast = useToast()
const showRatingForm = ref(false)

// 评价数据
const ratingData = ref<CourseRatingDTO>({
  courseId: props.courseId,
  rating: 5,
  content: ''
})

// 提交评价
const submitRating = async () => {
  if (!ratingData.value.content.trim()) {
    toast.error('请输入评价内容')
    return
  }
  
  try {
    await submitCourseRating(ratingData.value)
    toast.success('评价提交成功')
    showRatingForm.value = false
    emit('submit-success')
  } catch (err) {
    console.error('提交评价失败:', err)
    emit('error', err instanceof Error ? err.message : '提交评价失败')
  }
}

// 取消评价
const cancelRating = () => {
  showRatingForm.value = false
  ratingData.value.rating = 5
  ratingData.value.content = ''
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script> 