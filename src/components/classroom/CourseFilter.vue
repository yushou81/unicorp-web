<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">课程分类</label>
        <select v-model="filters.category" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">全部分类</option>
          <option value="technology">技术开发</option>
          <option value="design">设计创意</option>
          <option value="management">管理营销</option>
          <option value="finance">金融财会</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">课程状态</label>
        <select v-model="filters.status" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">全部状态</option>
          <option v-for="(text, status) in statusOptions" :key="status" :value="status">{{ text }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">授课方式</label>
        <select v-model="filters.courseType" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">全部方式</option>
          <option v-for="(text, type) in courseTypeOptions" :key="type" :value="type">{{ text }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
        <div class="relative">
          <input 
            v-model="filters.keyword" 
            type="text" 
            placeholder="搜索课程名称、讲师" 
            class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <button @click="handleReset" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50">重置</button>
      <button @click="handleApply" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">筛选</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { CourseStatus, CourseType } from '@/lib/api/classroom'

export interface CourseFilters {
  keyword: string
  category: string
  status: string
  courseType: string
}

const props = defineProps<{
  initialFilters?: CourseFilters
}>()

const emit = defineEmits<{
  (e: 'apply', filters: CourseFilters): void
  (e: 'reset'): void
}>()

// 课程状态选项
const statusOptions = {
  [CourseStatus.PLANNING]: '筹备中',
  [CourseStatus.OPEN]: '开放报名',
  [CourseStatus.IN_PROGRESS]: '进行中',
  [CourseStatus.COMPLETED]: '已结束',
  [CourseStatus.CANCELLED]: '已取消'
}

// 授课方式选项
const courseTypeOptions = {
  [CourseType.ONLINE]: '线上授课',
  [CourseType.OFFLINE]: '线下授课',
  [CourseType.HYBRID]: '线上+线下'
}

// 筛选条件
const filters = reactive<CourseFilters>({
  keyword: props.initialFilters?.keyword || '',
  category: props.initialFilters?.category || '',
  status: props.initialFilters?.status || '',
  courseType: props.initialFilters?.courseType || ''
})

// 应用筛选条件
const handleApply = () => {
  emit('apply', { ...filters })
}

// 重置筛选条件
const handleReset = () => {
  filters.keyword = ''
  filters.category = ''
  filters.status = ''
  filters.courseType = ''
  emit('reset')
}
</script> 