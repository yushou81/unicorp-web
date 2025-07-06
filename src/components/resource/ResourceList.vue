<template>
  <div>
    <!-- 排序和结果数量 -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div class="text-gray-700">
        共找到 <span class="font-bold text-blue-600">{{ resources.length }}</span> 个资源
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">排序方式：</span>
        <select 
          v-model="sortOption" 
          class="px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
          @change="$emit('sort', sortOption)"
        >
          <option value="latest" class="text-gray-900">最新发布</option>
          <option value="hot" class="text-gray-900">热门程度</option>
          <option value="name" class="text-gray-900">名称</option>
        </select>
      </div>
    </div>
    
    <!-- 资源卡片列表 -->
    <div class="space-y-5">
      <ResourceCard 
        v-for="resource in resources" 
        :key="resource.id"
        :resource="resource"
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
          v-for="page in displayedPageNumbers" 
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
import { ref, computed } from 'vue'
import ResourceCard from './ResourceCard.vue'

// 资源接口定义
interface Resource {
  id: number;
  title: string;
  provider: string;
  category: string;
  type: string;
  location: string;
  status: string;
  usage: string;
  description: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

const props = defineProps<{
  resources: Resource[];
  currentPage: number;
  totalPages: number;
}>()

const emit = defineEmits(['collect', 'page-change', 'sort'])

const sortOption = ref('latest')

// 计算需要显示的页码
const displayedPageNumbers = computed(() => {
  // 如果总页数小于等于5，则全部显示
  if (props.totalPages <= 5) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1)
  }
  
  // 否则，显示当前页附近的5个页码
  let start = Math.max(1, props.currentPage - 2)
  let end = Math.min(props.totalPages, start + 4)
  
  // 调整开始位置，确保总是显示5个页码
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script> 