<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-gray-900">学习进度管理</h3>
      <button 
        @click="refreshData"
        :disabled="loading"
        class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? '加载中...' : '刷新' }}
      </button>
    </div>

    <!-- 课程整体进度统计 -->
    <div class="mb-8">
      <h4 class="text-md font-medium text-gray-800 mb-4">课程整体进度</h4>
      <div v-if="courseStatsLoading" class="py-4 flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="courseStats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ courseStats.totalStudents || 0 }}</div>
          <div class="text-sm text-gray-600">总学生数</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ courseStats.averageCompletionRate || courseStats.averageProgress || 0 }}%</div>
          <div class="text-sm text-gray-600">平均进度</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ courseStats.averageCompletionRate || courseStats.completionRate || 0 }}%</div>
          <div class="text-sm text-gray-600">完成率</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">{{ courseStats.chapterCount || 0 }}</div>
          <div class="text-sm text-gray-600">章节数</div>
        </div>
      </div>
    </div>



    <!-- 学生课程进度列表 -->
    <div v-if="courseStats && courseStats.studentProgressList && courseStats.studentProgressList.length > 0">
      <h4 class="text-md font-medium text-gray-800 mb-4">学生课程进度</h4>
      <div class="bg-white rounded-lg overflow-hidden border">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均进度</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完成章节</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总章节</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in courseStats.studentProgressList" :key="student.studentId">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ student.studentName }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      class="bg-green-600 h-2 rounded-full" 
                      :style="{ width: `${student.averageProgress}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ student.averageProgress }}%</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ student.completedChapters }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {{ student.totalChapters }}
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, onMounted, watch } from 'vue'
import { 
  getCourseProgressStatistics
} from '@/lib/api/classroom'

interface Props {
  courseId: number
}

const props = defineProps<Props>()

// 状态
const loading = ref(false)
const courseStatsLoading = ref(false)
const error = ref('')
const courseStats = ref<any>(null)

// 加载课程进度统计
const loadCourseStats = async () => {
  if (!props.courseId) return
  
  courseStatsLoading.value = true
  error.value = ''
  
  try {
    const res = await getCourseProgressStatistics(props.courseId)
    if (res.code === 200) {
      courseStats.value = res.data
      // 确保数据结构完整
      if (courseStats.value) {
        courseStats.value.studentProgressList = courseStats.value.studentProgressList || []
        courseStats.value.chapterProgressRates = courseStats.value.chapterProgressRates || {}
      }
    } else {
      error.value = res.message || '获取课程进度统计失败'
    }
  } catch (err) {
    console.error('加载课程进度统计错误:', err)
    error.value = '加载课程进度统计时出错'
  } finally {
    courseStatsLoading.value = false
  }
}



// 刷新数据
const refreshData = async () => {
  loading.value = true
  await loadCourseStats()
  loading.value = false
}

// 监听props变化
watch(() => props.courseId, () => {
  if (props.courseId) {
    loadCourseStats()
  }
})

// 初始化
onMounted(() => {
  if (props.courseId) {
    loadCourseStats()
  }
})
</script> 