 <template>
  <div>
    <Navbar />
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{{ error }}</div>
      <template v-else-if="course">
        <!-- 面包屑导航 -->
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <router-link to="/" class="hover:text-blue-600">首页</router-link>
          <span class="mx-2">/</span>
          <router-link to="/classroom" class="hover:text-blue-600">双师课堂</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-700">课程详情</span>
        </div>
        
        <!-- 课程主信息卡片 -->
        <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}
                <span class="text-blue-500 ml-2 text-base">{{ courseTypeText(course.courseType) }}</span>
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div class="flex items-center"><span class="mr-1">📍</span>{{ course.location || '-' }}</div>
                <div class="flex items-center"><span class="mr-1">🕒</span>{{ new Date(course.scheduledTime).toLocaleString() }}</div>
                <div class="flex items-center"><span class="mr-1">👥</span>{{ course.enrolledCount }}/{{ course.maxStudents }}</div>
                <div class="flex items-center"><span class="mr-1">📅</span>{{ new Date(course.createdAt).toLocaleDateString() }}</div>
              </div>
              <div class="text-blue-600 text-xl font-medium">{{ statusText(course.status) }}</div>
            </div>
            <div class="flex space-x-3 mt-4 md:mt-0">
              <button 
                v-if="isTeacher"
                @click="showProgressManager = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                学习进度管理
              </button>
              <button 
                v-if="isStudent"
                @click="showStudentProgress = true"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                我的学习进度
              </button>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <!-- 左侧：课程详情/资源/评价 -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4">课程介绍</h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ course.description }}</p>
              </div>
            </div>
            
            <!-- 课程章节 -->
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-gray-900">课程章节</h2>
                <router-link 
                  :to="`/classroom/${course.id}/chapters`"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  查看全部章节
                </router-link>
              </div>
              <CourseChapters 
                :course-id="course.id" 
                :is-student="isStudent"
                :student-id="studentId"
                :is-enrolled="isEnrolled"
                :limit="3"
                @progress-refresh="refreshProgressData"
              />
            </div>
            
            <!-- 学习进度概览 -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-900">学习进度概览</h2>
                <div v-if="isTeacher" class="flex space-x-2">
                  <button 
                    @click="initializeAllStudentProgress"
                    :disabled="initializingProgress"
                    class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {{ initializingProgress ? '初始化中...' : '初始化学生进度' }}
                  </button>
                </div>
              </div>
              
              <template v-if="isTeacher">
                <div v-if="courseStatsLoading" class="py-8 flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div v-else-if="courseStats">
                  <!-- 主要统计指标 -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ courseStats.completionRate }}%</div>
                      <div class="text-sm text-gray-600 mt-1">完成率</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-green-600">{{ courseStats.averageProgress }}%</div>
                      <div class="text-sm text-gray-600 mt-1">平均进度</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-gray-800">{{ courseStats.totalStudents }}</div>
                      <div class="text-sm text-gray-600 mt-1">学生总数</div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                  暂无进度数据
                </div>
              </template>
              
              <template v-else-if="isStudent">
                <div v-if="studentProgressLoading" class="py-8 flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div v-else-if="studentCourseProgress && studentCourseProgress.length > 0">
                  <!-- 主要统计指标 -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-blue-600">
                        {{ Math.round(studentCourseProgress.reduce((sum, p) => sum + p.progressPercent, 0) / studentCourseProgress.length) }}%
                      </div>
                      <div class="text-sm text-gray-600 mt-1">总体进度</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-green-600">
                        {{ studentCourseProgress.filter(p => p.status === 'completed').length }}/{{ studentCourseProgress.length }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">已完成章节</div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                  暂无学习进度
                </div>
              </template>
              
              <template v-else>
                <div class="text-center text-gray-400 py-8">
                  请登录查看进度
                </div>
              </template>
            </div>
            
            <!-- 课程资源/评价可按需引入组件 -->
          </div>
          
          <!-- 右侧：教师/导师/课程信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4">讲师信息</h2>
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 text-xl">
                  {{ course.teacherName?.substring(0, 1) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ course.teacherName }}</div>
                  <div class="text-sm text-gray-500">高校教师</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4">企业导师信息</h2>
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 text-xl">
                  {{ course.mentorName?.substring(0, 1) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ course.mentorName }}</div>
                  <div class="text-sm text-gray-500">{{ course.enterpriseName }}</div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-5">
              <h2 class="text-lg font-bold text-gray-900 mb-4">课程信息</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">课程状态</div>
                  <div class="font-medium">{{ statusText(course.status) }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">已报名/总名额</div>
                  <div class="font-medium">{{ course.enrolledCount }}/{{ course.maxStudents }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-gray-600">授课方式</div>
                  <div class="font-medium">{{ courseTypeText(course.courseType) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CourseChapters from '@/components/classroom/CourseChapters.vue'
import { 
  getCourseById,
  getCourseProgressStatistics,
  getStudentProgressInCourse,
  initializeCourseProgressForAllStudents,
  checkStudentEnrollment,
  getStudentEnrolledCourses
} from '@/lib/api/classroom'

const route = useRoute()
const appStore = useAppStore()

const course = ref(null)
const loading = ref(true)
const error = ref('')
const isEnrolled = ref(false)
const courseStats = ref<any>(null)
const courseStatsLoading = ref(false)
const studentCourseProgress = ref<any>(null)
const studentProgressLoading = ref(false)
const initializingProgress = ref(false)

// 用户角色判断
const isTeacher = computed(() => {
  const role = appStore.user?.role
  return role === 'TEACHER' || role === 'teacher'
})

const isStudent = computed(() => {
  const role = appStore.user?.role
  return role === 'STUDENT' || role === 'student'
})

const studentId = computed(() => appStore.user?.id || 1)

function courseTypeText(type: string) {
  if (type === 'online') return '线上课程'
  if (type === 'offline') return '线下课程'
  if (type === 'hybrid') return '混合课程'
  return type
}

function statusText(status: string) {
  const map: Record<string, string> = {
    planning: '筹备中',
    open: '开放报名',
    in_progress: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

// 加载课程进度统计（教师端）
const loadCourseStats = async () => {
  if (!course.value?.id || !isTeacher.value) return
  courseStatsLoading.value = true
  try {
    const res = await getCourseProgressStatistics(course.value.id)
    console.log('CourseDetailView 接收到的进度统计:', res);
    if (res.code === 200) {
      courseStats.value = res.data
      console.log('CourseDetailView 设置的 courseStats:', courseStats.value);
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

// 批量初始化所有学生的学习进度
const initializeAllStudentProgress = async () => {
  if (!course.value?.id || !isTeacher.value) return
  
  if (!confirm('确定要初始化所有学生的学习进度吗？这将为所有已选课学生创建章节进度记录。')) {
    return
  }
  
  initializingProgress.value = true
  try {
    await initializeCourseProgressForAllStudents(course.value.id)
    alert('学生进度初始化成功！')
    // 重新加载进度统计
    await loadCourseStats()
  } catch (error: any) {
    console.error('初始化学生进度失败:', error)
    alert('初始化失败: ' + (error.message || '未知错误'))
  } finally {
    initializingProgress.value = false
  }
}

// 刷新进度数据
const refreshProgressData = async () => {
  console.log('刷新进度数据')
  if (isTeacher.value) {
    await loadCourseStats()
  } else if (isStudent.value) {
    await loadStudentCourseProgress()
  }
}

onMounted(async () => {
  try {
    const res = await getCourseById(Number(route.params.id))
    if (res.code === 200) {
      course.value = res.data
      
      // 检查用户是否已报名课程（仅学生调用）
      if (isStudent.value && appStore.user?.id) {
        try {
          console.log('CourseDetailView - 检查报名状态 - 用户ID:', appStore.user.id, '课程ID:', res.data.id)
          
          // 方法1：使用专门的检查接口
          const enrollmentResponse = await checkStudentEnrollment(res.data.id, appStore.user.id)
          console.log('CourseDetailView - 报名状态检查结果:', enrollmentResponse)
          
          // 如果检查接口失败，尝试方法2：获取已报名课程列表
          if (enrollmentResponse.code !== 200) {
            console.log('CourseDetailView - 检查接口失败，尝试获取已报名课程列表')
            const enrolledCoursesResponse = await getStudentEnrolledCourses(1, 100)
            if (enrolledCoursesResponse.code === 200 && enrolledCoursesResponse.data) {
              const isEnrolledInList = enrolledCoursesResponse.data.records.some(course => course.id === res.data.id)
              console.log('CourseDetailView - 从已报名课程列表检查结果:', isEnrolledInList)
              isEnrolled.value = isEnrolledInList
            } else {
              isEnrolled.value = false
            }
          } else {
            isEnrolled.value = enrollmentResponse.data
          }
          
          console.log('CourseDetailView - 最终设置 isEnrolled:', isEnrolled.value)
        } catch (err) {
          console.error('检查用户报名状态失败:', err)
          isEnrolled.value = false
        }
      }
      
      // 加载进度数据
      if (isTeacher.value) {
        loadCourseStats()
      } else if (isStudent.value) {
        loadStudentCourseProgress()
      }
    } else {
      error.value = res.message || '加载失败'
    }
  } catch (e) {
    console.error('加载课程详情错误:', e)
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
