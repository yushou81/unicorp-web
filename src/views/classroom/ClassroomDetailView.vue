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
        
        <!-- Tab栏 -->
        <div class="flex border-b mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-6 py-2 -mb-px font-medium transition',
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
        <!-- Tab内容区 -->
        <div>
          <!-- 课程教师视角 -->
          <div v-if="isCourseTeacher">
            <div v-if="activeTab === 'info'">
              <!-- 课程信息内容（原有课程信息卡片、教师/导师信息等） -->
              <CourseInfo 
                :course="course" 
                :can-view-students="true"
                @view-students="openStudentList"
              />
            </div>
            <div v-else-if="activeTab === 'chapters'">
              <CourseChapters
                :course-id="Number(route.params.id)"
                :is-teacher="canManageChapters"
                :is-student="false"
                :student-id="null"
                :is-enrolled="false"
              />
            </div>
            <div v-else-if="activeTab === 'attendance'">
              <CourseAttendanceManager :course-id="Number(route.params.id)" :user-role="appStore.user?.role" />
            </div>
            <div v-else-if="activeTab === 'progress'">
              <LearningProgressManager :course-id="Number(route.params.id)" />
            </div>
            <div v-else-if="activeTab === 'resources'">
              <CourseResources :course-id="Number(route.params.id)" :is-teacher="true" :current-user-id="appStore.user?.id" :is-resource-manager="true" />
            </div>
            <div v-else-if="activeTab === 'rating'">
              <CourseRating :course-id="Number(route.params.id)" :ratings="courseRatings" :can-rate="canRate" :has-rated="hasUserRated" @submit-success="handleRatingSuccess" @success="handleRatingSuccessMsg" @error="handleRatingError" @update-ratings="handleRatingsUpdate" />
            </div>
            <div v-else-if="activeTab === 'discussion'">
              <CourseDiscussion :course-id="Number(route.params.id)" :can-post="Boolean(appStore.user)" :current-user-id="appStore.user?.id" />
              <CourseQuestion :course-id="Number(route.params.id)" :can-ask="false" :can-answer="true" :current-user-id="appStore.user?.id" :user-role="appStore.user?.role" />
            </div>
          </div>
          <!-- 企业导师视角 -->
          <div v-else-if="isMentor">
            <div v-if="activeTab === 'info'">
              <CourseInfo 
                :course="course" 
                :can-view-students="true"
                @view-students="openStudentList"
              />
            </div>
            <div v-else-if="activeTab === 'chapters'">
              <CourseChapters
                :course-id="Number(route.params.id)"
                :is-teacher="false"
                :is-student="false"
                :student-id="null"
                :is-enrolled="false"
              />
            </div>
            <div v-else-if="activeTab === 'rating'">
              <CourseRating :course-id="Number(route.params.id)" :ratings="courseRatings" :can-rate="canRate" :has-rated="hasUserRated" @submit-success="handleRatingSuccess" @success="handleRatingSuccessMsg" @error="handleRatingError" @update-ratings="handleRatingsUpdate" />
            </div>
            <div v-else-if="activeTab === 'discussion'">
              <CourseDiscussion :course-id="Number(route.params.id)" :can-post="Boolean(appStore.user)" :current-user-id="appStore.user?.id" />
              <CourseQuestion :course-id="Number(route.params.id)" :can-ask="false" :can-answer="true" :current-user-id="appStore.user?.id" :user-role="appStore.user?.role" />
            </div>
          </div>
          <!-- 学生视角 -->
          <div v-else>
            <div v-if="activeTab === 'info'">
              <CourseInfo 
                :course="course" 
                :can-view-students="false"
              />
              <!-- 学生报名按钮 -->
              <div class="mt-6">
                <CourseEnrollButton
                  :course="course"
                  :is-enrolled="isEnrolled"
                  @enroll="handleEnrollSuccess"
                  @cancel="handleCancelSuccess"
                  @error="handleEnrollError"
                />
              </div>
            </div>
            <div v-else-if="activeTab === 'chapters'">
              <CourseChapters
                :course-id="Number(route.params.id)"
                :is-student="isStudent"
                :student-id="appStore.user?.id"
                :is-enrolled="isEnrolled"
              />
              <!-- 未报名学生提示 -->
              <div v-if="!isEnrolled" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-blue-700">
                    报名课程后即可查看完整章节内容、课程资源、参与讨论和查看学习进度。
                  </p>
                </div>
              </div>
            </div>
            <div v-else-if="activeTab === 'progress'">
              <StudentProgressView
                :course-id="Number(route.params.id)"
                :student-id="appStore.user?.id"
              />
            </div>
            <div v-else-if="activeTab === 'resources'">
              <CourseResources :course-id="Number(route.params.id)" :is-teacher="false" :current-user-id="appStore.user?.id" :is-resource-manager="false" />
            </div>
            <div v-else-if="activeTab === 'rating'">
              <CourseRating :course-id="Number(route.params.id)" :ratings="courseRatings" :can-rate="canRate" :has-rated="hasUserRated" @submit-success="handleRatingSuccess" @success="handleRatingSuccessMsg" @error="handleRatingError" @update-ratings="handleRatingsUpdate" />
            </div>
            <div v-else-if="activeTab === 'discussion'">
              <CourseDiscussion :course-id="Number(route.params.id)" :can-post="Boolean(appStore.user)" :current-user-id="appStore.user?.id" />
              <CourseQuestion :course-id="Number(route.params.id)" :can-ask="true" :can-answer="false" :current-user-id="appStore.user?.id" :user-role="appStore.user?.role" />
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
import { ref, computed, watch, onMounted } from 'vue'
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
import CourseAttendanceManager from '@/components/classroom/CourseAttendanceManager.vue'
import CourseDiscussion from '@/components/classroom/CourseDiscussion.vue'
import CourseQuestion from '@/components/classroom/CourseQuestion.vue'
import { 
  getCourseById, 
  getResourcesByCourseId,
  getChaptersByCourseId,
  getRatingsByCourseId,
  hasStudentRated,
  getCourseProgressStatistics,
  getStudentProgressInCourse,
  checkStudentEnrollment,
  getStudentEnrolledCourses,
  DualTeacherCourseVO, 
  CourseStatus, 
  CourseType,
  CourseResourceVO,
  CourseRatingVO,
  CourseChapterVO,
  getCourseStudents
} from '@/lib/api/classroom'
import { useAppStore } from '@/stores/app'
import LearningProgressManager from '@/components/classroom/LearningProgressManager.vue'
import StudentProgressView from '@/components/classroom/StudentProgressView.vue'

