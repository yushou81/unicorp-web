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
              :current-user-id="appStore.user?.id"
              :is-resource-manager="isTeacher || isMentor"
            />
            
            <!-- 课程评价 -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-900">课程评价</h2>
                <router-link 
                  v-if="isTeacher || isAdmin"
                  :to="`/classroom/${route.params.id}/ratings`"
                  class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  评价管理
                </router-link>
              </div>
              <CourseRating 
                :course-id="Number(route.params.id)"
                :ratings="courseRatings"
                :can-rate="canRate"
                :has-rated="hasUserRated"
                @submit-success="handleRatingSuccess"
                @error="handleRatingError"
                @update-ratings="handleRatingsUpdate"
              />
            </div>
          </div>
          
          <!-- 右侧：教师信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">讲师信息</h2>
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 text-xl">
                  {{ course.teacherName ? course.teacherName.substring(0, 1) : '' }}
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
                  {{ course.mentorName ? course.mentorName.substring(0, 1) : '' }}
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
        <!-- 新增：教师可见的查看学生名单按钮 -->
        <div v-if="isTeacher && course && course.teacherId === appStore.user?.id" class="bg-white rounded-lg shadow-sm p-6 mt-6">
          <button @click="openStudentList" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            查看学生名单
          </button>
        </div>
      </template>
    </div>
    
    <!-- 页脚 -->
    <Footer 
      copyright="© 2023-2024 校企联盟平台 版权所有"
      contactInfo="联系方式：contact@example.com"
    />
    <!-- 学生名单弹窗 -->
    <div v-if="showStudentDialog" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">已报名学生列表</h2>
          <button @click="showStudentDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="studentLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <div v-else-if="studentError" class="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
          {{ studentError }}
        </div>
        <div v-else-if="students.length === 0" class="bg-gray-50 p-8 rounded-lg text-center">
          <p class="text-gray-500">暂无学生报名</p>
        </div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账号</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学校</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="stu in students" :key="stu.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ stu.nickname }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ stu.account }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ stu.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ stu.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ stu.organizationName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="stu.status === 'active' ? 'px-2 py-1 rounded text-xs bg-green-100 text-green-800' : 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'">
                    {{ stu.status === 'active' ? '在读' : stu.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
  hasStudentRated,
  DualTeacherCourseVO, 
  CourseStatus, 
  CourseType,
  CourseResourceVO,
  CourseRatingVO,
  CourseChapterVO,
  getCourseStudents
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

// 学生名单相关
const showStudentDialog = ref(false)
const students = ref<any[]>([])
const studentLoading = ref(false)
const studentError = ref('')

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

// 判断用户是否为管理员
const isAdmin = computed(() => {
  const user = appStore.user as any
  return user && user.role && (
    user.role.toUpperCase() === 'ADMIN' || 
    user.role.toUpperCase() === 'SYSADMIN' || 
    user.role.toUpperCase() === 'SCHOOL_ADMIN' || 
    user.role.toUpperCase() === 'SCH_ADMIN'
  )
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
    
    // 检查用户是否已评价过课程（仅学生调用）
    if (appStore.user && appStore.user.role && appStore.user.role.toUpperCase() === 'STUDENT') {
      try {
        const ratedResponse = await hasStudentRated(courseId, appStore.user.id)
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
    const response = await getRatingsByCourseId(courseId, 1, 10)
    courseRatings.value = response.data.records
  } catch (err) {
    console.error('获取课程评价失败:', err)
  }
}

// 处理评价成功
const handleRatingSuccess = async () => {
  // 重新获取课程评价
  await fetchCourseRatings(Number(route.params.id))
}

// 处理评价错误
const handleRatingError = (message: string) => {
  showToast(message)
}

// 处理评价列表更新
const handleRatingsUpdate = (ratings: any[]) => {
  courseRatings.value = ratings
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

function openStudentList() {
  showStudentDialog.value = true
  studentLoading.value = true
  studentError.value = ''
  students.value = []
  getCourseStudents(Number(route.params.id))
    .then(res => {
      if (res.code === 200) {
        students.value = res.data || []
      } else {
        studentError.value = res.message || '获取学生列表失败'
      }
    })
    .catch(err => {
      studentError.value = err?.message || '获取学生列表失败'
    })
    .finally(() => {
      studentLoading.value = false
    })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function enrollStatusText(status: string) {
  const map: Record<string, string> = {
    enrolled: '已报名',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

function enrollStatusClass(status: string) {
  const map: Record<string, string> = {
    enrolled: 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    completed: 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    cancelled: 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return map[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}
</script> 