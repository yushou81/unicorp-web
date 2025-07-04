<template>
    <div>
      
      <div class="container mx-auto px-6 py-12 max-w-7xl">
        <!-- 页面标题和操作 -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">企业成果浏览</h1>
            <p class="mt-2 text-lg text-gray-600">发现和联系优秀学生人才</p>
          </div>
          
          <!-- 操作区域 -->
          <div class="flex mt-4 md:mt-0 space-x-4">
            <button type="button" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              高级筛选
            </button>
            <!-- 删除审核按钮，企业用户不应该有权限审核学生成果 -->
          </div>
        </div>
        
        <!-- 筛选区域 -->
        <div class="bg-white rounded-xl shadow-md p-8 mb-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- 筛选控件 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">成果类型</label>
              <select
                v-model="filters.type"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部类型</option>
                <option value="portfolio">作品</option>
                <option value="award">获奖</option>
                <option value="research">科研成果</option>
              </select>
            </div>
            
            <!-- 移除认证状态筛选选项 -->
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">学校</label>
              <select
                v-model="filters.school"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部学校</option>
                <option v-for="school in schoolOptions" :key="school.id" :value="school.id">{{ school.name }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">专业方向</label>
              <select
                v-model="filters.major"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部专业</option>
                <option v-for="major in majorOptions" :key="major.id" :value="major.id">{{ major.name }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">学历层次</label>
              <select
                v-model="filters.educationLevel"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部学历</option>
                <option value="bachelor">本科</option>
                <option value="master">硕士</option>
                <option value="doctor">博士</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
              <div class="relative">
                <input
                  v-model="filters.keyword"
                  type="text"
                  placeholder="搜索成果标题、描述或学生姓名"
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end mt-8">
            <button 
              @click="handleReset" 
              class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置
            </button>
            <button 
              @click="handleApply" 
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              应用筛选
            </button>
          </div>
        </div>
        
        <!-- 成果列表区域 -->
        <div class="mb-8">
          <!-- 列表显示模式和排序 -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <span class="text-gray-700 mr-3">显示模式:</span>
              <button 
                @click="viewMode = 'grid'" 
                class="p-2 rounded-md" 
                :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'" 
                class="p-2 rounded-md" 
                :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <div class="flex items-center">
              <label class="text-gray-700 mr-3">排序方式:</label>
              <select 
                v-model="sortBy" 
                class="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">最新发布</option>
                <option value="popular">热门程度</option>
                <option value="relevant">相关程度</option>
              </select>
            </div>
          </div>
          
          <!-- 加载中状态 -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-r-transparent"></div>
            <span class="ml-3 text-gray-600 text-lg">加载中...</span>
          </div>
          
          <!-- 无数据状态 -->
          <div v-else-if="!achievements.length" class="bg-gray-50 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xl text-gray-600 mb-2">没有找到符合条件的成果</p>
            <p class="text-gray-500">尝试调整筛选条件或关键词</p>
          </div>
          
          <!-- 网格视图 -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border-t-4 overflow-hidden cursor-pointer"
              :class="{
                'border-t-blue-500': achievement.type === 'portfolio',
                'border-t-purple-500': achievement.type === 'award',
                'border-t-cyan-500': achievement.type === 'research'
              }"
              @click="viewAchievementDetail(achievement)"
            >
              <!-- 成果封面图 -->
              <div class="h-48 overflow-hidden bg-gray-100">
                <img 
                  :src="achievement.coverImageUrl || 'https://via.placeholder.com/600x400'" 
                  :alt="achievement.title" 
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- 成果内容 -->
              <div class="p-6 flex-grow flex flex-col">
                <div class="flex justify-between items-center mb-3">
                  <span 
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-full',
                      achievement.type === 'portfolio' ? 'bg-blue-100 text-blue-800' : 
                      achievement.type === 'award' ? 'bg-purple-100 text-purple-800' : 
                      'bg-cyan-100 text-cyan-800'
                    ]"
                  >
                    {{ 
                      achievement.type === 'portfolio' ? '作品' : 
                      achievement.type === 'award' ? '获奖' : '科研成果'
                    }}
                  </span>
                  <!-- 移除认证状态标签，因为企业只能看到已认证的成果 -->
                  <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    已认证
                  </span>
                </div>
                
                <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{{ achievement.title }}</h3>
                <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ achievement.description }}</p>
                
                <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div class="flex items-center">
                    <img 
                      :src="achievement.studentAvatarUrl || 'https://via.placeholder.com/40'" 
                      alt="学生头像" 
                      class="h-8 w-8 rounded-full mr-2"
                    />
                    <div>
                      <span class="text-xs text-gray-800 font-medium block">{{ achievement.studentName }}</span>
                      <span class="text-xs text-gray-500">{{ achievement.schoolName }}</span>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(achievement.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="space-y-6">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer p-6 border-l-4"
              :class="{
                'border-l-blue-500': achievement.type === 'portfolio',
                'border-l-purple-500': achievement.type === 'award',
                'border-l-cyan-500': achievement.type === 'research'
              }"
              @click="viewAchievementDetail(achievement)"
            >
              <div class="flex flex-col md:flex-row">
                <!-- 成果封面图 -->
                <div class="md:w-48 h-32 md:h-auto overflow-hidden bg-gray-100 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                  <img 
                    :src="achievement.coverImageUrl || 'https://via.placeholder.com/400x300'" 
                    :alt="achievement.title" 
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- 成果内容 -->
                <div class="flex-grow flex flex-col">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="text-xl font-bold text-gray-900">{{ achievement.title }}</h3>
                    <div class="flex space-x-2">
                      <span 
                        :class="[
                          'px-2.5 py-1 text-xs font-medium rounded-full',
                          achievement.type === 'portfolio' ? 'bg-blue-100 text-blue-800' : 
                          achievement.type === 'award' ? 'bg-purple-100 text-purple-800' : 
                          'bg-cyan-100 text-cyan-800'
                        ]"
                      >
                        {{ 
                          achievement.type === 'portfolio' ? '作品' : 
                          achievement.type === 'award' ? '获奖' : '科研成果'
                        }}
                      </span>
                      <!-- 移除认证状态标签，因为企业只能看到已认证的成果 -->
                      <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        已认证
                      </span>
                    </div>
                  </div>
                  
                  <p class="text-gray-600 mb-4 line-clamp-2">{{ achievement.description }}</p>
                  
                  <div class="mt-auto flex justify-between items-center">
                    <div class="flex items-center">
                      <img 
                        :src="achievement.studentAvatarUrl || 'https://via.placeholder.com/32'" 
                        alt="学生头像" 
                        class="h-8 w-8 rounded-full mr-2"
                      />
                      <div>
                        <span class="text-sm text-gray-800 font-medium">{{ achievement.studentName }}</span>
                        <span class="text-sm text-gray-500 mx-2">|</span>
                        <span class="text-sm text-gray-500">{{ achievement.schoolName }}</span>
                        <span class="text-sm text-gray-500 mx-2">|</span>
                        <span class="text-sm text-gray-500">{{ achievement.majorName }}</span>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(achievement.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="totalPages > 1" class="mt-10 flex justify-center">
            <Pagination 
              :current-page="currentPage" 
              :total-pages="totalPages" 
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Pagination from '@/components/ui/Pagination.vue'
  import { achievementApi } from '@/lib/api/achievement'
  
  const router = useRouter()
  const loading = ref(false)
  const showAdvancedFilters = ref(false)
  const selectedCategory = ref('all')
  const currentPage = ref(1)
  const totalPages = ref(1)
  
  // 统计数据
  const statistics = ref({
    total: 0,
    students: 0,
    topViews: 0
  })
  
  // 筛选条件
  const filters = ref({
    school: '',
    major: '',
    grade: '',
    keyword: '',
    startDate: '',
    endDate: '',
    sort: 'newest'
  })
  
  // 学校和专业选项
  const schoolOptions = ref([
    { id: 1, name: '北京大学' },
    { id: 2, name: '清华大学' },
    { id: 3, name: '复旦大学' },
    { id: 4, name: '浙江大学' },
    { id: 5, name: '南京大学' }
  ])
  
  const majorOptions = ref([
    { id: 1, name: '计算机科学与技术' },
    { id: 2, name: '人工智能' },
    { id: 3, name: '软件工程' },
    { id: 4, name: '数据科学与大数据技术' },
    { id: 5, name: '网络空间安全' }
  ])
  
  // 成果列表
  const achievements = ref([])
  
  // 选择分类
  const selectCategory = (category) => {
    selectedCategory.value = category
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 应用筛选
  const handleApply = () => {
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 重置筛选
  const handleReset = () => {
    filters.value = {
      type: '',
      school: '',
      major: '',
      educationLevel: '',
      keyword: '',
      startDate: '',
      endDate: '',
      sort: 'newest'
    }
    currentPage.value = 1
    fetchAchievements()
  }
  
  // 处理分页变化
  const handlePageChange = (page) => {
    currentPage.value = page
    fetchAchievements()
  }
  
  // 查看成果详情
  const viewAchievementDetail = (achievement) => {
    router.push(`/achievement/detail/${achievement.type}/${achievement.id}`)
  }
  
  // 获取成果列表
  const fetchAchievements = async () => {
    loading.value = true
    try {
      // 调用API获取成果列表，默认只获取已认证的成果
      const response = await achievementApi.getVerifiedEnterpriseList({
        page: currentPage.value,
        size: 10,
        type: filters.value.type,
        school: filters.value.school,
        major: filters.value.major,
        educationLevel: filters.value.educationLevel,
        keyword: filters.value.keyword
      })
      
      if (response && response.data) {
        achievements.value = response.data.records || []
        totalPages.value = response.data.pages || 1
      } else {
        achievements.value = []
        totalPages.value = 1
      }
    } catch (error) {
      console.error('获取成果列表失败:', error)
      achievements.value = []
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }
  
  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await achievementApi.getEnterpriseStatistics()
      
      if (response && response.data) {
        statistics.value = {
          total: response.data.totalAchievements || 0,
          students: response.data.totalStudents || 0,
          topViews: response.data.maxViews || 0
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }
  
  // 获取成果类型显示文本
  const getTypeText = (type) => {
    const typeMap = {
      'portfolio': '作品',
      'award': '获奖',
      'research': '科研成果'
    }
    return typeMap[type] || '其他'
  }
  
  // 获取成果类型样式
  const getTypeClass = (type) => {
    const classMap = {
      'portfolio': 'bg-green-600',
      'award': 'bg-yellow-500',
      'research': 'bg-indigo-600'
    }
    return classMap[type] || 'bg-gray-600'
  }
  
  // 获取默认封面图
  const getDefaultCover = (type) => {
    const coverMap = {
      'portfolio': 'https://via.placeholder.com/400x250?text=作品',
      'award': 'https://via.placeholder.com/400x250?text=获奖',
      'research': 'https://via.placeholder.com/400x250?text=科研成果'
    }
    return coverMap[type] || 'https://via.placeholder.com/400x250'
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }
  
  onMounted(() => {
    fetchStatistics()
    fetchAchievements()
  })
  </script>