<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center mb-3">
            <h3 class="font-bold text-xl text-gray-900">{{ job.title }}</h3>
            <span v-if="isNew" class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">新发布</span>
            <span v-if="isHot" class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">热门</span>
          </div>
          
          <p class="text-blue-600 font-medium mb-3">{{ job.organizationName }}</p>
          
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div class="flex items-center">
              <MapPinIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ job.location }}</span>
            </div>
            <div class="flex items-center" v-if="formattedSalary">
              <BanknoteIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ formattedSalary }}</span>
            </div>
            <div class="flex items-center">
              <BriefcaseIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ formattedJobType }}</span>
            </div>
            <div class="flex items-center">
              <GraduationCapIcon class="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{{ formattedEducation }}</span>
            </div>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-2">{{ job.description }}</p>
          
          <div class="flex flex-wrap gap-2" v-if="job.skillTags">
            <span 
              v-for="(tag, index) in skillTagsArray" 
              :key="index"
              class="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-col items-end space-y-3 ml-4">
          <router-link :to="`/job/${job.id}`">
            <Button size="sm" class="px-5">查看详情</Button>
          </router-link>
          <Button variant="outline" size="sm" @click="onCollect" class="flex items-center">
            <BookmarkIcon class="w-4 h-4 mr-1.5" />
            收藏
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPinIcon, BriefcaseIcon, BanknoteIcon, BookmarkIcon, GraduationCapIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  job: Job
}>()

const emit = defineEmits(['collect'])

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

// 格式化工作类型
const formattedJobType = computed(() => {
  switch (props.job.jobType) {
    case 'full_time':
      return '全职'
    case 'part_time':
      return '兼职'
    case 'internship':
      return '实习'
    case 'campus_recruitment':
      return '校招'
    default:
      return props.job.jobType
  }
})

// 格式化教育要求
const formattedEducation = computed(() => {
  switch (props.job.educationRequirement) {
    case 'any':
      return '不限'
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
  return props.job.skillTags.split(',')
})

const onCollect = () => {
  emit('collect', props.job.id)
}
</script> 