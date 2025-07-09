<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">项目申请列表</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="applications.length === 0" class="text-gray-500 py-4 text-center">暂无申请</div>
      <table v-else class="min-w-full mb-4">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请人</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属组织</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="app in applications" :key="app.applicationId" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ app.applicantName || app.applicantId }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ app.organizationName || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(app.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-2">
                <button @click="$emit('view-info', app)" class="text-blue-600 hover:text-blue-800 font-medium">查看详情</button>
                <button v-if="app.status === 'pending'" @click="$emit('approve', app)" class="text-green-600 hover:text-green-800 font-medium">同意</button>
                <button v-if="app.status === 'pending'" @click="$emit('reject', app)" class="text-red-600 hover:text-red-800 font-medium">拒绝</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="flex justify-end">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
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
  applications: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'view-info', 'approve', 'reject']);

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}
</script> 