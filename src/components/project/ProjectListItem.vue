<template>
  <tr class="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
    <td class="px-6 py-4 whitespace-nowrap">
      <router-link :to="`/project/detail/${project.projectId}`" class="text-blue-600 hover:text-blue-800 font-medium">
        {{ project.title }}
      </router-link>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
      <span>{{ project.organizationName || '-' }}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ project.field || '-' }}</td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="getStatusClass(project.status)" class="px-2 py-1 rounded-full text-xs font-medium">
        {{ getStatusText(project.status) }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ project.contact }}</td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex flex-wrap gap-2">
        <router-link :to="`/project/dock/detail/${project.projectId}`">
          <button class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
            查看详情
          </button>
        </router-link>
        
        <!-- draft: 编辑、取消 -->
        <button v-if="project.status === 'draft'" @click="$emit('edit', project.projectId)" class="px-3 py-1 rounded-md bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors">编辑</button>
        <button v-if="project.status === 'draft'" @click="$emit('cancel', project.projectId)" class="px-3 py-1 rounded-md bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors">取消</button>
        
        <!-- pending: 查看申请、取消 -->
        <button v-if="project.status === 'pending'" @click="$emit('cancel', project.projectId)" class="px-3 py-1 rounded-md bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors">取消</button>
        
        <!-- active: 查看申请、终止 -->
        <button v-if="project.status === 'active'" @click="$emit('view-application', project.projectId)" class="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">查看申请</button>
        
        <!-- matched: 合同相关按钮 -->
        <template v-if="project.status === 'matched'">
          <!-- 合同全部被拒绝 -->
          <template v-if="allContractsRejected">
            <button
              @click="$emit('start-contract', project.projectId)"
              class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >重新发起合同</button>
            <button
              @click="$emit('terminate', project.projectId)"
              class="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >终止</button>
          </template>
          
          <!-- 有已签署合同 -->
          <template v-else-if="hasApprovedContract">
            <template v-if="applyFinish">
              <span
                class="px-3 py-1 rounded-md bg-gray-400 text-white text-xs font-medium cursor-pointer"
                @click="$emit('refresh')"
              >已申请结项</span>
            </template>
            <template v-else>
              <button
                @click="$emit('apply-finish', project.projectId)"
                class="px-3 py-1 rounded-md bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
              >申请结项</button>
              <button
                @click="$emit('fund-apply', project.projectId)"
                class="px-3 py-1 rounded-md bg-green-700 text-white text-xs font-medium hover:bg-green-800 transition-colors"
              >经费申请</button>
              <router-link :to="`/project/dock/fund-readonly/${project.projectId}`">
                <button
                  class="px-3 py-1 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                >经费申请详情</button>
              </router-link>
            </template>
          </template>
          
          <!-- 有待签署合同 -->
          <template v-else-if="hasPendingContract">
            <span class="px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium">等待对方签署</span>
            <button
              @click="$emit('terminate', project.projectId)"
              class="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >终止</button>
          </template>
          
          <!-- 没有合同 -->
          <template v-else>
            <button
              @click="$emit('start-contract', project.projectId)"
              class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
            >发起合同</button>
            <button
              @click="$emit('terminate', project.projectId)"
              class="px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >终止</button>
          </template>
        </template>
        
        <!-- rejected/canceled/terminated: 查看原因 -->
        <button 
          v-if="['rejected', 'canceled', 'terminated'].includes(project.status)" 
          @click="$emit('view-reason', project)" 
          class="px-3 py-1 rounded-md bg-gray-500 text-white text-xs font-medium hover:bg-gray-600 transition-colors"
        >
          查看原因
        </button>
        
        <!-- 申请合作按钮 -->
        <button 
          v-if="canApply"
          @click="$emit('apply', project.projectId)" 
          class="px-3 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
        >
          申请合作
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps({
  project: {
    type: Object,
    required: true
  },
  canApply: {
    type: Boolean,
    default: false
  },
  allContractsRejected: {
    type: Boolean,
    default: false
  },
  hasApprovedContract: {
    type: Boolean,
    default: false
  },
  hasPendingContract: {
    type: Boolean,
    default: false
  },
  applyFinish: {
    type: Boolean,
    default: false
  }
});

defineEmits([
  'edit', 
  'cancel', 
  'view-application', 
  'start-contract', 
  'terminate', 
  'apply-finish', 
  'fund-apply', 
  'refresh', 
  'view-reason', 
  'apply'
]);

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
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    draft: '未提交',
    pending: '待审核',
    active: '待合作',
    matched: '已合作',
    closed: '已完成',
    rejected: '已驳回',
    canceled: '已取消',
    terminated: '已终止'
  };
  return map[status] || status;
}
</script> 