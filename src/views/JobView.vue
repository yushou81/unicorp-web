<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">校企招聘平台</h1>
        <p class="text-xl text-gray-600 mb-6">
          发现适合你的实习与就业机会
        </p>
        
        <!-- 搜索栏 -->
        <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-wrap gap-3">
          <input 
            type="text" 
            v-model="searchKeyword"
            placeholder="职位名称或关键词"
            class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            v-model="selectedLocation" 
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有地区</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="深圳">深圳</option>
            <option value="广州">广州</option>
            <option value="杭州">杭州</option>
          </select>
          <select 
            v-model="selectedJobType" 
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有类型</option>
            <option value="实习">实习</option>
            <option value="校招">校招</option>
            <option value="全职">全职</option>
            <option value="兼职">兼职</option>
          </select>
          <Button @click="searchJobs" class="bg-blue-600 hover:bg-blue-700">搜索</Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 筛选侧边栏 -->
        <div class="space-y-6">
          <!-- 职位类别 -->
          <Card>
            <CardHeader>
              <CardTitle>职位类别</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="rounded text-blue-600" v-model="filters.categories" value="技术开发" />
                  <span>技术开发</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="rounded text-blue-600" v-model="filters.categories" value="产品设计" />
                  <span>产品设计</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="rounded text-blue-600" v-model="filters.categories" value="市场营销" />
                  <span>市场营销</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="rounded text-blue-600" v-model="filters.categories" value="运营管理" />
                  <span>运营管理</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" class="rounded text-blue-600" v-model="filters.categories" value="人力资源" />
                  <span>人力资源</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <!-- 薪资范围 -->
          <Card>
            <CardHeader>
              <CardTitle>薪资范围</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="salary" class="text-blue-600" v-model="filters.salary" value="0-5k" />
                  <span>5k以下</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="salary" class="text-blue-600" v-model="filters.salary" value="5k-10k" />
                  <span>5k-10k</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="salary" class="text-blue-600" v-model="filters.salary" value="10k-15k" />
                  <span>10k-15k</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="salary" class="text-blue-600" v-model="filters.salary" value="15k-20k" />
                  <span>15k-20k</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="salary" class="text-blue-600" v-model="filters.salary" value="20k+" />
                  <span>20k以上</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <!-- 统计数据 -->
          <Card>
            <CardHeader>
              <CardTitle>招聘统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span>发布职位</span>
                  <span class="font-semibold">156</span>
                </div>
                <div class="flex justify-between">
                  <span>合作企业</span>
                  <span class="font-semibold">42</span>
                </div>
                <div class="flex justify-between">
                  <span>成功就业</span>
                  <span class="font-semibold">89</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 职位列表 -->
        <div class="lg:col-span-3">
          <!-- 排序选项 -->
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-500">
              共找到 <span class="font-semibold text-blue-600">{{ filteredJobs.length }}</span> 个职位
            </div>
            <select 
              v-model="sortOption" 
              class="text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="latest">最新发布</option>
              <option value="salary-high">薪资从高到低</option>
              <option value="salary-low">薪资从低到高</option>
            </select>
          </div>
          
          <!-- 职位卡片列表 -->
          <div class="space-y-4">
            <div 
              v-for="job in filteredJobs" 
              :key="job.id"
              class="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <h3 class="font-semibold text-lg text-gray-900">{{ job.title }}</h3>
                    <span v-if="job.isHot" class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热门</span>
                    <span v-if="job.isNew" class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新发布</span>
                  </div>
                  
                  <p class="text-blue-600 font-medium mb-2">{{ job.company }}</p>
                  
                  <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                    <div class="flex items-center">
                      <MapPinIcon class="w-4 h-4 mr-1" />
                      <span>{{ job.location }}</span>
                    </div>
                    <div class="flex items-center">
                      <BanknoteIcon class="w-4 h-4 mr-1" />
                      <span>{{ job.salary }}</span>
                    </div>
                    <div class="flex items-center">
                      <BriefcaseIcon class="w-4 h-4 mr-1" />
                      <span>{{ job.type }}</span>
                    </div>
                    <div class="flex items-center">
                      <GraduationCapIcon class="w-4 h-4 mr-1" />
                      <span>{{ job.education }}</span>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 mb-3 line-clamp-2">{{ job.description }}</p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(tag, index) in job.tags" 
                      :key="index"
                      class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                
                <div class="flex flex-col items-end space-y-2">
                  <router-link :to="`/job/${job.id}`">
                    <Button size="sm">查看详情</Button>
                  </router-link>
                  <Button variant="outline" size="sm" @click="collectJob(job.id)">
                    <BookmarkIcon class="w-4 h-4 mr-1" />
                    收藏
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="flex justify-center mt-8">
            <div class="flex space-x-1">
              <button class="px-3 py-1 rounded border" :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'">&lt;</button>
              <button v-for="page in 5" :key="page" class="px-3 py-1 rounded border" :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'">{{ page }}</button>
              <button class="px-3 py-1 rounded border bg-white hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { MapPinIcon, BriefcaseIcon, BanknoteIcon, BookmarkIcon, GraduationCapIcon } from 'lucide-vue-next'

// 搜索和筛选状态
const searchKeyword = ref('')
const selectedLocation = ref('')
const selectedJobType = ref('')
const currentPage = ref(1)
const sortOption = ref('latest')
const filters = ref({
  categories: [],
  salary: ''
})

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
    
    // 地区筛选
    if (selectedLocation.value && job.location !== selectedLocation.value) {
      return false
    }
    
    // 职位类型筛选
    if (selectedJobType.value && job.type !== selectedJobType.value) {
      return false
    }
    
    // 更多筛选条件可以在这里添加
    
    return true
  })
})

// 搜索职位
const searchJobs = () => {
  console.log('搜索职位', {
    keyword: searchKeyword.value,
    location: selectedLocation.value,
    jobType: selectedJobType.value
  })
  // 实际项目中这里应该调用API获取数据
}

// 收藏职位
const collectJob = (jobId: number) => {
  console.log('收藏职位', jobId)
  // 实际项目中这里应该调用API进行收藏操作
}
</script> 