<template>
  <nav class="flex items-center justify-center" v-if="totalPages > 0">
    <button 
      @click="$emit('prev')" 
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded-md border border-gray-300 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      上一页
    </button>
    <div class="flex space-x-1">
      <button 
        v-for="page in displayedPages" 
        :key="page" 
        @click="$emit('page', page)"
        :class="[
          'px-3 py-1 rounded-md',
          currentPage === page 
            ? 'bg-blue-600 text-white' 
            : 'border border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>
    </div>
    <button 
      @click="$emit('next')" 
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded-md border border-gray-300 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      下一页
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'page', page: number): void
}>()

// 计算显示哪些页码按钮
const displayedPages = computed(() => {
  const maxDisplayed = 5 // 最多显示5个页码
  const pages: number[] = []
  
  if (props.totalPages <= maxDisplayed) {
    // 总页数少于等于最大显示数，显示所有页码
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于最大显示数，需要计算显示哪些页码
    if (props.currentPage <= 3) {
      // 当前页靠前，显示前5页
      for (let i = 1; i <= maxDisplayed; i++) {
        pages.push(i)
      }
    } else if (props.currentPage >= props.totalPages - 2) {
      // 当前页靠后，显示后5页
      for (let i = props.totalPages - maxDisplayed + 1; i <= props.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间，显示当前页及其前后2页
      for (let i = props.currentPage - 2; i <= props.currentPage + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
})
</script> 