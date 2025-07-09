<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">项目资料</h3>
      <button 
        v-if="isProjectMember" 
        @click="$emit('add-material')"
        class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        上传资料
      </button>
    </div>
    
    <div v-if="materials.length === 0" class="text-center py-8 text-gray-500">
      暂无项目资料
    </div>
    <div v-else class="space-y-4">
      <div 
        v-for="(material, index) in materials" 
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-md mr-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">{{ material.name }}</h4>
            <div class="flex items-center text-xs text-gray-500 mt-1">
              <span>{{ formatDate(material.uploadTime) }}</span>
              <span class="mx-2">·</span>
              <span>{{ material.uploader }}</span>
              <span class="mx-2">·</span>
              <span>{{ formatFileSize(material.size) }}</span>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="$emit('download', material.fileKey, material.name)"
            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
            title="下载"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button 
            v-if="isProjectMember" 
            @click="$emit('delete', material.id)"
            class="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  materials: {
    type: Array,
    default: () => []
  },
  isProjectMember: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add-material', 'download', 'delete'])

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('zh-CN')
  } catch (e) {
    return dateString
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script> 