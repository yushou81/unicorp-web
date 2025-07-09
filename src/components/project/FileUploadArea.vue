<template>
  <div 
    class="border-2 border-dashed border-gray-300 rounded-md p-6 transition-all"
    :class="{ 'bg-blue-50 border-blue-300': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <!-- 现有附件列表 -->
    <div v-if="existingFiles.length > 0" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">现有附件</h4>
      <div class="space-y-2">
        <div 
          v-for="(file, index) in existingFiles" 
          :key="`existing-${index}`" 
          class="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200"
        >
          <div class="flex items-center overflow-hidden">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm text-gray-700 truncate">
              {{ originalNames[index] || getFileNameFromUrl(file) }}
            </span>
          </div>
          <button
            type="button"
            @click="$emit('remove-existing', index)"
            class="ml-2 flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 新上传文件列表 -->
    <div v-if="newFiles.length > 0" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">新上传文件</h4>
      <div class="space-y-2">
        <div 
          v-for="(file, index) in newFiles" 
          :key="`new-${index}`" 
          class="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200"
        >
          <div class="flex items-center overflow-hidden">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm text-gray-700 truncate">{{ file.name }}</span>
          </div>
          <button
            type="button"
            @click="$emit('remove-new', index)"
            class="ml-2 flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 上传按钮 -->
    <div class="text-center">
      <label 
        for="file-upload" 
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        添加文件
        <input 
          id="file-upload" 
          type="file" 
          class="sr-only" 
          @change="handleFileChange" 
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </label>
      <p class="text-xs text-gray-500 mt-2">
        支持 PDF, DOC, DOCX, JPG, PNG 格式，单个文件不超过 10MB
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  existingFiles: {
    type: Array as () => string[],
    default: () => []
  },
  originalNames: {
    type: Array as () => string[],
    default: () => []
  },
  newFiles: {
    type: Array as () => File[],
    default: () => []
  }
});

const emit = defineEmits(['add-files', 'remove-existing', 'remove-new']);

const isDragging = ref(false);

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    emit('add-files', Array.from(input.files));
    input.value = ''; // 重置input，允许再次选择相同文件
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    emit('add-files', Array.from(files));
  }
}

function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '附件';
}
</script> 