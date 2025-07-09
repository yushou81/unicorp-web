<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">操作日志</h3>
    
    <div v-if="logs.length === 0" class="text-center py-8 text-gray-500">
      暂无操作日志
    </div>
    <div v-else class="space-y-4">
      <div 
        v-for="(log, index) in logs" 
        :key="index"
        class="flex items-start border-l-2 pl-4 py-2"
        :class="getLogBorderClass(log.type)"
      >
        <div class="flex-shrink-0 mr-3">
          <div class="p-1.5 rounded-full" :class="getLogIconBgClass(log.type)">
            <svg class="w-4 h-4" :class="getLogIconClass(log.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="log.type === 'create'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <path v-else-if="log.type === 'update'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              <path v-else-if="log.type === 'delete'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex justify-between">
            <span class="font-medium text-gray-900">{{ log.operator }}</span>
            <span class="text-sm text-gray-500">{{ formatDate(log.operateTime) }}</span>
          </div>
          <p class="mt-1 text-gray-700">{{ log.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } catch (e) {
    return dateString
  }
}

function getLogBorderClass(type: string): string {
  const classMap: Record<string, string> = {
    create: 'border-green-400',
    update: 'border-blue-400',
    delete: 'border-red-400',
    default: 'border-gray-400'
  }
  return classMap[type] || classMap.default
}

function getLogIconBgClass(type: string): string {
  const classMap: Record<string, string> = {
    create: 'bg-green-100',
    update: 'bg-blue-100',
    delete: 'bg-red-100',
    default: 'bg-gray-100'
  }
  return classMap[type] || classMap.default
}

function getLogIconClass(type: string): string {
  const classMap: Record<string, string> = {
    create: 'text-green-600',
    update: 'text-blue-600',
    delete: 'text-red-600',
    default: 'text-gray-600'
  }
  return classMap[type] || classMap.default
}
</script> 