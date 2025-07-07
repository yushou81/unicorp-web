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
          
          <!-- 教师编辑按钮 -->
          <div v-if="isTeacher" class="mt-6">
            <router-link 
              :to="`/classroom/${courseId}/chapter/${chapterId}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑章节
            </router-link>
          </div>
          
          <!-- 课程资源 -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">章节资源</h3>
              <button v-if="isTeacher" @click="showResourceManager = true" class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                添加资源
              </button>
            </div>
            <!-- 教师资源管理弹窗 -->
            <div v-if="showResourceManager">
              <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                  <button @click="showResourceManager = false" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <ChapterResourceManager 
                    :chapter-id="chapterId" 
                    :course-id="courseId"
                    @resource-added="onResourceAdded"
                    @resource-removed="onResourceRemoved"
                  />
                </div>
              </div>
            </div>
            
            <!-- 学生查看资源 -->
            <div v-else-if="resources.length > 0" class="space-y-3">
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
                    <div class="font-medium text-gray-800">{{ resource.title || `资源 ${resource.id}` }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ resource.fileSize ? formatFileSize(resource.fileSize) : '未知大小' }} · {{ resource.resourceType ? getFileTypeText(resource.resourceType) : '未知类型' }}
                    </div>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="downloadResource(resource.id, resource.title)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="下载"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-4">
              暂无章节资源
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧学习进度 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">学习进度</h3>
            <div class="flex space-x-2">
              <button 
                v-if="isTeacher"
                @click="showChapterProgressManager = true"
                class="text-blue-600 hover:text-blue-800 text-sm"
                title="查看章节进度统计"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
          <template v-if="isTeacher">
            <div v-if="chapterStatsLoading" class="py-4 flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="chapterStats">
              <div class="mb-2 flex flex-wrap gap-4">
                <div class="flex-1 min-w-[120px]">
                  <div class="text-sm text-gray-500">完成率</div>
                  <div class="text-lg font-bold text-blue-600">{{ chapterStats.completionRate }}%</div>
                </div>
                <div class="flex-1 min-w-[120px]">
                  <div class="text-sm text-gray-500">平均进度</div>
                  <div class="text-lg font-bold text-green-600">{{ chapterStats.averageProgress }}%</div>
                </div>
                <div class="flex-1 min-w-[120px]">
                  <div class="text-sm text-gray-500">学生数</div>
                  <div class="text-lg font-bold text-gray-800">{{ chapterStats.totalStudents }}</div>
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm text-gray-700 mb-2">学生完成情况</div>
                <div v-if="chapterStats.studentProgressList.length > 0">
                  <ul class="divide-y divide-gray-100">
                    <li v-for="student in chapterStats.studentProgressList" :key="student.studentId" class="py-2 flex justify-between items-center">
                      <span class="text-gray-900">{{ student.studentName }}</span>
                      <span class="text-gray-600 text-sm">{{ student.progress }}%</span>
                      <span v-if="student.isCompleted" class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">已完成</span>
                      <span v-else class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">未完成</span>
                    </li>
                  </ul>
                </div>
                <div v-else class="text-center text-gray-400 py-4">暂无学生学习数据</div>
              </div>
            </div>
            <div v-else class="text-center text-gray-400 py-4">暂无学生学习数据</div>
          </template>
          <template v-else>
            <div v-if="progressLoading" class="py-4 flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
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
              <div v-if="progress?.startTime" class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-1">开始时间</div>
                <div class="text-sm text-gray-600">{{ formatDate(progress.startTime) }}</div>
              </div>
              <div v-if="progress?.completeTime" class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-1">完成时间</div>
                <div class="text-sm text-gray-600">{{ formatDate(progress.completeTime) }}</div>
              </div>
              <div v-if="progress?.durationMinutes" class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-1">学习时长</div>
                <div class="text-sm text-gray-600">{{ progress.durationMinutes }}分钟</div>
              </div>
              <button 
                @click="updateProgress"
                class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                  {{ 
                    !progress || progress.status === 'not_started' ? '开始学习' :
                    progress.status === 'in_progress' ? '完成学习' :
                    progress.status === 'completed' ? '重新学习' : '开始学习'
                  }}
                </span>
              </button>
            </div>
          </template>
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
    
    <!-- 章节进度管理弹窗 -->
    <div v-if="showChapterProgressManager" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-900">章节学习进度统计</h3>
            <div class="flex items-center space-x-2">
              <button 
                @click="handleInitializeChapterProgressForAllStudents"
                :disabled="initializingChapterProgress"
                class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {{ initializingChapterProgress ? '初始化中...' : '初始化学生进度' }}
              </button>
              <button 
                @click="showChapterProgressManager = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <LearningProgressManager 
            :course-id="courseId"
            :chapter-id="chapterId"
            ref="progressManagerRef"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { 
  getChapterById,
  getChaptersByCourseId,
  getChapterResources,
  getStudentProgressInChapter,
  getStudentProgressInCourse,
  updateLearningProgress,
  initializeChapterProgress,
  getResourcesByCourseId,
  getChapterProgressStatistics, // 新增
  CourseChapterVO,
  CourseResourceVO,
  LearningProgressVO,
  LearningProgressDTO
} from '@/lib/api/classroom'
import ChapterResourceManager from '@/components/classroom/ChapterResourceManager.vue'
import LearningProgressManager from '@/components/classroom/LearningProgressManager.vue'

