<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { portfolioApi, type PortfolioItemVO, type PortfolioResourceVO } from '@/lib/api/achievement'
import AddAchievementModal from '@/components/achievement/AddAchievementModal.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const portfolio = ref<PortfolioItemVO | null>(null)
const resources = ref<PortfolioResourceVO[]>([])

// 判断是否为作者（从路由参数获取）
const isAuthor = computed(() => {
  return route.query.isAuthor === 'true'
})

const fetchPortfolioDetail = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  loading.value = true
  error.value = ''
  try {
    const portfolioResponse = await portfolioApi.getPortfolioItemDetail(id)
    
    if (portfolioResponse.data) {
      portfolio.value = portfolioResponse.data
      // 如果portfolio中包含resources，则直接使用
      if (portfolioResponse.data.resources) {
        resources.value = portfolioResponse.data.resources
      }
    }
  } catch (err: any) {
    console.error('获取作品详情失败:', err)
    if (err.message === '作品不存在') {
      error.value = '抱歉，您访问的作品不存在或已被删除'
      router.push('/achievement') // 3秒后自动跳转回成就列表页
      setTimeout(() => {
        router.push('/achievement')
      }, 3000)
    } else {
      error.value = err.message || '获取作品详情失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

// 删除作品
const handleDelete = async () => {
  if (!portfolio.value?.id) return
  
  if (!confirm('确定要删除这个作品吗？')) return
  
  loading.value = true
  try {
    await portfolioApi.deletePortfolioItem(portfolio.value.id)
    router.push('/achievement')
  } catch (err: any) {
    error.value = err.message || '删除失败'
  } finally {
    loading.value = false
  }
}

// 控制编辑弹窗
const showEditModal = ref(false)

// 处理编辑弹窗关闭
const handleEditModalClose = () => {
  showEditModal.value = false
}

// 处理编辑弹窗提交
const handleEditModalSubmit = async (data: any) => {
  if (!portfolio.value?.id) return
  
  loading.value = true
  error.value = ''
  try {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else {
          formData.append(key, String(value))
        }
      }
    })

    await portfolioApi.updatePortfolioItem(portfolio.value.id, formData)
    showEditModal.value = false
    await fetchPortfolioDetail() // 刷新数据
  } catch (err: any) {
    error.value = err.message || '更新失败'
  } finally {
    loading.value = false
  }
}

// 编辑作品
const handleEdit = () => {
  showEditModal.value = true
}

// 上传资源
const handleUploadResource = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !portfolio.value?.id) return
  
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('resourceType', file.type)
  
  loading.value = true
  try {
    await portfolioApi.uploadPortfolioResource(portfolio.value.id, formData)
    await fetchPortfolioDetail()
  } catch (err: any) {
    error.value = err.message || '上传失败'
  } finally {
    loading.value = false
    input.value = ''  // 清空input
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchPortfolioDetail()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div v-else-if="portfolio" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- 操作按钮 - 仅作者可见 -->
      <div v-if="isAuthor" class="px-6 py-4 bg-gray-50 border-b flex justify-end space-x-4">
        <input
          type="file"
          id="resourceUpload"
          class="hidden"
          @change="handleUploadResource"
        />
        <label
          for="resourceUpload"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          上传资源
        </label>
        <button
          @click="handleEdit"
          class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          编辑
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          删除
        </button>
      </div>

      <div class="px-6 py-4">
        <!-- 作品基本信息 -->
        <div class="mb-8">
          <div class="flex justify-between items-start">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ portfolio.title }}</h1>
            <span 
              class="px-2 py-1 rounded-full text-xs"
              :class="portfolio.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ portfolio.isPublic ? '公开' : '不公开' }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-sm text-gray-500 mt-2">
            <span>创建时间：{{ formatDate(portfolio.createdAt) }}</span>
            <span>浏览：{{ portfolio.viewCount }}</span>
            <span>点赞：{{ portfolio.likeCount }}</span>
            <span>更新时间：{{ formatDate(portfolio.updatedAt) }}</span>
          </div>
        </div>

        <!-- 作品详情 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
            <div class="space-y-3">
              <div class="flex">
                <span class="w-24 text-gray-500">作者</span>
                <span class="text-gray-800">{{ portfolio.userName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">所属组织</span>
                <span class="text-gray-800">{{ portfolio.organizationName }}</span>
              </div>
              <div class="flex">
                <span class="w-24 text-gray-500">分类</span>
                <span class="text-gray-800">{{ portfolio.category }}</span>
              </div>
              <div v-if="portfolio.teamMembers" class="flex">
                <span class="w-24 text-gray-500">团队成员</span>
                <span class="text-gray-800">{{ portfolio.teamMembers }}</span>
              </div>
            </div>
          </div>
          
          <!-- 封面图片 -->
          <div v-if="portfolio.coverImageUrl" class="flex justify-center items-center">
            <img 
              :src="portfolio.coverImageUrl" 
              alt="作品封面" 
              class="max-w-full max-h-64 rounded-lg shadow-sm object-contain"
            >
          </div>
        </div>

        <!-- 作品描述 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">作品描述</h3>
          <p class="text-gray-600 whitespace-pre-line">{{ portfolio.description }}</p>
        </div>

        <!-- 项目链接 -->
        <div v-if="portfolio.projectUrl" class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">项目链接</h3>
          <a 
            :href="portfolio.projectUrl" 
            target="_blank" 
            class="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {{ portfolio.projectUrl }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- 标签 -->
        <div v-if="portfolio.tags && portfolio.tags.length > 0" class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in portfolio.tags" 
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 资源列表 -->
        <div v-if="resources.length > 0" class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">相关资源</h3>
          <div class="space-y-3">
            <div 
              v-for="resource in resources" 
              :key="resource.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-800">{{ resource.resourceName }}</p>
                <p class="text-sm text-gray-500">类型：{{ resource.resourceType }} | 上传时间：{{ formatDate(resource.uploadTime) }}</p>
              </div>
              <a 
                :href="resource.resourceUrl" 
                target="_blank"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                下载
              </a>
            </div>
          </div>
        </div>
        
        <!-- 底部信息 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between text-sm text-gray-500">
            <span>ID: {{ portfolio.id }}</span>
            <span>用户ID: {{ portfolio.userId }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      未找到作品信息
    </div>

    <!-- 编辑弹窗 -->
    <AddAchievementModal
      v-if="showEditModal"
      :show="showEditModal"
      :initial-data="portfolio"
      @close="handleEditModalClose"
      @submit="handleEditModalSubmit"
    />
  </div>
</template> 