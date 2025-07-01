<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <router-link 
        :to="`/classroom/${courseId}`" 
        class="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回课程详情
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">{{ chapter?.title || '章节详情' }}</h1>
    </div>

    <div v-if="loading" class="py-10 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="py-6 text-center text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="!chapter" class="py-6 text-center text-gray-500">
      章节不存在或已被删除
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧章节内容 -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">章节内容</h2>
          
          <div class="prose max-w-none">
            <p class="text-gray-700">{{ chapter.description || '暂无章节详细介绍' }}</p>
          </div>
          
          <!-- 课程资源 -->
          <div v-if="resources.length > 0" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">章节资源</h3>
            <div class="space-y-3">
              <div 
                v-for="resource in resources" 
                :key="resource.id" 
                class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center">
                  <!-- 文档图标 -->
                  <svg v-if="resource.resourceType === 'document'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  
                  <!-- 视频图标 -->
                  <svg v-else-if="resource.resourceType === 'video'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  
                  <!-- 代码图标 -->
                  <svg v-else-if="resource.resourceType === 'code'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  
                  <!-- 其他文件图标 -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  
                  <div>
                    <div class="font-medium text-gray-800">{{ resource.title }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ formatFileSize(resource.fileSize) }} · {{ getFileTypeText(resource.resourceType) }}
                    </div>
                  </div>
                </div>
                
                <a 
                  :href="getDownloadUrl(resource.id)" 
                  target="_blank" 
                  class="text-blue-600 hover:text-blue-800 p-1"
                  title="下载"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧学习进度 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">学习进度</h3>
          
          <div v-if="progressLoading" class="py-4 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="!isStudent" class="text-center text-gray-500 py-4">
            需要登录学生账号查看学习进度
          </div>
          
          <div v-else>
            <div class="mb-4">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">完成进度</span>
                <span class="text-sm font-medium text-gray-700">{{ progress?.progressPercent || 0 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${progress?.progressPercent || 0}%` }"></div>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-1">学习状态</div>
              <div class="text-sm text-gray-600">
                {{ 
                  progress?.status === 'completed' ? '已完成' : 
                  progress?.status === 'in_progress' ? '学习中' : '未开始' 
                }}
              </div>
            </div>
            
            <button 
              @click="updateProgress"
              class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              :disabled="updatingProgress"
            >
              <span v-if="updatingProgress" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                更新中...
              </span>
              <span v-else>
                {{ progress?.status === 'completed' ? '标记为未完成' : '标记为已完成' }}
              </span>
            </button>
          </div>
        </div>
        
        <!-- 章节导航 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">章节导航</h3>
          
          <div v-if="chaptersLoading" class="py-4 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="courseChapters.length === 0" class="text-center text-gray-500 py-4">
            暂无其他章节
          </div>
          
          <div v-else class="space-y-2">
            <div 
              v-for="(item, index) in courseChapters" 
              :key="item.id"
              :class="[
                'p-2 rounded-md cursor-pointer',
                item.id === chapterId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              ]"
              @click="navigateToChapter(item.id)"
            >
              <div class="flex items-center">
                <span class="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">
                  {{ index + 1 }}
                </span>
                <span :class="{ 'font-medium': item.id === chapterId }">{{ item.title }}</span>
              </div>
              <div v-if="isStudent && item.progressInfo" class="mt-1 pl-8">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    class="bg-blue-600 h-1.5 rounded-full" 
                    :style="{ width: `${item.progressInfo.progressPercent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  getChapterById,
  getChaptersByCourseId,
  getResourcesByCourseId,
  getResourceDownloadUrl,
  getStudentProgressInChapter,
  getStudentProgressInCourse,
  updateLearningProgress,
  CourseChapterVO,
  CourseResourceVO,
  LearningProgressVO,
  LearningProgressDTO
} from '@/lib/api/classroom'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(false)
const error = ref('')
const chapter = ref<CourseChapterVO | null>(null)
const resources = ref<CourseResourceVO[]>([])
const isStudent = ref(false) // 此处应该从用户状态获取
const studentId = ref<number | null>(1) // 此处应该从用户状态获取
const progress = ref<LearningProgressVO | null>(null)
const progressLoading = ref(false)
const updatingProgress = ref(false)
const courseChapters = ref<(CourseChapterVO & { progressInfo?: LearningProgressVO })[]>([])
const chaptersLoading = ref(false)

// 路由参数
const chapterId = computed(() => Number(route.params.chapterId) || 0)
const courseId = computed(() => Number(route.params.courseId) || 0)

// 加载章节详情
const loadChapter = async () => {
  if (!chapterId.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await getChapterById(chapterId.value)
    if (res.code === 200) {
      chapter.value = res.data
      loadResources()
      if (isStudent.value && studentId.value) {
        loadProgress()
      }
    } else {
      error.value = res.message || '获取章节详情失败'
    }
  } catch (err) {
    console.error('加载章节错误:', err)
    error.value = '加载章节时出错，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 加载章节资源
const loadResources = async () => {
  if (!chapterId.value) return
  
  try {
    // 首先获取章节关联的资源ID
    // 由于接口设计原因，这里假设直接加载课程的所有资源
    const res = await getResourcesByCourseId(courseId.value)
    if (res.code === 200) {
      resources.value = res.data.records
    }
  } catch (err) {
    console.error('加载资源错误:', err)
  }
}

// 加载学习进度
const loadProgress = async () => {
  if (!chapterId.value || !studentId.value) return
  
  progressLoading.value = true
  
  try {
    const res = await getStudentProgressInChapter(chapterId.value, studentId.value)
    if (res.code === 200) {
      progress.value = res.data
    }
  } catch (err) {
    console.error('加载学习进度错误:', err)
  } finally {
    progressLoading.value = false
  }
}

// 加载课程章节列表
const loadCourseChapters = async () => {
  if (!courseId.value) return
  
  chaptersLoading.value = true
  
  try {
    const res = await getChaptersByCourseId(courseId.value)
    if (res.code === 200) {
      courseChapters.value = res.data
      
      // 如果是学生，加载所有章节的进度
      if (isStudent.value && studentId.value) {
        const progressRes = await getStudentProgressInCourse(courseId.value, studentId.value)
        if (progressRes.code === 200) {
          // 将进度信息关联到对应章节
          courseChapters.value = courseChapters.value.map(chapter => {
            const progressInfo = progressRes.data.find(p => p.chapterId === chapter.id)
            return {
              ...chapter,
              progressInfo: progressInfo || null
            }
          })
        }
      }
    }
  } catch (err) {
    console.error('加载课程章节错误:', err)
  } finally {
    chaptersLoading.value = false
  }
}

// 更新学习进度
const updateProgress = async () => {
  if (!chapterId.value || !studentId.value || !isStudent.value) return
  
  updatingProgress.value = true
  
  try {
    // 切换完成状态
    const newStatus = progress.value?.status === 'completed' ? 'in_progress' : 'completed'
    const progressData: LearningProgressDTO = {
      chapterId: chapterId.value,
      status: newStatus,
      progressPercent: newStatus === 'completed' ? 100 : 50
    }
    
    const res = await updateLearningProgress(progressData)
    
    if (res.code === 200) {
      // 更新本地进度状态
      if (progress.value) {
        progress.value.status = newStatus
        progress.value.progressPercent = newStatus === 'completed' ? 100 : 50
      }
      
      // 更新章节列表中的进度状态
      const chapterIndex = courseChapters.value.findIndex(c => c.id === chapterId.value)
      if (chapterIndex !== -1 && courseChapters.value[chapterIndex].progressInfo) {
        courseChapters.value[chapterIndex].progressInfo!.status = newStatus
        courseChapters.value[chapterIndex].progressInfo!.progressPercent = newStatus === 'completed' ? 100 : 50
      }
    }
  } catch (err) {
    console.error('更新学习进度错误:', err)
  } finally {
    updatingProgress.value = false
  }
}

// 导航到其他章节
const navigateToChapter = (id: number) => {
  if (id === chapterId.value) return
  router.push(`/classroom/${courseId.value}/chapter/${id}`)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
}

// 获取文件类型文本
const getFileTypeText = (resourceType: string) => {
  const typeTexts: Record<string, string> = {
    'document': '文档',
    'video': '视频',
    'code': '代码',
    'other': '其他'
  }
  return typeTexts[resourceType] || '未知类型'
}

// 获取资源下载链接
const getDownloadUrl = (resourceId: number) => {
  return getResourceDownloadUrl(resourceId)
}

// 监听路由参数变化
watch([() => route.params.chapterId, () => route.params.courseId], () => {
  loadChapter()
  loadCourseChapters()
}, { immediate: true })
</script> 