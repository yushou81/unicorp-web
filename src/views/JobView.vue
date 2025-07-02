<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <div class="container mx-auto px-2 py-6 max-w-screen-2xl">
      <!-- 页面标题 -->
      <div class="bg-blue-600 text-white rounded-lg p-6 mb-4">
        <h1 class="text-2xl font-bold mb-1">校企人才招聘平台</h1>
        <p class="text-base opacity-90">发现适合你的实习与就业机会，连接优质企业，开启职业发展新篇章</p>
        
        <!-- 搜索框 -->
        <div class="mt-4 flex">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索职位名称、公司或关键词" 
            class="flex-1 px-3 py-2 rounded-l-lg text-gray-800 focus:outline-none"
            @keyup.enter="handleSearch"
          />
          <button 
            @click="handleSearch" 
            class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-r-lg flex items-center justify-center"
          >
            <SearchIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- 筛选选项区域 -->
      <div class="mb-4 flex flex-wrap justify-start gap-2">
        <div class="w-32">
          <JobTypeSelector 
            v-model="filters.jobType"
            placeholder="职位类型"
            @change="applyFilters"
          />
        </div>
        <div class="w-32">
          <CitySelector 
            v-model="filters.location"
            placeholder="城市"
            @change="applyFilters"
          />
        </div>
        <div class="w-32">
          <EducationSelector 
            v-model="filters.educationRequirement"
            placeholder="学历要求"
            @change="applyFilters"
          />
        </div>
        <div class="w-32">
          <SalarySelector 
            v-model="filters.salaryMin"
            v-model:max="filters.salaryMax"
            placeholder="薪资范围"
            @change="applyFilters"
          />
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 职位列表区域 -->
        <div class="flex-1">
          <GridJobList
            :jobs="sortedJobs"
            :loading="loading"
            :total-jobs="totalJobs"
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="handlePageChange"
            @update:sort-by="handleSortChange"
          />
        </div>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import GridJobList from '@/components/job/GridJobList.vue'
import JobTypeSelector from '@/components/job/JobTypeSelector.vue'
import CitySelector from '@/components/job/CitySelector.vue'
import EducationSelector from '@/components/job/EducationSelector.vue'
import SalarySelector from '@/components/job/SalarySelector.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { Job } from '@/lib/api/job'
import { getJobs } from '@/lib/api/job'

// 搜索和筛选
const searchQuery = ref('')
const filters = reactive({
  jobType: '',
  location: '',
  educationRequirement: '',
  salaryMin: undefined as number | undefined,
  salaryMax: undefined as number | undefined
})

// 分页和排序
const currentPage = ref(1)
const pageSize = ref(9) // 每页显示9个职位
const sortBy = ref('latest')
const isChangingSort = ref(false) // 标记是否正在切换排序方式
const filterDebounceTimer = ref<number | null>(null) // 用于存储防抖定时器ID

// 数据状态
const jobs = ref<Job[]>([])
const totalJobs = ref(0)
const loading = ref(false) // 保留loading状态，但默认为false

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalJobs.value / pageSize.value)
})

// 本地排序的职位列表
const sortedJobs = computed(() => {
  if (jobs.value.length === 0) return []
  
  // 创建数组副本以进行排序
  const sortedArray = [...jobs.value]
  
  switch (sortBy.value) {
    case 'latest':
      // 按创建时间降序排序（最新的在前面）
      return sortedArray.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'salary':
      // 按薪资从低到高排序
      return sortedArray.sort((a, b) => {
        const aMin = a.salaryMin || 0
        const bMin = b.salaryMin || 0
        return aMin - bMin
      })
    case 'salary-desc':
      // 按薪资从高到低排序
      return sortedArray.sort((a, b) => {
        const aMax = a.salaryMax || a.salaryMin || 0
        const bMax = b.salaryMax || b.salaryMin || 0
        return bMax - aMax
      })
    default:
      return sortedArray
  }
})

// 获取职位数据
const fetchJobs = async () => {
  loading.value = true // 开始加载
  try {
    const response = await getJobs({
      page: currentPage.value,
      size: pageSize.value,
      sortBy: sortBy.value,
      keyword: searchQuery.value,
      jobType: filters.jobType || undefined,
      location: filters.location || undefined,
      educationRequirement: filters.educationRequirement || undefined,
      salaryMin: filters.salaryMin || undefined,
      salaryMax: filters.salaryMax || undefined
    })
    
    // 确保响应数据符合预期结构
    if (response.code === 200 && response.data) {
      jobs.value = response.data.records || []
      totalJobs.value = response.data.total || 0
      
      // 后端API页码从1开始，与前端页码一致，无需转换
      const apiCurrentPage = response.data.current;
      console.log(`[fetchJobs] API返回的页码=${apiCurrentPage}, 前端页码=${currentPage.value}`);
      
      // 只有当API返回的页码与前端请求的页码不一致时，才更新前端页码
      // 这避免了无限循环的问题
      if (apiCurrentPage !== currentPage.value) {
        currentPage.value = apiCurrentPage;
      }
    } else {
      console.error('获取职位列表响应格式错误:', response)
      jobs.value = []
      totalJobs.value = 0
    }
  } catch (error) {
    console.error('获取职位列表失败:', error)
    jobs.value = []
    totalJobs.value = 0
  } finally {
    loading.value = false // 结束加载
    isChangingSort.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置页码
  fetchJobs()
}

// 处理筛选变化
const applyFilters = () => {
  currentPage.value = 1 // 重置页码
  fetchJobs()
}

// 处理页码变化
const handlePageChange = (page: number) => {
  // 如果页码无效或与当前页码相同，则不执行任何操作
  if (!page || page === currentPage.value || page < 1 || page > totalPages.value) {
    console.log(`[handlePageChange] 无效页码: ${page}, 当前页码: ${currentPage.value}, 总页数: ${totalPages.value}`)
    return;
  }
  
  console.log(`[handlePageChange] 页码变化: ${currentPage.value} -> ${page}, 总页数: ${totalPages.value}`)
  
  // 滚动到页面顶部，提供更好的用户体验
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // 更新当前页码并获取新数据
  currentPage.value = page;
  fetchJobs();
}

// 处理排序变化
const handleSortChange = (sort: string) => {
  if (sortBy.value === sort) return
  
  isChangingSort.value = true
  sortBy.value = sort
  
  // 如果是第一页，直接获取新数据
  if (currentPage.value === 1) {
    fetchJobs()
  } else {
    // 如果不是第一页，先重置到第一页，然后获取数据
    currentPage.value = 1
    fetchJobs()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchJobs()
})

// 监听筛选条件变化，自动触发筛选
watch(
  [
    () => filters.jobType,
    () => filters.location,
    () => filters.educationRequirement,
    () => filters.salaryMin,
    () => filters.salaryMax
  ],
  () => {
    // 当筛选条件变化时，重置页码并获取新数据
    // 这里我们使用防抖处理，避免频繁触发请求
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
    
    // 使用setTimeout实现简单的防抖
    if (filterDebounceTimer.value) {
      clearTimeout(filterDebounceTimer.value);
    }
    
    filterDebounceTimer.value = window.setTimeout(() => {
      fetchJobs();
    }, 300);
  },
  { deep: true }
)
</script>

<style scoped>
/* 添加过渡效果 */
.grid {
  transition: opacity 0.3s ease;
}
.grid-enter-from, .grid-leave-to {
  opacity: 0;
}
.grid-enter-to, .grid-leave-from {
  opacity: 1;
}
</style> 