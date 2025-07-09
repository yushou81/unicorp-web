<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">申请说明</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="application">
        <div class="text-gray-700 whitespace-pre-line text-sm">{{ application.message || '无说明' }}</div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  application: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);
</script> 