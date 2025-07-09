<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex flex-col md:flex-row justify-between items-start mb-6">
      <div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
            发起方：{{ initiatorType === 'school' ? '学校' : '企业' }}
          </span>
          <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
            项目领域：{{ field }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">项目描述</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ description }}</p>
      </div>
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">项目信息</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">预算：</span>
            <span class="font-medium text-gray-900">{{ budget ? `¥${budget}` : '未设置' }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">联系方式：</span>
            <span class="font-medium text-gray-900">{{ contact }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">创建时间：</span>
            <span class="font-medium text-gray-900">{{ formatDate(createTime) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 附件区 -->
    <div v-if="attachments && attachments.length > 0" class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-3">项目附件</h3>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="(file, index) in attachments"
          :key="index"
          @click="$emit('download', file, index)"
          class="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
        >
          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ originalNames[index] || getFileNameFromUrl(file) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  initiatorType: {
    type: String,
    default: ''
  },
  field: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  budget: {
    type: [Number, String],
    default: ''
  },
  contact: {
    type: String,
    default: ''
  },
  createTime: {
    type: String,
    default: ''
  },
  attachments: {
    type: Array,
    default: () => []
  },
  originalNames: {
    type: Array,
    default: () => []
  }
});

defineEmits(['download']);

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('zh-CN');
  } catch (e) {
    return dateString;
  }
}

function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '附件';
}
</script> 