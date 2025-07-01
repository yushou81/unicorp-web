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
    
    <!-- 职位卡片列表 -->
    <div class="space-y-5">
      <JobCard 
        v-for="job in jobs" 
        :key="job.id"
        :job="job"
        @collect="$emit('collect', $event)"
      />
    </div>
    
    <!-- 分页 -->
    <div class="flex justify-center mt-10">
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

// 从JobCard组件导入Job接口
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  education: string;
  description: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

const props = defineProps<{
  jobs: Job[];
  currentPage: number;
  totalPages: number;
}>()

const emit = defineEmits(['collect', 'page-change', 'sort'])

const sortOption = ref('latest')
</script> 