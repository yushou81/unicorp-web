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
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">课程分类</label>
            <select v-model="filters.category" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部分类</option>
              <option value="technology">技术开发</option>
              <option value="design">设计创意</option>
              <option value="management">管理营销</option>
              <option value="finance">金融财会</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">课程状态</label>
            <select v-model="filters.status" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部状态</option>
              <option value="upcoming">即将开始</option>
              <option value="ongoing">进行中</option>
              <option value="completed">已结束</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">授课方式</label>
            <select v-model="filters.mode" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部方式</option>
              <option value="online">线上授课</option>
              <option value="offline">线下授课</option>
              <option value="hybrid">线上+线下</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
            <div class="relative">
              <input 
                v-model="filters.keyword" 
                type="text" 
                placeholder="搜索课程名称、讲师" 
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50">重置</button>
          <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">筛选</button>
        </div>
      </div>
      
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
        <div 
          v-for="course in courses" 
          :key="course.id" 
          class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewCourseDetail(course.id)"
        >
          <img :src="course.coverImage" :alt="course.title" class="w-full h-48 object-cover" />
          <div class="p-5">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-bold text-gray-900 line-clamp-2">{{ course.title }}</h3>
              <span 
                :class="getStatusClass(course.status)" 
                class="text-xs px-2 py-1 rounded-full"
              >
                {{ getStatusText(course.status) }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ course.description }}</p>
            
            <div class="flex items-center mb-3">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-sm text-gray-700">{{ course.teacherName }}</span>
              </div>
              <span class="mx-2 text-gray-300">|</span>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-700">{{ course.enterpriseName }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-700">{{ formatDate(course.startDate) }}</span>
              </div>
              <span 
                :class="getModeClass(course.mode)" 
                class="text-xs px-2 py-1 rounded-full"
              >
                {{ getModeText(course.mode) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="courses.length > 0" class="mt-8 flex justify-center">
        <nav class="flex items-center">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border border-gray-300 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <div class="flex space-x-1">
            <button 
              v-for="page in displayedPages" 
              :key="page" 
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-md',
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border border-gray-300 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </nav>
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

// 定义课程接口
interface Course {
  id: number
  title: string
  description: string
  coverImage: string
  teacherName: string
  enterpriseName: string
  status: string // upcoming, ongoing, completed
  mode: string // online, offline, hybrid
  startDate: string
  endDate: string
  category: string
}

const router = useRouter()
const loading = ref(true)
const error = ref('')
const courses = ref<Course[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(9)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// 筛选条件
const filters = ref({
  keyword: '',
  category: '',
  status: '',
  mode: ''
})

// 临时数据 - 实际项目中应该从API获取
const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Web前端开发实战',
    description: '本课程由企业资深前端工程师与高校教师共同授课，涵盖HTML5、CSS3、JavaScript等核心技术，以及React、Vue等主流框架的实战应用。',
    coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '张教授 & 李工程师',
    enterpriseName: '科技创新有限公司',
    status: 'upcoming',
    mode: 'hybrid',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    category: 'technology'
  },
  {
    id: 2,
    title: 'UI/UX设计与用户体验',
    description: '由知名设计公司设计总监与高校设计学院教授共同打造的设计课程，从理论到实践，全面提升学生的设计思维和实战能力。',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHVpJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '王教授 & 陈设计师',
    enterpriseName: '创意设计工作室',
    status: 'ongoing',
    mode: 'online',
    startDate: '2024-06-01',
    endDate: '2024-08-30',
    category: 'design'
  },
  {
    id: 3,
    title: '数据分析与商业智能',
    description: '结合企业真实业务场景，教授数据分析方法、工具使用和商业洞察，由高校统计学教授和企业数据科学家联合授课。',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGF0YSUyMGFuYWx5c2lzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '刘教授 & 赵数据科学家',
    enterpriseName: '数智科技有限公司',
    status: 'completed',
    mode: 'offline',
    startDate: '2024-03-10',
    endDate: '2024-05-30',
    category: 'management'
  },
  {
    id: 4,
    title: '人工智能与机器学习基础',
    description: '由高校计算机科学教授和AI企业技术专家共同讲授，介绍人工智能基础理论和实际应用案例，包含编程实践环节。',
    coverImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '钱教授 & 孙工程师',
    enterpriseName: '智能科技有限公司',
    status: 'upcoming',
    mode: 'hybrid',
    startDate: '2024-08-01',
    endDate: '2024-11-30',
    category: 'technology'
  },
  {
    id: 5,
    title: '金融投资与风险管理',
    description: '由金融学院教授和投资银行高管共同授课，讲解金融市场、投资策略和风险控制，结合实际案例分析。',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluYW5jZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '周教授 & 吴投资总监',
    enterpriseName: '财富投资管理公司',
    status: 'ongoing',
    mode: 'online',
    startDate: '2024-05-15',
    endDate: '2024-07-15',
    category: 'finance'
  },
  {
    id: 6,
    title: '产品经理实战训练营',
    description: '由资深产品经理和高校管理学教授联合打造，从需求分析到产品规划，全方位培养产品思维和实操能力。',
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdCUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    teacherName: '郑教授 & 冯产品总监',
    enterpriseName: '创新产品设计公司',
    status: 'upcoming',
    mode: 'offline',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    category: 'management'
  }
]

// 获取课程列表
const fetchCourses = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 根据筛选条件过滤数据
    let filteredCourses = [...mockCourses]
    
    if (filters.value.category) {
      filteredCourses = filteredCourses.filter(course => course.category === filters.value.category)
    }
    
    if (filters.value.status) {
      filteredCourses = filteredCourses.filter(course => course.status === filters.value.status)
    }
    
    if (filters.value.mode) {
      filteredCourses = filteredCourses.filter(course => course.mode === filters.value.mode)
    }
    
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(keyword) || 
        course.teacherName.toLowerCase().includes(keyword) ||
        course.enterpriseName.toLowerCase().includes(keyword)
      )
    }
    
    // 更新总数量
    totalItems.value = filteredCourses.length
    
    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    courses.value = filteredCourses.slice(start, end)
    
  } catch (err) {
    console.error('获取课程列表失败:', err)
    error.value = err instanceof Error ? err.message : '获取课程列表失败'
  } finally {
    loading.value = false
  }
}