// 路由和导航
const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(false)
const error = ref('')
const chapter = ref<CourseChapterVO | null>(null)
const resources = ref<CourseResourceVO[]>([])
const isStudent = computed(() => {
  const role = appStore.user?.role
  return role === 'STUDENT' || role === 'student'
})
const appStore = useAppStore()
const isTeacher = computed(() => {
  const role = appStore.user?.role
  return role === 'TEACHER' || role === 'teacher'
})
const studentId = computed(() => appStore.user?.id || null)
const progress = ref<LearningProgressVO | null>(null)
const progressLoading = ref(false)
const updatingProgress = ref(false)
const courseChapters = ref<(CourseChapterVO & { progressInfo?: LearningProgressVO })[]>([])
const chaptersLoading = ref(false)
const showResourceManager = ref(false)
const showChapterProgressManager = ref(false) // 新增：控制章节进度管理弹窗
const chapterStats = ref<any>(null)
const chapterStatsLoading = ref(false)
const initializingChapterProgress = ref(false)
const progressManagerRef = ref()

// 批量初始化本章节所有学生的进度
const handleInitializeChapterProgressForAllStudents = async () => {
  if (!chapterId.value || !isTeacher.value) return
  if (!confirm('确定要初始化本章节所有学生的学习进度吗？')) return
  initializingChapterProgress.value = true
  try {
    // 由于没有批量初始化接口，这里暂时提示用户
    alert('批量初始化功能需要后端支持，请联系管理员')
    await loadChapterStats()
  } catch (error: any) {
    alert('初始化失败: ' + (error.message || '未知错误'))
  } finally {
    initializingChapterProgress.value = false
  }
}

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
    // 获取章节关联的资源
    const res = await getChapterResources(chapterId.value)
    if (res.code === 200) {
      // 兼容后端返回id数组的情况
      if (Array.isArray(res.data) && typeof res.data[0] === 'number') {
        // 获取所有课程资源，然后根据ID过滤
        const allResourcesRes = await getResourcesByCourseId(courseId.value, 1, 1000)
        if (allResourcesRes.code === 200) {
          const allResources = allResourcesRes.data.records
          const resourceIdSet = new Set(res.data)
          resources.value = allResources.filter(r => resourceIdSet.has(r.id))
        } else {
          // 如果获取完整资源失败，至少显示ID
          resources.value = res.data.map(id => ({ id }))
        }
      } else {
        resources.value = res.data
      }
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
    if (res.code === 200 && res.data) {
      progress.value = res.data
    } else {
      // 只要没有有效进度记录就初始化
      const initRes = await initializeChapterProgress(chapterId.value)
      if (initRes.code === 200) {
        // 重新获取进度
        const progressRes = await getStudentProgressInChapter(chapterId.value, studentId.value)
        if (progressRes.code === 200 && progressRes.data) {
          progress.value = progressRes.data
        }
      }
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
              progressInfo: progressInfo || undefined
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

// 加载章节统计（仅教师端）
const loadChapterStats = async () => {
  if (!chapterId.value || !isTeacher.value) return
  chapterStatsLoading.value = true
  try {
    const res = await getChapterProgressStatistics(chapterId.value)
    if (res.code === 200) {
      chapterStats.value = res.data
    } else {
      chapterStats.value = null
    }
  } catch (err) {
    chapterStats.value = null
  } finally {
    chapterStatsLoading.value = false
  }
}

// 刷新进度管理器
const refreshProgressManager = () => {
  if (progressManagerRef.value) {
    progressManagerRef.value.refreshData()
  }
}

// 更新学习进度
const updateProgress = async () => {
  console.log('当前用户信息:', appStore.user);
  console.log('studentId:', studentId.value, 'isStudent:', isStudent.value);
  if (!chapterId.value || !studentId.value || !isStudent.value) return;

  updatingProgress.value = true;

  try {
    // 未开始时只初始化
    if (!progress.value || progress.value.status === 'not_started') {
      const initRes = await initializeChapterProgress(chapterId.value);
      if (initRes.code === 200) {
        // 重新获取进度
        const progressRes = await getStudentProgressInChapter(chapterId.value, studentId.value);
        if (progressRes.code === 200 && progressRes.data) {
          progress.value = progressRes.data;
          // 如果初始化后状态还是not_started，自动PUT一次变为in_progress
          if (progress.value.status === 'not_started') {
            const progressData: LearningProgressDTO = {
              chapterId: chapterId.value,
              status: 'in_progress',
              progressPercent: 0, // 这里改为0，开始学习后进度条为0%
              durationMinutes: 0
            };
            const res = await updateLearningProgress(progressData);
            if (res.code === 200) {
              progress.value = res.data;
            }
          }
        }
      }
      updatingProgress.value = false;
      return;
    }

    // 进行中/已完成时才PUT
    let newStatus: 'in_progress' | 'completed';
    let newProgressPercent: number;

    if (progress.value.status === 'in_progress') {
      newStatus = 'completed';
      newProgressPercent = 100;
    } else if (progress.value.status === 'completed') {
      newStatus = 'in_progress';
      newProgressPercent = progress.value.progressPercent; // 保持100%
    } else {
      newStatus = 'in_progress';
      newProgressPercent = 0;
    }

    let durationMinutes = 0;
    if (progress.value?.startTime) {
      const startTime = new Date(progress.value.startTime);
      const now = new Date();
      durationMinutes = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
    }

    const progressData: LearningProgressDTO = {
      chapterId: chapterId.value,
      status: newStatus,
      progressPercent: newProgressPercent,
      durationMinutes: durationMinutes
    };

    const res = await updateLearningProgress(progressData);
    if (res.code === 200) {
      progress.value = res.data;
      // 更新章节列表中的进度状态
      const chapterIndex = courseChapters.value.findIndex(c => c.id === chapterId.value);
      if (chapterIndex !== -1 && courseChapters.value[chapterIndex].progressInfo) {
        courseChapters.value[chapterIndex].progressInfo!.status = newStatus;
        courseChapters.value[chapterIndex].progressInfo!.progressPercent = newProgressPercent;
        courseChapters.value[chapterIndex].progressInfo!.durationMinutes = durationMinutes;
      }
    }
  } catch (err) {
    console.error('更新学习进度错误:', err);
  } finally {
    updatingProgress.value = false;
  }
}

// 导航到其他章节
const navigateToChapter = (id: number) => {
  if (id === chapterId.value) return
  router.push(`/classroom/${courseId.value}/chapter/${id}`)
}

// 资源管理事件处理
const onResourceAdded = (resourceId: number) => {
  // 重新加载资源列表
  loadResources()
}

const onResourceRemoved = (resourceId: number) => {
  // 重新加载资源列表
  loadResources()
}

// 下载资源
const downloadResource = async (resourceId: number, title?: string) => {
  try {
    const token = localStorage.getItem('token') || ''
    const url = `http://192.168.58.74:8081/api/v1/course-resources/download/${resourceId}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`)
    }
    
    // 获取文件名
    const contentDisposition = response.headers.get('content-disposition')
    let filename = title || `resource_${resourceId}`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }
    
    // 创建blob并下载
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    
  } catch (error) {
    console.error('下载资源错误:', error)
    alert('下载失败，请稍后再试')
  }
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

// 不再需要特殊的下载URL函数，直接使用资源的fileUrl

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 监听路由参数变化
onMounted(() => {
  loadChapter()
  loadCourseChapters()
  if (isTeacher.value) {
    loadChapterStats()
  }
})

watch([chapterId, isTeacher], () => {
  if (isTeacher.value) {
    loadChapterStats()
  }
})
</script> 