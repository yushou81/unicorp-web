<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      
      <template v-else-if="course">
        <!-- 面包屑导航 -->
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <span class="mx-2">/</span>
          <router-link to="/classroom" class="hover:text-blue-600">双师课堂</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-700">课程详情</span>
        </div>
        
        <!-- 课程标题区域 -->
        <CourseInfo :course="course">
          <template #actions>
            <div class="flex space-x-4">
              <CourseEnrollButton 
                :course="course" 
                :is-enrolled="isEnrolled"
                @enroll="handleEnrollSuccess"
                @cancel="handleCancelSuccess"
                @error="handleEnrollError"
              />
              <button class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>
            </div>
          </template>
        </CourseInfo>
        
        <!-- 课程详情和教师信息 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <!-- 左侧：课程详情 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程介绍</h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ course.description }}</p>
              </div>
            </div>
            
            <!-- 课程大纲 -->
            <CourseChapters 
              :course-id="Number(route.params.id)"
              :is-teacher="isTeacher"
              :is-student="isStudent"
              :student-id="studentId"
            />
            
            <!-- 课程资源 -->
            <CourseResources 
              :course-id="Number(route.params.id)"
              :is-teacher="isTeacher"
              :current-user-id="studentId"
              :is-resource-manager="isTeacher || isMentor"
            />
            
            <!-- 课程评价 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <CourseRating 
                :course-id="Number(route.params.id)"
                :ratings="courseRatings"
                :can-rate="canRate"
                :has-rated="hasUserRated"
                @submit-success="handleRatingSuccess"
                @error="handleRatingError"
              />
            </div>
          </div>
          
          <!-- 右侧：教师信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">讲师信息</h2>
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 text-xl">
                  {{ course.teacherName.substring(0, 1) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ course.teacherName }}</div>
                  <div class="text-sm text-gray-500">高校教师</div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">企业导师信息</h2>
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 text-xl">
                  {{ course.mentorName.substring(0, 1) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ course.mentorName }}</div>
                  <div class="text-sm text-gray-500">{{ course.enterpriseName }}</div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">课程信息</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">课程状态</div>
                  <div class="font-medium">{{ getStatusText(course.status) }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">已报名/总名额</div>
                  <div class="font-medium">{{ course.enrolledCount }}/{{ course.maxStudents }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">授课方式</div>
                  <div class="font-medium">{{ getModeText(course.courseType) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 页脚 -->
    <Footer 
      copyright="© 2023-2024 校企联盟平台 版权所有"
      contactInfo="联系方式：contact@example.com"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// @ts-ignore
import { useToast } from 'vue-toastification'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CourseInfo from '@/components/classroom/CourseInfo.vue'
import CourseEnrollButton from '@/components/classroom/CourseEnrollButton.vue'
import CourseChapters from '@/components/classroom/CourseChapters.vue'
import CourseResources from '@/components/classroom/CourseResources.vue'
import CourseRating from '@/components/classroom/CourseRating.vue'
import { 
  getCourseById, 
  getResourcesByCourseId,
  getChaptersByCourseId,
  getRatingsByCourseId,
  hasRated,
  DualTeacherCourseVO, 
  CourseStatus, 
  CourseType,
  CourseResourceVO,
  CourseRatingVO,
  CourseChapterVO
} from '@/lib/api/classroom'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const toast = useToast()
const appStore = useAppStore()

const loading = ref(true)
const error = ref('')
const course = ref<DualTeacherCourseVO | null>(null)
const isEnrolled = ref(false)
const courseResources = ref<CourseResourceVO[]>([])
const courseChapters = ref<CourseChapterVO[]>([])
const courseRatings = ref<CourseRatingVO[]>([])
const hasUserRated = ref(false)
const chaptersLoading = ref(false)

// 用户角色判断
const isTeacher = computed(() => {
  const user = appStore.user as any
  return user && user.role && (user.role.toUpperCase() === 'TEACHER' || user.role.toUpperCase() === 'SCH_ADMIN')
})

const isStudent = computed(() => {
  const user = appStore.user as any
  return user && user.role && user.role.toUpperCase() === 'STUDENT'
})

const isMentor = computed(() => {
  const user = appStore.user as any
  return user && user.role && (user.role.toUpperCase() === 'MENTOR' || user.role.toUpperCase() === 'EN_TEACHER')
})

// 用户ID
const studentId = computed(() => {
  const user = appStore.user as any
  return user ? user.id : null
})

// 判断用户是否可以评价课程
const canRate = computed(() => {
  // 用户已登录、已报名、课程已结束、且未评价过
  return Boolean(appStore.user) && 
    isEnrolled.value && 
    course.value?.status === CourseStatus.COMPLETED && 
    !hasUserRated.value
})

// 获取课程详情
const fetchCourseDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const courseId = Number(route.params.id)
    const response = await getCourseById(courseId)
    course.value = response.data
    
    // 获取课程资源
    fetchCourseResources(courseId)
    
    // 获取课程章节
    fetchCourseChapters(courseId)
    
    // 获取课程评价
    fetchCourseRatings(courseId)
    
    // 检查用户是否已报名
    // TODO: 实际项目中应该从API获取
    isEnrolled.value = false
    
    // 检查用户是否已评价过课程
    if (appStore.user) {
      try {
        const ratedResponse = await hasRated(courseId)
        hasUserRated.value = ratedResponse.data
      } catch (err) {
        console.error('检查用户是否已评价失败:', err)
      }
    }
    
  } catch (err) {
    console.error('获取课程详情失败:', err)
    error.value = err instanceof Error ? err.message : '获取课程详情失败'
  } finally {
    loading.value = false
  }
}

// 获取课程资源
const fetchCourseResources = async (courseId: number) => {
  try {
    const response = await getResourcesByCourseId(courseId)
    courseResources.value = response.data.records
  } catch (err) {
    console.error('获取课程资源失败:', err)
  }
}

// 获取课程章节
const fetchCourseChapters = async (courseId: number) => {
  chaptersLoading.value = true
  try {
    const response = await getChaptersByCourseId(courseId)
    courseChapters.value = response.data
  } catch (err) {
    console.error('获取课程章节失败:', err)
  } finally {
    chaptersLoading.value = false
  }
}

// 获取课程评价
const fetchCourseRatings = async (courseId: number) => {
  try {
    const response = await getRatingsByCourseId(courseId)
    courseRatings.value = response.data.records
  } catch (err) {
    console.error('获取课程评价失败:', err)
  }
}

// 处理报名成功
const handleEnrollSuccess = () => {
  isEnrolled.value = true
  toast.success('报名成功')
  
  // 更新课程已报名人数
  if (course.value) {
    course.value.enrolledCount += 1
  }
}

// 处理取消报名成功
const handleCancelSuccess = () => {
  isEnrolled.value = false
  toast.success('已取消报名')
  
  // 更新课程已报名人数
  if (course.value) {
    course.value.enrolledCount -= 1
  }
}

// 处理报名错误
const handleEnrollError = (message: string) => {
  toast.error(message)
}

// 处理评价成功
const handleRatingSuccess = () => {
  hasUserRated.value = true
  fetchCourseRatings(Number(route.params.id))
}

// 处理评价错误
const handleRatingError = (message: string) => {
  toast.error(message)
}

// 获取状态对应的文本
const getStatusText = (status: CourseStatus) => {
  const statusTexts = {
    [CourseStatus.PLANNING]: '筹备中',
    [CourseStatus.OPEN]: '开放报名',
    [CourseStatus.IN_PROGRESS]: '进行中',
    [CourseStatus.COMPLETED]: '已结束',
    [CourseStatus.CANCELLED]: '已取消'
  }
  return statusTexts[status] || '未知状态'
}

// 获取授课方式对应的文本
const getModeText = (mode: CourseType) => {
  const modeTexts = {
    [CourseType.ONLINE]: '线上授课',
    [CourseType.OFFLINE]: '线下授课',
    [CourseType.HYBRID]: '线上+线下'
  }
  return modeTexts[mode] || '未知方式'
}

// 页面加载时获取课程详情
onMounted(() => {
  fetchCourseDetail()
})
</script> 