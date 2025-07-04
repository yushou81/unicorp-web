<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold">资源共享中心</h1>
          <router-link 
            v-if="isTeacherOrMentor"
            to="/resource/upload" 
            class="px-4 py-2 bg-white text-blue-700 font-semibold rounded-md hover:bg-blue-50 transition-colors"
          >
            上传资源
          </router-link>
        </div>
        <p class="text-lg opacity-90 mb-8 max-w-2xl">探索科研设备、课程资料与知识产权资源，促进校内资源高效共享与交流</p>
        
        <!-- 搜索栏 -->
        <ResourceSearch 
          :resource-types="allResourceTypes"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧筛选栏 -->
        <div class="lg:w-64 flex-shrink-0">
          <ResourceFilterSidebar 
            :resource-types="allResourceTypes"
            :stats="resourceStats"
            v-model:filters="filters"
          />
        </div>

        <!-- 右侧资源列表 -->
        <div class="flex-1">
          <ResourceList 
            :resources="filteredResources" 
            :current-page="currentPage"
            :total-pages="totalPages"
            @collect="collectResource"
            @page-change="handlePageChange"
            @sort="handleSort"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import ResourceSearch from '@/components/resource/ResourceSearch.vue'
import ResourceFilterSidebar from '@/components/resource/ResourceFilterSidebar.vue'
import ResourceList from '@/components/resource/ResourceList.vue'
import { getResources, collectResource as apiCollectResource } from '@/lib/api/resource'
import { useAppStore } from '@/stores/app'

// 应用状态
const appStore = useAppStore()

// 检查用户角色
const userRole = computed(() => (appStore.user as any)?.role || '')
const isTeacherOrMentor = computed(() => ['TEACHER', 'MENTOR'].includes(userRole.value))

// 搜索和筛选状态
const searchKeyword = ref('')
const selectedResourceType = ref('')
const currentPage = ref(1)
const totalPages = ref(5)
const sortOption = ref('latest')
const filters = ref({
  resourceTypes: [] as string[]
})

// 资源类型列表
const allResourceTypes = ['实验设备', '技术文档', '数据集', '教学案例', '课件', '精品课程', '著作权', '专利']

// 资源数据
const resources = ref<any[]>([])

// 资源统计
const resourceStats = ref({
  total: 0,
  available: 0,
  newThisMonth: 0
})

// 根据筛选条件过滤资源
const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    // 关键词搜索
    if (searchKeyword.value && 
        !resource.title.includes(searchKeyword.value) && 
        !resource.provider?.includes(searchKeyword.value) && 
        !resource.description?.includes(searchKeyword.value) && 
        !resource.organizationName?.includes(searchKeyword.value)) {
      return false
    }
    
    // 资源类型筛选 - 下拉菜单
    if (selectedResourceType.value && resource.resourceType !== selectedResourceType.value) {
      return false
    }
    
    // 资源类型筛选 - 复选框
    if (filters.value.resourceTypes.length > 0 && !filters.value.resourceTypes.includes(resource.resourceType)) {
      return false
    }
    
    return true
  })
})

// 处理搜索
const handleSearch = (searchParams: { keyword: string, resourceType: string }) => {
  searchKeyword.value = searchParams.keyword
  selectedResourceType.value = searchParams.resourceType
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

// 收藏资源
const collectResource = async (resourceId: number) => {
  try {
    console.log('收藏资源', resourceId)
    await apiCollectResource(resourceId)
    alert('收藏成功')
  } catch (error) {
    console.error('收藏资源失败:', error)
    alert('收藏失败，请稍后重试')
  }
}

// 加载资源数据
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)

const fetchResources = async () => {
  try {
    loading.value = true
    
    // 构建查询参数
    const queryParams: any = {
      page: currentPage.value,  // 服务器使用1-based分页
      size: pageSize.value,
      keyword: searchKeyword.value
    }
    
    // 添加资源类型筛选 - 下拉菜单
    if (selectedResourceType.value) {
      queryParams.type = selectedResourceType.value
    }
    
    // 添加来自复选框的筛选条件 - 资源类型
    if (filters.value.resourceTypes.length > 0) {
      queryParams.type = filters.value.resourceTypes.join(',')
    }
    
    console.log('查询参数:', queryParams)
    const response = await getResources(queryParams)
    
    console.log('API响应:', response)
    
    if (response && response.code === 200 && response.data && response.data.records) {
      // 处理API返回的数据
      resources.value = response.data.records.map((item: any) => ({
        ...item,
        // 根据创建时间判断是否为新资源（7天内）
        isNew: new Date(item.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
        // 这里可以添加其他字段映射，例如从resourceType判断类别
        category: getCategoryFromResourceType(item.resourceType),
        // 假设热门资源由后端标记或根据某些规则确定
        isHot: item.isHot || false,
        // 临时使用的状态和使用方式，实际应从API获取
        status: item.status || '可用',
        usage: item.visibility === 'public' ? '免费使用' : '需申请',
        // 将nickname作为提供者
        provider: item.authorName || item.nickname || item.organizationName
      }))
      
      total.value = response.data.total
      totalPages.value = response.data.pages
      
      // 更新资源统计数据
      resourceStats.value.total = response.data.total
      resourceStats.value.available = resources.value.filter(r => r.status === '可用').length
      
      // 计算本月新增
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      resourceStats.value.newThisMonth = resources.value.filter(r => 
        new Date(r.createdAt) >= startOfMonth
      ).length
    } else {
      console.error('API返回数据格式不符合预期:', response)
      resources.value = [] // 清空资源列表
      total.value = 0
      totalPages.value = 0
      resourceStats.value = { total: 0, available: 0, newThisMonth: 0 }
    }
  } catch (error) {
    console.error('获取资源列表失败:', error)
    resources.value = [] // 发生错误时清空资源列表
  } finally {
    loading.value = false
  }
}

// 根据资源类型推断分类
const getCategoryFromResourceType = (type: string) => {
  const typeMap: Record<string, string> = {
    '实验设备': '科研设备',
    '数据集': '科研数据',
    '技术手册': '技术文档',
    '课件': '精品课程',
    '视频': '精品课程',
    '专利文献': '专利',
    '论文': '技术文档',
    '软件': '其他'
  }
  return typeMap[type] || '其他'
}

// 监听筛选条件变化，重新加载数据
watch([currentPage, searchKeyword, selectedResourceType, filters, sortOption], () => {
  fetchResources()
})

// 组件挂载时加载资源数据
onMounted(() => {
  fetchResources()
})
</script> 