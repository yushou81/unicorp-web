<template>
  <div class="flex items-center space-x-2">
    <!-- 评分星级 -->
    <div class="flex items-center">
      <div class="flex">
        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="[
          'h-4 w-4',
          i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
        ]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <span class="text-sm font-medium text-gray-700 ml-1">{{ averageRating.toFixed(1) }}</span>
    </div>
    
    <!-- 评价数量 -->
    <span class="text-sm text-gray-500">({{ totalRatings }}条评价)</span>
    
    <!-- 无评价时的显示 -->
    <span v-if="totalRatings === 0" class="text-sm text-gray-400">暂无评价</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  averageRating: number
  totalRatings: number
}>()
</script> 