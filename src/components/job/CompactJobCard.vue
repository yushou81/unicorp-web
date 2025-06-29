<template>
  <div class="bg-white border-b py-4 hover:bg-gray-50 transition-colors cursor-pointer">
    <div class="flex justify-between">
      <!-- 左侧职位信息 -->
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <router-link :to="`/job/${job.id}`" class="text-lg font-medium text-gray-900 hover:text-blue-600 mr-2">
            {{ job.title }}
          </router-link>
          <span v-if="isNew" class="px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新</span>
          <span v-if="isHot" class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热</span>
        </div>
        
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <span class="mr-4">{{ job.organizationName }}</span>
          <span class="mr-4">{{ job.location }}</span>
          <span class="mr-4">{{ formattedEducation }}</span>
          <span class="text-blue-600">{{ formattedSalary }}</span>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="(tag, index) in skillTagsArray" 
            :key="index"
            class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      
      <!-- 右侧公司信息 -->
      <div class="flex flex-col items-end ml-4">
        <div class="text-sm text-gray-500 mb-2">{{ formatDate(job.createdAt) }}</div>
        <div class="flex space-x-2">
          <button 
            @click.stop="onCollect" 
            class="text-gray-400 hover:text-blue-600"
            :class="{ 'text-blue-600': isCollected }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" :stroke="isCollected ? 'none' : 'currentColor'" :stroke-width="isCollected ? 0 : 2" :fill="isCollected ? 'currentColor' : 'none'">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  job: Job
}>()

const emit = defineEmits(['collect'])

// 是否已收藏
const isCollected = ref(false)

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

const onCollect = (event: Event) => {
  event.stopPropagation()
  isCollected.value = !isCollected.value
  emit('collect', props.job.id)
}
</script> 