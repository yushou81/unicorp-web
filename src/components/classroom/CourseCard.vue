<template>
  <div 
    class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click', course.id)"
  >
    <img :src="courseImage" :alt="course.title" class="w-full h-48 object-cover" />
    <div class="p-5">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-bold text-gray-900 line-clamp-2">{{ course.title }}</h3>
        <span 
          :class="statusClass" 
          class="text-xs px-2 py-1 rounded-full"
        >
          {{ statusText }}
        </span>
      </div>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ course.description }}</p>
      
      <div class="flex items-center mb-3">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-sm text-gray-700">{{ course.teacherName }}</span>
        </div>
        <span class="mx-2 text-gray-300">|</span>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="text-sm text-gray-700">{{ course.enterpriseName }}</span>
        </div>
      </div>
      
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm text-gray-700">{{ formattedDate }}</span>
        </div>
        <span 
          :class="courseTypeClass" 
          class="text-xs px-2 py-1 rounded-full"
        >
          {{ courseTypeText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DualTeacherCourseVO, CourseStatus, CourseType } from '@/lib/api/classroom'

// 课程封面图（随机图片）
const courseImages = [
  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984'
]

const props = defineProps<{
  course: DualTeacherCourseVO
}>()

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

// 获取课程封面图
const courseImage = computed(() => {
  // 使用课程ID作为索引获取图片，确保同一课程总是获得相同的图片
  const index = props.course.id % courseImages.length
  return `${courseImages[index]}?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
})

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.course.scheduledTime)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
})

// 获取状态对应的样式类
const statusClass = computed(() => {
  const statusClasses = {
    [CourseStatus.PLANNING]: 'bg-gray-100 text-gray-700',
    [CourseStatus.OPEN]: 'bg-blue-100 text-blue-700',
    [CourseStatus.IN_PROGRESS]: 'bg-green-100 text-green-700',
    [CourseStatus.COMPLETED]: 'bg-purple-100 text-purple-700',
    [CourseStatus.CANCELLED]: 'bg-red-100 text-red-700'
  }
  return statusClasses[props.course.status] || 'bg-gray-100 text-gray-700'
})

// 获取状态对应的文本
const statusText = computed(() => {
  const statusTexts = {
    [CourseStatus.PLANNING]: '筹备中',
    [CourseStatus.OPEN]: '开放报名',
    [CourseStatus.IN_PROGRESS]: '进行中',
    [CourseStatus.COMPLETED]: '已结束',
    [CourseStatus.CANCELLED]: '已取消'
  }
  return statusTexts[props.course.status] || '未知状态'
})

// 获取授课方式对应的样式类
const courseTypeClass = computed(() => {
  const typeClasses = {
    [CourseType.ONLINE]: 'bg-teal-100 text-teal-700',
    [CourseType.OFFLINE]: 'bg-amber-100 text-amber-700',
    [CourseType.HYBRID]: 'bg-indigo-100 text-indigo-700'
  }
  return typeClasses[props.course.courseType] || 'bg-gray-100 text-gray-700'
})

// 获取授课方式对应的文本
const courseTypeText = computed(() => {
  const typeTexts = {
    [CourseType.ONLINE]: '线上授课',
    [CourseType.OFFLINE]: '线下授课',
    [CourseType.HYBRID]: '线上+线下'
  }
  return typeTexts[props.course.courseType] || '未知方式'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 