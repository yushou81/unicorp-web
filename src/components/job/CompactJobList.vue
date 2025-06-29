<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center bg-white rounded-lg">
      <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500">正在加载职位信息...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="jobs.length === 0" class="bg-white rounded-lg p-10 text-center">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">没有找到匹配的职位</h3>
        <p class="text-gray-500 max-w-md">
          尝试调整您的搜索条件或筛选条件，以查看更多结果
        </p>
      </div>
    </div>
    
    <!-- 职位列表 -->
    <div v-else class="bg-white rounded-lg overflow-hidden">
      <div class="border-b px-6 py-3 flex justify-between items-center bg-gray-50">
        <div class="text-gray-700">
          共找到 <span class="font-bold text-blue-600">{{ jobs.length }}</span> 个职位
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 text-sm">排序方式：</span>
          <div class="flex border rounded overflow-hidden">
            <button 
              @click="$emit('sort', 'latest')" 
              class="px-3 py-1.5 text-sm"
              :class="sortOption === 'latest' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              最新发布
            </button>
            <button 
              @click="$emit('sort', 'salary-high')" 
              class="px-3 py-1.5 text-sm border-l"
              :class="sortOption === 'salary-high' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              薪资从高到低
            </button>
            <button 
              @click="$emit('sort', 'salary-low')" 
              class="px-3 py-1.5 text-sm border-l"
              :class="sortOption === 'salary-low' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              薪资从低到高
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <CompactJobCard 
          v-for="job in jobs" 
          :key="job.id"
          :job="job"
          @collect="$emit('collect', $event)"
          @click="$router.push(`/job/${job.id}`)"
        />
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center py-6">
        <div class="inline-flex rounded overflow-hidden">
          <button 
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border"
            :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            上一页
          </button>
          <button 
            v-for="page in displayedPages" 
            :key="page"
            @click="$emit('page-change', page)"
            class="px-3 py-1.5 border-t border-b border-r"
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          <button 
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border-t border-r border-b"
            :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompactJobCard from './CompactJobCard.vue'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  loading?: boolean;
  sortOption: string;
}>()

const emit = defineEmits(['collect', 'page-change', 'sort'])

// 计算需要显示的页码
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5 // 最多显示5个页码
  
  if (props.totalPages <= maxDisplayed) {
    // 如果总页数小于等于最大显示数，则显示所有页码
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 否则显示当前页附近的页码
    let start = Math.max(1, props.currentPage - Math.floor(maxDisplayed / 2))
    let end = start + maxDisplayed - 1
    
    if (end > props.totalPages) {
      end = props.totalPages
      start = Math.max(1, end - maxDisplayed + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})
</script> 