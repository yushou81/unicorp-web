<template>
  <div>
    <!-- 排序和结果数量 -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div class="text-gray-700">
        共找到 <span class="font-bold text-blue-600">{{ jobs.length }}</span> 个职位
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">排序方式：</span>
        <select 
          v-model="sortOption" 
          class="px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
          @change="$emit('sort', sortOption)"
        >
          <option value="latest" class="text-gray-900">最新发布</option>
          <option value="salary-high" class="text-gray-900">薪资从高到低</option>
          <option value="salary-low" class="text-gray-900">薪资从低到高</option>
        </select>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">正在加载职位信息...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="jobs.length === 0" class="bg-white rounded-lg p-10 text-center">
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">没有找到匹配的职位</h3>
        <p class="text-gray-500 max-w-md">
          尝试调整您的搜索条件或筛选条件，以查看更多结果
        </p>
      </div>
    </div>
    
    <!-- 职位卡片列表 -->
    <div v-else class="space-y-5">
      <JobCard 
        v-for="job in jobs" 
        :key="job.id"
        :job="job"
        @collect="$emit('collect', $event)"
      />
    </div>
    
    <!-- 分页 -->
    <div v-if="!loading && jobs.length > 0" class="flex justify-center mt-10">
      <div class="inline-flex rounded-md shadow-sm">
        <button 
          class="px-4 py-2 rounded-l-md border border-gray-300" 
          :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'"
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
        >
          &lt;
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          class="px-4 py-2 border-t border-b border-gray-300" 
          :class="[
            page === currentPage ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white hover:bg-gray-50 text-gray-700',
            page === 1 ? '' : 'border-l-0'
          ]"
          @click="$emit('page-change', page)"
        >
          {{ page }}
        </button>
        <button 
          class="px-4 py-2 rounded-r-md border border-gray-300 border-l-0" 
          :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'"
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JobCard from './JobCard.vue'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  loading?: boolean;
}>()

const emit = defineEmits(['collect', 'page-change', 'sort'])

const sortOption = ref('latest')
</script> 