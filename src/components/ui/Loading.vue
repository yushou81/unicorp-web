<template>
  <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span class="text-gray-700">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  message: '加载中...'
})
</script> 