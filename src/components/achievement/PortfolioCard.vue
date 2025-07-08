<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
    <div class="aspect-w-16 aspect-h-9 mb-4">
      <img 
        :src="portfolio.coverImage || 'https://via.placeholder.com/400x225'" 
        :alt="portfolio.title"
        class="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div class="space-y-2">
      <div class="flex items-start justify-between">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ portfolio.title }}</h3>
        <span 
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            portfolio.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-purple-50 text-purple-400'
          ]"
        >
          {{ portfolio.isPublic ? '公开' : '私有' }}
        </span>
      </div>
      <p class="text-sm text-gray-500 line-clamp-2">{{ portfolio.description }}</p>
      <div class="flex items-center space-x-4 text-sm text-gray-500">
        <span>{{ formatDate(portfolio.createdAt) }}</span>
        <span>浏览 {{ portfolio.views }}</span>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <span 
          v-for="tag in portfolio.tags" 
          :key="tag"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Portfolio {
  id: number
  title: string
  description: string
  coverImage?: string
  isPublic: boolean
  createdAt: string
  views: number
  tags: string[]
}

interface Props {
  portfolio: Portfolio
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script> 