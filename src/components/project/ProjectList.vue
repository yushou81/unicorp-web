<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发起方</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目领域</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="project in projects" :key="project.projectId" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
              <div class="text-xs text-gray-500">项目编号: {{ project.projectId }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ project.organizationName || '-' }}</div>
              <div class="text-xs text-gray-500">{{ getInitiatorTypeText(project.initiatorType) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                {{ project.field || '未分类' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full" 
                :class="getStatusClass(project.status)"
              >
                {{ getStatusText(project.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :project="project">
                <router-link :to="`/project/detail/${project.projectId}`" class="text-blue-600 hover:text-blue-900 mr-3">
                  查看详情
                </router-link>
              </slot>
            </td>
          </tr>
          <tr v-if="projects.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-gray-500">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{{ emptyText }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        共 <span class="font-medium">{{ total }}</span> 个项目
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="currentPage === 1" 
          @click="$emit('page-change', currentPage - 1)" 
          class="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <span class="px-3 py-1 text-sm text-gray-700">
          {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }}
        </span>
        <button 
          :disabled="currentPage >= Math.ceil(total / pageSize) || total === 0" 
          @click="$emit('page-change', currentPage + 1)" 
          class="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无符合条件的项目'
  }
})

defineEmits(['page-change'])

function getInitiatorTypeText(type: string): string {
  switch (type) {
    case 'school':
      return '学校发起';
    case 'enterprise':
      return '企业发起';
    default:
      return '';
  }
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    draft: '未提交',
    pending: '待审核',
    active: '待合作',
    matched: '已合作',
    closed: '已完成',
    rejected: '已拒绝',
    canceled: '已取消',
    terminated: '已终止'
  }
  return statusMap[status] || '未知'
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    matched: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-100 text-gray-800',
    terminated: 'bg-gray-100 text-gray-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}
</script> 