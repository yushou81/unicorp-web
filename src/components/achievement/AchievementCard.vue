<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  achievement: {
    id: number
    title: string
    description?: string
    coverImageUrl?: string
    isVerified: boolean
    createdAt: string
    type: 'portfolio' | 'award' | 'research'
  }
}

const props = defineProps<Props>()
const router = useRouter()

const achievementTypeText = computed(() => {
  const typeMap = {
    portfolio: '作品',
    award: '获奖',
    research: '科研成果'
  }
  return typeMap[props.achievement.type] || '其他'
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <img 
          :src="achievement.coverImageUrl || 'https://via.placeholder.com/100'" 
          :alt="achievement.title"
          class="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ achievement.title }}</h3>
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              achievement.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ achievement.isVerified ? '已认证' : '待认证' }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ achievement.description }}</p>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <span>{{ formatDate(achievement.createdAt) }}</span>
          <span class="mx-2">·</span>
          <span>{{ achievementTypeText }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 