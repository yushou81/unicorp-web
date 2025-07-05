<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { researchApi } from '@/lib/api/achievement'
import type { ResearchVO } from '@/lib/api/achievement'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const research = ref<ResearchVO | null>(null)

const fetchResearchDetail = async () => {
  try {
    loading.value = true
    const response = await researchApi.getResearchById(Number(route.params.id))
    if (response.data) {
      research.value = response.data
    }
  } catch (error) {
    console.error('获取科研成果详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchResearchDetail()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="research" class="bg-white rounded-lg shadow-lg p-6">
      <!-- 返回按钮 -->
      <button 
        @click="router.back()"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <span class="mr-2">←</span> 返回
      </button>

      <!-- 标题部分 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">{{ research.title }}</h1>
        <div class="mt-4 flex items-center space-x-4">
          <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm">科研成果</span>
          <span 
            :class="research.isVerified ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-600'"
            class="px-2 py-1 rounded text-sm"
          >
            {{ research.isVerified ? '已认证' : '待认证' }}
          </span>
          <span class="text-gray-500">{{ research.publicationDate }}</span>
        </div>
      </div>

      <!-- 封面图片 -->
      <div v-if="research.coverImageUrl" class="mb-8">
        <img 
          :src="research.coverImageUrl" 
          :alt="research.title"
          class="w-full h-auto rounded-lg shadow"
        >
      </div>

      <!-- 详情信息 -->
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">成果类型</h2>
          <p class="text-gray-600">{{ research.type }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">作者</h2>
          <p class="text-gray-600">{{ research.authors }}</p>
        </div>

        <div v-if="research.publisher">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">发表单位</h2>
          <p class="text-gray-600">{{ research.publisher }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">成果描述</h2>
          <p class="text-gray-600 whitespace-pre-line">{{ research.description }}</p>
        </div>

        <!-- 附件下载 -->
        <div v-if="research.fileUrl" class="mt-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">成果文件</h2>
          <a 
            :href="research.fileUrl"
            target="_blank"
            class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            下载文件
          </a>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">科研成果信息不存在或已被删除</p>
      <button 
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        返回上一页
      </button>
    </div>
  </div>
</template> 