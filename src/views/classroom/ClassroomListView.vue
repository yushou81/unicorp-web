<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">双师课堂</h1>
        <p class="text-gray-600 mt-2">企业导师与高校教师共同授课，理论与实践相结合</p>
      </div>
      
      <!-- 筛选条件 -->
      <CourseFilter 
        :initial-filters="filters" 
        @apply="handleFilterApply" 
        @reset="handleFilterReset" 
      />
      
      <!-- 课程列表 -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      
      <div v-else-if="courses.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无符合条件的课程</h3>
        <p class="text-gray-500">请尝试调整筛选条件或稍后再试</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 课程卡片 -->
        <CourseCard 
          v-for="course in courses" 
          :key="course.id" 
          :course="course"
          @click="viewCourseDetail(course.id)"
        />
      </div>
      
      <!-- 分页 -->
      <div v-if="courses.length > 0" class="mt-8">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev="prevPage"
          @next="nextPage"
          @page="goToPage"
        />
      </div>
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
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import CourseCard from '@/components/classroom/CourseCard.vue'
import CourseFilter, { CourseFilters } from '@/components/classroom/CourseFilter.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { getEnrollableCourses, DualTeacherCourseVO } from '@/lib/api/classroom'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const courses = ref<DualTeacherCourseVO[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(9)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// 筛选条件
const filters = ref<CourseFilters>({
  keyword: '',
  category: '',
  status: '',
  courseType: ''
})

// 获取课程列表
const fetchCourses = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getEnrollableCourses(currentPage.value, pageSize.value)
    courses.value = response.data.records
    totalItems.value = response.data.total
    
    // 应用前端筛选（如果API不支持筛选，则在前端进行）
    if (filters.value.keyword || filters.value.category || filters.value.status || filters.value.courseType) {
      let filteredCourses = [...courses.value]
      
      if (filters.value.category) {
        filteredCourses = filteredCourses.filter(course => 
          // 这里需要根据实际API返回的数据结构进行调整
          course.description.toLowerCase().includes(filters.value.category.toLowerCase())
        )
      }
      
      if (filters.value.status) {
        filteredCourses = filteredCourses.filter(course => course.status === filters.value.status)
      }
      
      if (filters.value.courseType) {
        filteredCourses = filteredCourses.filter(course => course.courseType === filters.value.courseType)
      }
      
      if (filters.value.keyword) {
        const keyword = filters.value.keyword.toLowerCase()
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(keyword) || 
          course.teacherName.toLowerCase().includes(keyword) ||
          course.enterpriseName.toLowerCase().includes(keyword)
        )
      }
      
      courses.value = filteredCourses
    }
    
  } catch (err) {
    console.error('获取课程列表失败:', err)
    error.value = err instanceof Error ? err.message : '获取课程列表失败'
  } finally {
    loading.value = false
  }
}

// 处理筛选条件应用
const handleFilterApply = (newFilters: CourseFilters) => {
  filters.value = { ...newFilters }
  currentPage.value = 1 // 重置到第一页
  fetchCourses()
}

// 处理筛选条件重置
const handleFilterReset = () => {
  filters.value = {
    keyword: '',
    category: '',
    status: '',
    courseType: ''
  }
  currentPage.value = 1
  fetchCourses()
}

// 分页相关方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCourses()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCourses()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  fetchCourses()
}

// 查看课程详情
const viewCourseDetail = (id: number) => {
  router.push(`/classroom/${id}`)
}

// 页面加载时获取课程列表
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 