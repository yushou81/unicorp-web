<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">课程资源</h2>
    <div v-if="resources && resources.length > 0" class="space-y-3">
      <div v-for="resource in resources" :key="resource.id" class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div class="font-medium text-gray-800">{{ resource.title }}</div>
            <div class="text-xs text-gray-500">{{ formatFileSize(resource.fileSize) }} · {{ getFileTypeText(resource.resourceType) }}</div>
          </div>
        </div>
        <a :href="getDownloadUrl(resource.id)" target="_blank" class="text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
    <div v-else class="text-gray-500 italic">暂无课程资源</div>
  </div>
</template>

<script setup lang="ts">
import { CourseResourceVO, getResourceDownloadUrl } from '@/lib/api/classroom'

const props = defineProps<{
  resources: CourseResourceVO[]
}>()

// 获取资源下载链接
const getDownloadUrl = (resourceId: number) => {
  return getResourceDownloadUrl(resourceId)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
}

// 获取文件类型文本
const getFileTypeText = (resourceType: string) => {
  const typeTexts: Record<string, string> = {
    'document': '文档',
    'video': '视频',
    'code': '代码',
    'other': '其他'
  }
  return typeTexts[resourceType] || '未知类型'
}
</script> 