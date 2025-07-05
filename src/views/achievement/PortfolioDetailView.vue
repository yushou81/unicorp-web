<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { portfolioApi } from '@/lib/api/achievement'
import type { PortfolioItemVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const portfolio = ref<PortfolioItemVO | null>(null)

const fetchPortfolioDetail = async () => {
  try {
    loading.value = true
    const response = await portfolioApi.getPortfolioItemDetail(Number(route.params.id))
    if (response.data) {
      portfolio.value = response.data
    }
  } catch (error) {
    console.error('获取作品详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPortfolioDetail()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="portfolio" class="bg-white rounded-lg shadow-lg p-6">
      <!-- 返回按钮 -->
      <button 
        @click="router.back()"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <span class="mr-2">←</span> 返回
      </button>

      <!-- 标题部分 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ portfolio.title }}</h1>
        <div class="mt-4 flex items-center space-x-4">
          <span class="bg-slate-50 text-slate-600 px-2 py-1 rounded text-sm">作品</span>
          <span class="text-gray-500">{{ new Date(portfolio.createdAt).toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>

      <!-- 封面图片 -->
      <div v-if="portfolio.coverImageUrl" class="mb-8">
        <img 
          :src="portfolio.coverImageUrl" 
          :alt="portfolio.title"
          class="w-full h-auto rounded-lg shadow"
        >
      </div>

      <!-- 详情信息 -->
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">项目描述</h2>
          <p class="text-gray-600 whitespace-pre-line">{{ portfolio.description }}</p>
        </div>

        <div v-if="portfolio.projectUrl">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">项目链接</h2>
          <a 
            :href="portfolio.projectUrl" 
            target="_blank"
            class="text-blue-600 hover:text-blue-800"
          >
            {{ portfolio.projectUrl }}
          </a>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">项目分类</h2>
          <p class="text-gray-600">{{ portfolio.category }}</p>
        </div>

        <div v-if="portfolio.tags && portfolio.tags.length > 0">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in portfolio.tags" 
              :key="tag"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div v-if="portfolio.teamMembers">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">团队成员</h2>
          <p class="text-gray-600">{{ portfolio.teamMembers }}</p>
        </div>

        <!-- 资源列表 -->
        <div v-if="portfolio.resources && portfolio.resources.length > 0">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">项目资源</h2>
          <div class="space-y-2">
            <div 
              v-for="resource in portfolio.resources" 
              :key="resource.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <span class="text-gray-700">{{ resource.resourceName }}</span>
              <a 
                :href="resource.resourceUrl"
                target="_blank"
                class="text-blue-600 hover:text-blue-800"
              >
                查看
              </a>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="flex items-center space-x-6 text-gray-500">
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            {{ portfolio.viewCount }} 次浏览
          </span>
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {{ portfolio.likeCount }} 次点赞
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">作品信息不存在或已被删除</p>
      <button 
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        返回上一页
      </button>
    </div>
  </div>
</template> 