// 应用筛选条件
const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
  fetchCourses()
}

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    keyword: '',
    category: '',
    status: '',
    mode: ''
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

// 计算显示哪些页码按钮
const displayedPages = computed(() => {
  const maxDisplayed = 5 // 最多显示5个页码
  const pages: number[] = []
  
  if (totalPages.value <= maxDisplayed) {
    // 如果总页数小于等于5，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于5，显示当前页附近的页码
    let start = Math.max(currentPage.value - 2, 1)
    let end = start + maxDisplayed - 1
    
    if (end > totalPages.value) {
      end = totalPages.value
      start = Math.max(end - maxDisplayed + 1, 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// 查看课程详情
const viewCourseDetail = (id: number) => {
  router.push(`/classroom/${id}`)
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取状态文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return '即将开始'
    case 'ongoing':
      return '进行中'
    case 'completed':
      return '已结束'
    default:
      return '未知状态'
  }
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700'
    case 'ongoing':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取授课方式文本
const getModeText = (mode: string): string => {
  switch (mode) {
    case 'online':
      return '线上授课'
    case 'offline':
      return '线下授课'
    case 'hybrid':
      return '线上+线下'
    default:
      return '未知方式'
  }
}

// 获取授课方式样式类
const getModeClass = (mode: string): string => {
  switch (mode) {
    case 'online':
      return 'bg-indigo-100 text-indigo-700'
    case 'offline':
      return 'bg-orange-100 text-orange-700'
    case 'hybrid':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

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