const appStore = useAppStore()
const route = useRoute()
const toast = useToast()

// 1. Tab栏定义
const teacherTabs = [
  { key: 'info', label: '课程信息' },
  { key: 'chapters', label: '章节管理' },
  { key: 'attendance', label: '出勤管理' },
  { key: 'progress', label: '学习进度' },
  { key: 'resources', label: '课程资源' },
  { key: 'rating', label: '评价' },
  { key: 'discussion', label: '讨论/问答' }
]

const mentorTabs = [
  { key: 'info', label: '课程信息' },
  { key: 'chapters', label: '章节' },
  { key: 'rating', label: '评价' },
  { key: 'discussion', label: '讨论/问答' }
]

// 未报名学生的标签页
const unenrolledStudentTabs = [
  { key: 'info', label: '课程信息' },
  { key: 'chapters', label: '章节' },
  { key: 'rating', label: '评价' }
]

// 已报名学生的标签页
const enrolledStudentTabs = [
  { key: 'info', label: '课程信息' },
  { key: 'chapters', label: '章节' },
  { key: 'progress', label: '我的进度' },
  { key: 'resources', label: '课程资源' },
  { key: 'rating', label: '评价' },
  { key: 'discussion', label: '讨论/问答' }
]

// 2. 数据声明
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

// 学习进度概览相关
const courseStats = ref<any>(null)
const courseStatsLoading = ref(false)
const studentCourseProgress = ref<any>(null)
const studentProgressLoading = ref(false)

// 3. 计算属性
const isStudent = computed(() => appStore.user?.role === 'STUDENT')

// 判断当前用户是否是该课程的教师
const isCourseTeacher = computed(() => {
  const role = appStore.user?.role?.toUpperCase()
  const userId = appStore.user?.id
  return role === 'TEACHER' && userId === course.value?.teacherId
})

// 判断当前用户是否是企业导师
const isMentor = computed(() => {
  const role = appStore.user?.role?.toUpperCase()
  return role === 'MENTOR' || role === 'EN_TEACHER'
})

// 区分真正的教师和企业导师
const canManageChapters = computed(() => {
  return isCourseTeacher.value
})

const tabs = computed(() => {
  if (isCourseTeacher.value) {
    return teacherTabs
  } else if (isMentor.value) {
    return mentorTabs
  } else {
    // 学生根据报名状态显示不同标签页
    return isEnrolled.value ? enrolledStudentTabs : unenrolledStudentTabs
  }
})

const activeTab = ref(tabs.value[0].key)

// 保证 tabs 变化时 activeTab 也能自动切换到第一个
watch(tabs, (newTabs) => {
  if (!newTabs.find(tab => tab.key === activeTab.value)) {
    activeTab.value = newTabs[0]?.key || ''
  }
})

// user.id 相关API调用前判断
const getUserId = computed(() => appStore.user?.id)

// 示例：调用 hasStudentRated 前判断 userId
const safeHasStudentRated = async (courseId: number) => {
  const userId = getUserId.value
  if (!userId) return false
  return await hasStudentRated(courseId, userId)
}

