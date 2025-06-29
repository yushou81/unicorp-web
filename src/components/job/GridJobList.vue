<template>
  <div class="pb-16 md:pb-0">
    <!-- 排序和统计 -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm text-gray-500">
        共找到 <span class="text-blue-600 font-medium">{{ totalJobs }}</span> 个职位
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-sm">排序方式：</div>
        <div class="flex space-x-2">
          <button 
            class="text-sm px-3 py-1 rounded-full" 
            :class="sortBy === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="changeSortBy('latest')"
          >
            最新发布
          </button>
          <button 
            class="text-sm px-3 py-1 rounded-full" 
            :class="sortBy === 'salary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="changeSortBy('salary')"
          >
            薪资从低到高
          </button>
          <button 
            class="text-sm px-3 py-1 rounded-full" 
            :class="sortBy === 'salary-desc' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="changeSortBy('salary-desc')"
          >
            薪资从高到低
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="jobs.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无匹配的职位</h3>
      <p class="text-gray-500">请尝试调整筛选条件或搜索关键词</p>
    </div>
    
    <!-- 职位列表 - 网格布局 -->
    <transition name="job-list">
      <div v-if="hasJobs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="job in jobs" :key="job.id" class="h-full">
          <GridJobCard :job="job" />
        </div>
      </div>
    </transition>
    
    <!-- 分页 -->
    <div v-if="hasJobs && totalPages > 1" class="mt-6 flex justify-center">
      <div class="flex items-center space-x-2">
        <button 
          class="px-4 py-2 rounded border text-sm font-medium" 
          :class="currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <template v-for="page in displayedPages" :key="page">
          <button 
            v-if="page !== '...'"
            class="px-4 py-2 rounded border text-sm font-medium" 
            :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
            @click="changePage(Number(page))"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-2 text-gray-400">{{ page }}</span>
        </template>
        
        <button 
          class="px-4 py-2 rounded border text-sm font-medium" 
          :class="currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
    
    <!-- 固定在底部的分页 - 在移动设备上显示 -->
    <div v-if="hasJobs && totalPages > 1" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex justify-center md:hidden z-10 shadow-lg">
      <div class="flex items-center space-x-2">
        <button 
          class="px-4 py-2 rounded border text-sm font-medium" 
          :class="currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="px-4 py-2 text-sm font-medium">
          {{ currentPage }} / {{ totalPages || 1 }}
        </div>
        
        <button 
          class="px-4 py-2 rounded border text-sm font-medium" 
          :class="currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GridJobCard from './GridJobCard.vue'
import { Job } from '@/lib/api/job'

const props = defineProps<{
  jobs: Job[]
  loading: boolean
  totalJobs: number
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:sortBy', sort: string): void
}>()

// 排序方式
const sortBy = ref('latest')

// 计算是否有职位数据
const hasJobs = computed(() => props.jobs.length > 0)

// 切换排序方式
const changeSortBy = (sort: string) => {
  if (sortBy.value === sort) return
  sortBy.value = sort
  emit('update:sortBy', sort)
}

// 切换页码
const changePage = (page: number) => {
  emit('update:currentPage', page)
}

// 计算需要显示的页码
const displayedPages = computed(() => {
  const result: (number | string)[] = []
  const current = props.currentPage
  const total = props.totalPages
  
  // 如果总页数小于等于7，直接显示所有页码
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push(i)
    }
    return result
  }
  
  // 总是显示第一页
  result.push(1)
  
  // 当前页接近开始
  if (current <= 4) {
    result.push(2, 3, 4, 5)
    result.push('...')
    result.push(total)
  } 
  // 当前页接近结束
  else if (current >= total - 3) {
    result.push('...')
    result.push(total - 4, total - 3, total - 2, total - 1)
    result.push(total)
  } 
  // 当前页在中间
  else {
    result.push('...')
    result.push(current - 1, current, current + 1)
    result.push('...')
    result.push(total)
  }
  
  return result
})
</script>

<style scoped>
/* 添加职位列表过渡效果 */
.job-list-enter-active,
.job-list-leave-active {
  transition: opacity 0.3s ease;
}

.job-list-enter-from,
.job-list-leave-to {
  opacity: 0;
}

.job-list-move {
  transition: transform 0.3s ease;
}
</style> 