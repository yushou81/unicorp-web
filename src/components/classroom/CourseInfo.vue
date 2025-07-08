<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-1/3">
        <img :src="courseImage" :alt="course.title" class="w-full h-64 object-cover rounded-lg" />
      </div>
      <div class="md:w-2/3">
        <div class="flex justify-between items-start">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}</h1>
          <span 
            :class="statusClass" 
            class="text-xs px-2 py-1 rounded-full"
          >
            {{ statusText }}
          </span>
        </div>
        
        <p class="text-gray-600 mb-4">{{ course.description }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">开课时间</div>
              <div class="font-medium">{{ formattedDate }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">已报名/总名额</div>
              <div class="font-medium">{{ course.enrolledCount }}/{{ course.maxStudents }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">授课讲师</div>
              <div class="font-medium">{{ course.teacherName }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">合作企业</div>
              <div class="font-medium">{{ course.enterpriseName }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">上课地点</div>
              <div class="font-medium">{{ course.location || '未指定' }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div class="text-sm text-gray-500">授课方式</div>
              <div class="font-medium">{{ courseTypeText }}</div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <span 
              :class="courseTypeClass" 
              class="text-xs px-2 py-1 rounded-full mr-2"
            >
              {{ courseTypeText }}
            </span>
          </div>
          
          <!-- 学生列表按钮 - 仅教师和企业导师可见 -->
          <button 
            v-if="canViewStudents"
            @click="$emit('view-students')"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            查看学生列表
          </button>
        </div>
        
        <slot name="actions"></slot>
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
  canViewStudents?: boolean
}>()

const emit = defineEmits<{
  'view-students': []
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