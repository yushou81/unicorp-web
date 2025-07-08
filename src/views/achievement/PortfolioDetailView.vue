<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { portfolioApi, type PortfolioItemVO, type PortfolioResourceVO } from '@/lib/api/achievement'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)
const error = ref('')
const portfolio = ref<PortfolioItemVO | null>(null)
const resources = ref<PortfolioResourceVO[]>([])
const isLiked = ref(false)

// 判断是否为作者（从路由参数获取）
const isAuthor = computed(() => {
  return route.query.isAuthor === 'true'
})

// 判断是否为企业用户
const isEnterpriseUser = computed(() => {
  const userRole = (appStore.user as any)?.role?.toUpperCase()
  return userRole === 'EN_ADMIN' || userRole === 'EN_TEACHER'
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
      if (portfolioResponse.data.resources) {
        resources.value = portfolioResponse.data.resources
      }
    }
  } catch (err: any) {
    console.error('获取作品详情失败:', err)
    if (err.message === '作品不存在') {
      error.value = '抱歉，您访问的作品不存在或已被删除'
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

// 点赞
const likeAchievement = async () => {
  if (!portfolio.value?.id || isLiked.value) return;
  try {
    await portfolioApi.likeAchievement(portfolio.value.id);
    isLiked.value = true;
    if (portfolio.value) {
      portfolio.value.likeCount += 1;
    }
    alert('点赞成功！');
  } catch (err: any) {
    console.error('点赞失败:', err);
    alert('点赞失败，请稍后再试。');
  }
};

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

// 跳转到编辑页面
const handleEdit = () => {
  if (!portfolio.value?.id) return
  router.push({
    path: '/achievement',
    query: {
      edit: 'true',
      type: 'PORTFOLIO',
      id: portfolio.value.id
    }
  })
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
    <div v-if="error" class="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="loading" class="max-w-4xl mx-auto flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div v-else-if="portfolio" class="w-3/4 mx-auto">
      <!-- 标题栏 -->
      <div class="bg-white shadow-lg rounded-t-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-3xl">📚</span>
              <h1 class="text-2xl font-bold text-white">{{ portfolio.title }}</h1>
            </div>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="px-8 py-4 bg-gray-50 border-b flex justify-between text-sm text-gray-600">
          <div class="flex space-x-8">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📅</span>
              <span>创建时间：{{ formatDate(portfolio.createdAt) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xl">⏱️</span>
              <span>更新时间：{{ formatDate(portfolio.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-lg rounded-b-2xl p-8">
        <!-- 基本信息卡片 -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-blue-700 font-medium w-24">作者</span>
                <span>{{ portfolio.userName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-blue-700 font-medium w-24">所属组织</span>
                <span>{{ portfolio.organizationName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-blue-700 font-medium w-24">分类</span>
                <span>{{ portfolio.category }}</span>
              </div>
              <div v-if="portfolio.teamMembers" class="flex items-center">
                <span class="text-blue-700 font-medium w-24">团队成员</span>
                <span>{{ portfolio.teamMembers }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-blue-700 font-medium w-24">浏览量</span>
                <span>{{ portfolio.viewCount }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-blue-700 font-medium w-24">点赞数</span>
                <span>{{ portfolio.likeCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 封面图片 -->
        <div v-if="portfolio.coverImageUrl" class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            作品封面
          </h2>
          <div class="flex justify-center">
            <img 
              :src="portfolio.coverImageUrl" 
              alt="作品封面" 
              class="max-w-full max-h-96 rounded-lg shadow-lg object-contain"
            >
          </div>
        </div>

        <!-- 作品描述 -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            作品描述
          </h2>
          <p class="text-gray-600 whitespace-pre-line">{{ portfolio.description }}</p>
        </div>

        <!-- 项目链接 -->
        <div v-if="portfolio.projectUrl" class="bg-indigo-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-indigo-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            项目链接
          </h2>
          <a 
            :href="portfolio.projectUrl" 
            target="_blank" 
            class="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            {{ portfolio.projectUrl }}
            <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- 标签 -->
        <div v-if="portfolio.tags && portfolio.tags.length > 0" class="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-purple-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            标签
          </h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in portfolio.tags" 
              :key="tag"
              class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 资源列表 -->
        <div v-if="resources.length > 0" class="bg-green-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-green-900 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            相关资源
          </h2>
          <div class="space-y-3">
            <div 
              v-for="resource in resources" 
              :key="resource.id"
              class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl">{{ resource.resourceUrl.toLowerCase().endsWith('.pdf') ? '📄' : 
                                    resource.resourceUrl.toLowerCase().endsWith('.doc') || resource.resourceUrl.toLowerCase().endsWith('.docx') ? '📝' : 
                                    resource.resourceUrl.toLowerCase().endsWith('.jpg') || resource.resourceUrl.toLowerCase().endsWith('.png') ? '🖼️' : '📎' }}</span>
                <div>
                  <p class="font-medium text-gray-800">{{ resource.resourceUrl.split('/').pop() || resource.resourceName }}</p>
                  <p class="text-sm text-gray-500">类型：{{ resource.resourceUrl.split('.').pop().toUpperCase() || resource.resourceType }} | 上传时间：{{ formatDate(resource.uploadTime) }}</p>
                </div>
              </div>
              <a 
                :href="resource.resourceUrl" 
                target="_blank"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
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

        <!-- 操作按钮 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-end space-x-4">
            <button
              v-if="isEnterpriseUser"
              @click="likeAchievement"
              :disabled="isLiked"
              class="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.331V10h3.53a2 2 0 011.831 1.189L14 15.331V10zM7 21a2 2 0 01-2-2v-7a2 2 0 012-2h2.086a2 2 0 011.664.89l.812 1.22A2 2 0 0013.086 10H7z" />
              </svg>
              <span>{{ isLiked ? '已点赞' : '点赞' }}</span>
            </button>
            
            <!-- 作者可见按钮 -->
            <template v-if="isAuthor">
              <input
                type="file"
                id="resourceUpload"
                class="hidden"
                @change="handleUploadResource"
              />
              <label
                for="resourceUpload"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                上传资源
              </label>

              <button
                @click="handleEdit"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>

              <button
                @click="handleDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 