// 用户角色判断
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
  // 学生必须已报名且课程已结束且未评价
  const canRateResult = Boolean(appStore.user) && 
    course.value?.status === CourseStatus.COMPLETED && 
    !hasUserRated.value &&
    (appStore.user?.role?.toUpperCase() !== 'STUDENT' || isEnrolled.value)
  
  // 调试信息
  console.log('评价权限检查:', {
    userLoggedIn: Boolean(appStore.user),
    userRole: appStore.user?.role,
    isEnrolled: isEnrolled.value,
    courseStatus: course.value?.status,
    courseCompleted: course.value?.status === CourseStatus.COMPLETED,
    hasUserRated: hasUserRated.value,
    canRate: canRateResult
  })
  
  return canRateResult
})

// 获取课程详情
const fetchCourseDetail = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const courseId = Number(route.params.id)
    const response = await getCourseById(courseId)
    course.value = response.data
    
    // 检查用户是否已报名课程（仅学生调用）
    if (appStore.user && appStore.user.role && appStore.user.role.toUpperCase() === 'STUDENT') {
      try {
        console.log('检查报名状态 - 用户ID:', appStore.user.id, '课程ID:', courseId)
        
        // 方法1：使用专门的检查接口
        const enrollmentResponse = await checkStudentEnrollment(courseId, appStore.user.id)
        console.log('报名状态检查结果:', enrollmentResponse)
        
        // 如果检查接口失败，尝试方法2：获取已报名课程列表
        if (enrollmentResponse.code !== 200) {
          console.log('检查接口失败，尝试获取已报名课程列表')
          const enrolledCoursesResponse = await getStudentEnrolledCourses(1, 100)
          if (enrolledCoursesResponse.code === 200 && enrolledCoursesResponse.data) {
            const isEnrolledInList = enrolledCoursesResponse.data.records.some(course => course.id === courseId)
            console.log('从已报名课程列表检查结果:', isEnrolledInList)
            isEnrolled.value = isEnrolledInList
          } else {
            isEnrolled.value = false
          }
        } else {
          isEnrolled.value = enrollmentResponse.data
        }
        
        console.log('最终设置 isEnrolled:', isEnrolled.value)
      } catch (err) {
        console.error('检查用户报名状态失败:', err)
        isEnrolled.value = false
      }
    }
    
    // 获取课程资源
    fetchCourseResources(courseId)
    
    // 获取课程章节
    fetchCourseChapters(courseId)
    
    // 获取课程评价
    fetchCourseRatings(courseId)
    
    // 检查用户是否已评价过课程（仅学生调用）
    if (appStore.user && appStore.user.role && appStore.user.role.toUpperCase() === 'STUDENT') {
      try {
        const ratedResponse = await safeHasStudentRated(courseId)
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
// 处理评价成功提示
const handleRatingSuccessMsg = (message: string) => {
  toast.success(message)
}
// 处理评价错误
const handleRatingError = (message: string) => {
  toast.error(message)
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

// 加载课程进度统计（教师端）
const loadCourseStats = async () => {
  if (!course.value?.id || !isCourseTeacher.value) return
  courseStatsLoading.value = true
  try {
    const res = await getCourseProgressStatistics(course.value.id)
    console.log('ClassroomDetailView 接收到的进度统计:', res);
    if (res.code === 200) {
      courseStats.value = res.data
      console.log('ClassroomDetailView 设置的 courseStats:', courseStats.value)
    } else {
      courseStats.value = null
    }
  } catch (err) {
    console.error('加载课程进度统计错误:', err);
    courseStats.value = null
  } finally {
    courseStatsLoading.value = false
  }
}

// 加载学生课程进度（学生端）
const loadStudentCourseProgress = async () => {
  if (!course.value?.id || !isStudent.value || !studentId.value) return
  studentProgressLoading.value = true
  try {
    const res = await getStudentProgressInCourse(course.value.id, studentId.value)
    if (res.code === 200) {
      studentCourseProgress.value = res.data
    } else {
      studentCourseProgress.value = null
    }
  } catch (err) {
    studentCourseProgress.value = null
  } finally {
    studentProgressLoading.value = false
  }
}

// 刷新进度数据
const refreshProgressData = async () => {
  console.log('刷新进度数据')
  if (isCourseTeacher.value) {
    await loadCourseStats()
  } else if (isStudent.value) {
    await loadStudentCourseProgress()
  }
}

// 页面加载时获取课程详情
onMounted(() => {
  fetchCourseDetail()
})

// 监听课程数据变化，加载进度数据
watch(course, (newCourse) => {
  if (newCourse) {
    // 加载进度数据
    if (isCourseTeacher.value) {
      loadCourseStats()
    } else if (isStudent.value) {
      loadStudentCourseProgress()
    }
  }
}, { immediate: true })

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