<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-gray-900">我的学习进度</h3>
      <div class="flex space-x-2">
        <button 
          @click="refreshData"
          :disabled="loading"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '加载中...' : '刷新' }}
        </button>
      </div>
    </div>

    <!-- 课程整体进度 -->
    <div class="mb-8">
      <h4 class="text-md font-medium text-gray-800 mb-4">课程整体进度</h4>
      <div v-if="courseProgressLoading" class="py-4 flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="courseProgress.length > 0" class="bg-blue-50 p-6 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">
              {{ completedChapters }}
            </div>
            <div class="text-sm text-gray-600 mt-1">已完成章节</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">
              {{ totalChapters }}
            </div>
            <div class="text-sm text-gray-600 mt-1">总章节数</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">
              {{ overallProgress }}%
            </div>
            <div class="text-sm text-gray-600 mt-1">完成率</div>
          </div>
        </div>
        
        <!-- 整体进度条 -->
        <div class="mt-6">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">课程完成进度</span>
            <span class="text-sm font-medium text-gray-700">{{ overallProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 章节详细进度 -->
    <div class="mb-8">
      <h4 class="text-md font-medium text-gray-800 mb-4">章节详细进度</h4>
      <div v-if="courseProgressLoading" class="py-4 flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="courseProgress.length > 0" class="space-y-4">
        <div 
          v-for="progress in courseProgress" 
          :key="progress.chapterId"
          class="bg-gray-50 p-4 rounded-lg border-l-4"
          :class="{
            'border-green-500': progress.status === 'completed',
            'border-yellow-500': progress.status === 'in_progress',
            'border-gray-300': progress.status === 'not_started'
          }"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h5 class="font-medium text-gray-900">{{ progress.chapterTitle }}</h5>
              <p class="text-sm text-gray-600 mt-1">
                开始时间: {{ formatDate(progress.startTime) }}
              </p>
              <p v-if="progress.completeTime" class="text-sm text-gray-600">
                完成时间: {{ formatDate(progress.completeTime) }}
              </p>

            </div>
            <div class="text-right">
              <span 
                :class="[
                  'px-3 py-1 text-xs rounded-full font-medium',
                  progress.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : progress.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ 
                  progress.status === 'completed' ? '已完成' : 
                  progress.status === 'in_progress' ? '学习中' : '未开始' 
                }}
              </span>
            </div>
          </div>
          
          <div class="mb-2">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>学习进度</span>
              <span>{{ progress.progressPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                :class="[
                  'h-2 rounded-full transition-all duration-300',
                  progress.status === 'completed' 
                    ? 'bg-green-500' 
                    : progress.status === 'in_progress'
                    ? 'bg-yellow-500'
                    : 'bg-gray-300'
                ]"
                :style="{ width: `${progress.progressPercent}%` }"
              ></div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewChapter(progress.chapterId)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看章节
            </button>
            <button 
              v-if="progress.status !== 'completed'"
              @click="updateProgress(progress)"
              :disabled="updatingProgress"
              class="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
            >
              {{ progress.status === 'in_progress' ? '标记完成' : '开始学习' }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-500 py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-2">暂无学习进度记录</p>
      </div>
    </div>

    <!-- 学习统计 -->
    <div v-if="courseProgress.length > 0" class="mb-8">
      <h4 class="text-md font-medium text-gray-800 mb-4">学习统计</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ averageProgress }}%</div>
          <div class="text-sm text-gray-600">平均进度</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ completedCount }}</div>
          <div class="text-sm text-gray-600">已完成章节</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-600">{{ inProgressCount }}</div>
          <div class="text-sm text-gray-600">进行中章节</div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getStudentProgressInCourse,
  updateLearningProgress,
  LearningProgressVO,
  LearningProgressDTO
} from '@/lib/api/classroom'

interface Props {
  courseId: number
  studentId: number
}

const props = defineProps<Props>()
const router = useRouter()

// 状态
const loading = ref(false)
const courseProgressLoading = ref(false)
const updatingProgress = ref(false)
const error = ref('')
const courseProgress = ref<LearningProgressVO[]>([])

// 计算属性
const completedChapters = computed(() => 
  courseProgress.value.filter(p => p.status === 'completed').length
)

const totalChapters = computed(() => courseProgress.value.length)

const overallProgress = computed(() => {
  if (courseProgress.value.length === 0) return 0
  const totalProgress = courseProgress.value.reduce((sum, p) => sum + p.progressPercent, 0)
  return Math.round(totalProgress / courseProgress.value.length)
})



const averageProgress = computed(() => {
  if (courseProgress.value.length === 0) return 0
  const totalProgress = courseProgress.value.reduce((sum, p) => sum + p.progressPercent, 0)
  return Math.round(totalProgress / courseProgress.value.length)
})

const completedCount = computed(() => 
  courseProgress.value.filter(p => p.status === 'completed').length
)

const inProgressCount = computed(() => 
  courseProgress.value.filter(p => p.status === 'in_progress').length
)

// 加载课程进度
const loadCourseProgress = async () => {
  if (!props.courseId || !props.studentId) return
  
  courseProgressLoading.value = true
  error.value = ''
  
  try {
    const res = await getStudentProgressInCourse(props.courseId, props.studentId)
    if (res.code === 200) {
      courseProgress.value = res.data
    } else {
      error.value = res.message || '获取学习进度失败'
    }
  } catch (err) {
    console.error('加载学习进度错误:', err)
    error.value = '加载学习进度时出错'
  } finally {
    courseProgressLoading.value = false
  }
}

// 更新学习进度
const updateProgress = async (progress: LearningProgressVO) => {
  if (!progress) return
  
  updatingProgress.value = true
  error.value = ''
  
  try {
    const newStatus = progress.status === 'in_progress' ? 'completed' : 'in_progress'
    
    const progressData: LearningProgressDTO = {
      chapterId: progress.chapterId,
      status: newStatus,
      progressPercent: newStatus === 'completed' ? 100 : 50
    }
    
    const res = await updateLearningProgress(progressData)
    
    if (res.code === 200) {
      // 更新本地进度状态
      const index = courseProgress.value.findIndex(p => p.chapterId === progress.chapterId)
      if (index !== -1) {
        courseProgress.value[index] = res.data
      }
    } else {
      error.value = res.message || '更新学习进度失败'
    }
  } catch (err) {
    console.error('更新学习进度错误:', err)
    error.value = '更新学习进度时出错'
  } finally {
    updatingProgress.value = false
  }
}

// 查看章节
const viewChapter = (chapterId: number) => {
  router.push(`/classroom/${props.courseId}/chapter/${chapterId}`)
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  await loadCourseProgress()
  loading.value = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  loadCourseProgress()
})
</script> 