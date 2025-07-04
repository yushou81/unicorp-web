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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { getCourseById } from '@/lib/api/classroom'

const route = useRoute()
const course = ref(null)
const loading = ref(true)
const error = ref('')

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

onMounted(async () => {
  try {
    const res = await getCourseById(route.params.id)
    course.value = res.data
  } catch (e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
