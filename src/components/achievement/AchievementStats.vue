<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  verified: number
  portfolio: number
  awards: number
  research: number
  views: number
}

const props = defineProps<Props>()

const stats = computed(() => [
  {
    label: '总成果数',
    value: props.total,
    description: '包含所有类型的成果总数',
    color: 'bg-blue-100 text-blue-800',
    trend: '总览'
  },
  {
    label: '已认证成果',
    value: props.verified,
    description: `认证率 ${Math.round((props.verified / props.total) * 100)}%`,
    color: 'bg-green-100 text-green-800',
    trend: '已认证'
  },
  {
    label: '作品数量',
    value: props.portfolio,
    description: '个人作品和项目展示',
    color: 'bg-purple-100 text-purple-800',
    trend: '作品'
  },
  {
    label: '获奖数量',
    value: props.awards,
    description: '竞赛和荣誉获奖',
    color: 'bg-yellow-100 text-yellow-800',
    trend: '获奖'
  },
  {
    label: '科研成果',
    value: props.research,
    description: '论文、专利等科研成果',
    color: 'bg-indigo-100 text-indigo-800',
    trend: '科研'
  },
  {
    label: '总访问量',
    value: props.views,
    description: '成果展示页面访问量',
    color: 'bg-pink-100 text-pink-800',
    trend: '访问'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div 
      v-for="stat in stats" 
      :key="stat.label"
      class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer border border-transparent hover:border-gray-200"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-500">{{ stat.label }}</h3>
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="stat.color"
        >
          {{ stat.trend }}
        </span>
      </div>
      <p class="mt-1 text-2xl font-semibold">{{ stat.value }}</p>
      <p class="mt-1 text-sm text-gray-500">{{ stat.description }}</p>
    </div>
  </div>
</template> 