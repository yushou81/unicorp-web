<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="text-3xl font-bold mb-4">校企人才招聘平台</h1>
        <p class="text-lg opacity-90 mb-8 max-w-2xl">发现适合你的实习与就业机会，连接优质企业，开启职业发展新篇章</p>
        
        <!-- 搜索栏 -->
        <JobSearch 
          :locations="allLocations"
          :job-types="allJobTypes"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧筛选栏 -->
        <div class="lg:w-64 flex-shrink-0">
          <FilterSidebar 
            :categories="['技术开发', '产品设计', '市场营销', '运营管理', '人力资源']"
            :locations="allLocations"
            :job-types="allJobTypes"
            v-model:filters="filters"
          />
        </div>

        <!-- 右侧职位列表 -->
        <div class="flex-1">
          <JobList 
            :jobs="filteredJobs" 
            :current-page="currentPage"
            :total-pages="5"
            @collect="collectJob"
            @page-change="handlePageChange"
            @sort="handleSort"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import JobSearch from '@/components/job/JobSearch.vue'
import FilterSidebar from '@/components/job/FilterSidebar.vue'
import JobList from '@/components/job/JobList.vue'

// 搜索和筛选状态
const searchKeyword = ref('')
const selectedLocation = ref('')
const selectedJobType = ref('')
const currentPage = ref(1)
const sortOption = ref('latest')
const filters = ref({
  categories: [] as string[],
  locations: [] as string[],
  jobTypes: [] as string[],
  salary: ''
})

// 可选的地区和工作类型列表
const allLocations = ['北京', '上海', '深圳', '广州', '杭州', '成都', '南京', '武汉', '西安', '重庆']
const allJobTypes = ['实习', '校招', '全职', '兼职', '远程']

// 模拟职位数据
const jobs = [
  {
    id: 1,
    title: "前端开发工程师",
    company: "某某科技有限公司",
    location: "北京",
    salary: "15k-25k",
    type: "实习",
    education: "本科及以上",
    description: "负责公司产品的前端开发工作，要求熟悉Vue.js、React等前端框架，具有良好的编程习惯和团队协作能力。",
    tags: ["Vue.js", "React", "TypeScript", "前端开发"],
    isHot: true,
    isNew: true
  },
  {
    id: 2,
    title: "产品经理",
    company: "某某互联网公司",
    location: "上海",
    salary: "20k-35k",
    type: "校招",
    education: "本科及以上",
    description: "负责产品规划、需求分析、用户体验设计等工作，与开发团队紧密合作推进产品迭代。",
    tags: ["产品规划", "用户体验", "数据分析"],
    isHot: false,
    isNew: false
  },
  {
    id: 3,
    title: "UI设计师",
    company: "某某设计公司",
    location: "深圳",
    salary: "12k-20k",
    type: "实习",
    education: "大专及以上",
    description: "负责产品界面设计、视觉设计、交互设计等工作，打造优秀的用户体验。",
    tags: ["UI设计", "Figma", "用户体验"],
    isHot: false,
    isNew: true
  },
  {
    id: 4,
    title: "Java后端开发",
    company: "某某网络科技",
    location: "杭州",
    salary: "18k-30k",
    type: "校招",
    education: "本科及以上",
    description: "负责公司核心业务系统的设计和开发，参与架构设计和技术选型，解决高并发、大数据量的技术挑战。",
    tags: ["Java", "Spring Boot", "微服务", "MySQL"],
    isHot: true,
    isNew: false
  },
  {
    id: 5,
    title: "运营专员",
    company: "某某电子商务",
    location: "广州",
    salary: "8k-15k",
    type: "兼职",
    education: "不限",
    description: "负责公司产品的日常运营工作，包括内容策划、活动执行、用户增长等。",
    tags: ["内容运营", "用户增长", "活动策划"],
    isHot: false,
    isNew: true
  }
]

// 根据筛选条件过滤职位
const filteredJobs = computed(() => {
  return jobs.filter(job => {
    // 关键词搜索
    if (searchKeyword.value && !job.title.includes(searchKeyword.value) && 
        !job.company.includes(searchKeyword.value) && 
        !job.description.includes(searchKeyword.value)) {
      return false
    }
    
    // 地区筛选 - 下拉菜单
    if (selectedLocation.value && job.location !== selectedLocation.value) {
      return false
    }
    
    // 职位类型筛选 - 下拉菜单
    if (selectedJobType.value && job.type !== selectedJobType.value) {
      return false
    }
    
    // 职位类别筛选 - 复选框
    if (filters.value.categories.length > 0) {
      // 这里简化处理，实际项目中可能需要更复杂的匹配逻辑
      const matchesCategory = job.tags.some(tag => 
        filters.value.categories.includes(tag) || 
        filters.value.categories.some(cat => job.title.includes(cat))
      );
      if (!matchesCategory) return false;
    }
    
    // 地区筛选 - 复选框
    if (filters.value.locations.length > 0 && !filters.value.locations.includes(job.location)) {
      return false;
    }
    
    // 工作类型筛选 - 复选框
    if (filters.value.jobTypes.length > 0 && !filters.value.jobTypes.includes(job.type)) {
      return false;
    }
    
    // 薪资范围筛选
    if (filters.value.salary) {
      // 简化处理，实际项目中需要更精确的薪资范围比较
      const salary = job.salary.replace(/[^0-9-]/g, '');
      const [min, max] = salary.split('-').map(Number);
      
      switch(filters.value.salary) {
        case '0-5k':
          if (min > 5) return false;
          break;
        case '5k-10k':
          if (min > 10 || max < 5) return false;
          break;
        case '10k-15k':
          if (min > 15 || max < 10) return false;
          break;
        case '15k-20k':
          if (min > 20 || max < 15) return false;
          break;
        case '20k+':
          if (min < 20) return false;
          break;
      }
    }
    
    return true
  })
})

// 处理搜索
const handleSearch = (searchParams: { keyword: string, location: string, jobType: string }) => {
  searchKeyword.value = searchParams.keyword
  selectedLocation.value = searchParams.location
  selectedJobType.value = searchParams.jobType
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 处理排序
const handleSort = (option: string) => {
  sortOption.value = option
  // 实际项目中这里应该根据排序选项对数据进行排序
}

// 收藏职位
const collectJob = (jobId: number) => {
  console.log('收藏职位', jobId)
  // 实际项目中这里应该调用API进行收藏操作
}
</script> 