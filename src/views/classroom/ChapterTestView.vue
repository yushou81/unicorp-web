<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">章节功能测试</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 章节列表测试 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">章节列表测试</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">课程ID</label>
          <input 
            v-model="testCourseId"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入课程ID"
          />
        </div>
        
        <button 
          @click="loadChapters"
          :disabled="loading"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? '加载中...' : '加载章节' }}
        </button>
        
        <div v-if="chapters.length > 0" class="mt-4">
          <h3 class="text-md font-medium text-gray-900 mb-2">章节列表：</h3>
          <div class="space-y-2">
            <div 
              v-for="chapter in chapters" 
              :key="chapter.id"
              class="p-3 border border-gray-200 rounded-lg"
            >
              <div class="font-medium">{{ chapter.title }}</div>
              <div class="text-sm text-gray-600">{{ chapter.description }}</div>
              <div class="text-xs text-gray-500 mt-1">
                序号: {{ chapter.sequence }} | 
                发布状态: {{ chapter.isPublished ? '已发布' : '未发布' }} | 
                资源数: {{ chapter.resourceCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 章节详情测试 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">章节详情测试</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">章节ID</label>
          <input 
            v-model="testChapterId"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入章节ID"
          />
        </div>
        
        <button 
          @click="loadChapterDetail"
          :disabled="detailLoading"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ detailLoading ? '加载中...' : '加载章节详情' }}
        </button>
        
        <div v-if="chapterDetail" class="mt-4">
          <h3 class="text-md font-medium text-gray-900 mb-2">章节详情：</h3>
          <div class="p-3 border border-gray-200 rounded-lg">
            <div class="font-medium">{{ chapterDetail.title }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ chapterDetail.description }}</div>
            <div class="text-xs text-gray-500 mt-2">
              <div>ID: {{ chapterDetail.id }}</div>
              <div>课程ID: {{ chapterDetail.courseId }}</div>
              <div>序号: {{ chapterDetail.sequence }}</div>
              <div>发布状态: {{ chapterDetail.isPublished ? '已发布' : '未发布' }}</div>
              <div>资源数: {{ chapterDetail.resourceCount }}</div>
              <div>创建时间: {{ formatDate(chapterDetail.createdAt) }}</div>
              <div>更新时间: {{ formatDate(chapterDetail.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  getChaptersByCourseId,
  getChapterById,
  CourseChapterVO
} from '@/lib/api/classroom'

// 状态
const loading = ref(false)
const detailLoading = ref(false)
const error = ref('')
const chapters = ref<CourseChapterVO[]>([])
const chapterDetail = ref<CourseChapterVO | null>(null)
const testCourseId = ref('')
const testChapterId = ref('')

// 加载章节列表
const loadChapters = async () => {
  if (!testCourseId.value) {
    error.value = '请输入课程ID'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await getChaptersByCourseId(Number(testCourseId.value))
    if (res.code === 200) {
      chapters.value = res.data
    } else {
      error.value = res.message || '获取章节列表失败'
    }
  } catch (err) {
    console.error('加载章节列表错误:', err)
    error.value = '加载章节列表时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 加载章节详情
const loadChapterDetail = async () => {
  if (!testChapterId.value) {
    error.value = '请输入章节ID'
    return
  }
  
  detailLoading.value = true
  error.value = ''
  
  try {
    const res = await getChapterById(Number(testChapterId.value))
    if (res.code === 200) {
      chapterDetail.value = res.data
    } else {
      error.value = res.message || '获取章节详情失败'
    }
  } catch (err) {
    console.error('加载章节详情错误:', err)
    error.value = '加载章节详情时出错，请稍后再试'
  } finally {
    detailLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script> 