<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden h-full flex flex-col">
    <!-- 卡片头部 -->
    <div class="p-4 border-b">
      <div class="flex items-center justify-between mb-2">
        <router-link :to="`/job/${job.id}`" class="text-lg font-medium text-gray-900 hover:text-blue-600 truncate max-w-[80%]">
          {{ job.title }}
        </router-link>
        <div class="flex space-x-1">
          <span v-if="isNew" class="px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded-full whitespace-nowrap">新</span>
          <span v-if="isHot" class="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full whitespace-nowrap">热</span>
        </div>
      </div>
      
      <div class="text-blue-600 font-medium text-sm truncate">{{ job.organizationName }}</div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="p-4 flex-1 flex flex-col">
      <!-- 薪资和地点 -->
      <div class="flex items-center justify-between mb-3">
        <div class="text-blue-600 font-medium">{{ formattedSalary }}</div>
        <div class="text-gray-500 text-sm flex items-center">
          <MapPinIcon class="w-3.5 h-3.5 mr-1 text-gray-400" />
          <span>{{ job.location }}</span>
        </div>
      </div>
      
      <!-- 标签 -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span 
          v-for="(tag, index) in skillTagsArray" 
          :key="index"
          class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 底部信息 -->
      <div class="flex items-center justify-between mt-auto pt-2 text-sm text-gray-500">
        <div>{{ formattedEducation }}</div>
        <div>{{ formatDate(job.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MapPinIcon } from 'lucide-vue-next'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  job: Job
}>()

// 计算属性：是否为新发布的职位（7天内）
const isNew = computed(() => {
  const createdAt = new Date(props.job.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
})

// 计算属性：是否为热门职位（浏览量超过10）
const isHot = computed(() => {
  return props.job.viewCount >= 10
})

// 格式化薪资显示
const formattedSalary = computed(() => {
  if (props.job.salaryMin === null && props.job.salaryMax === null) {
    return '薪资面议'
  }
  
  let result = ''
  
  if (props.job.salaryMin !== null) {
    result += `${props.job.salaryMin}k`
  }
  
  if (props.job.salaryMax !== null) {
    result += `${result ? '-' : ''}${props.job.salaryMax}k`
  }
  
  // 添加薪资单位
  if (props.job.salaryUnit) {
    switch (props.job.salaryUnit) {
      case 'per_month':
        result += '/月'
        break
      case 'per_year':
        result += '/年'
        break
      default:
        break
    }
  }
  
  return result
})

// 格式化教育要求
const formattedEducation = computed(() => {
  switch (props.job.educationRequirement) {
    case 'any':
      return '学历不限'
    case 'high_school':
      return '高中及以上'
    case 'associate':
      return '大专及以上'
    case 'bachelor':
      return '本科及以上'
    case 'master':
      return '硕士及以上'
    case 'phd':
      return '博士及以上'
    default:
      return props.job.educationRequirement
  }
})

// 技能标签数组
const skillTagsArray = computed(() => {
  if (!props.job.skillTags) return []
  return props.job.skillTags.split(',').slice(0, 3) // 最多显示3个标签
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  
  // 如果是今天发布的
  if (date.toDateString() === now.toDateString()) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `今天 ${hours}:${minutes}`
  }
  
  // 如果是昨天发布的
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  
  // 其他情况显示月日
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}
</script> 
 