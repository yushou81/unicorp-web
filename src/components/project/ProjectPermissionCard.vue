<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">权限分配</h3>
      <button 
        v-if="isProjectOwner" 
        @click="$emit('add-member')"
        class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        添加成员
      </button>
    </div>
    
    <div v-if="members.length === 0" class="text-center py-8 text-gray-500">
      暂无项目成员
    </div>
    <div v-else>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成员</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加入时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到期时间</th>
            <th v-if="isProjectOwner" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(member, index) in members" :key="index" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8">
                  <img 
                    :src="member.avatar || 'https://via.placeholder.com/40'" 
                    class="h-8 w-8 rounded-full"
                    alt="用户头像"
                  />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                  <div class="text-xs text-gray-500">{{ member.email || member.phone }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(role, roleIndex) in member.roles" 
                  :key="roleIndex"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleClass(role)"
                >
                  {{ getRoleName(role) }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(member.joinTime) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ member.expireTime ? formatDate(member.expireTime) : '永久' }}
            </td>
            <td v-if="isProjectOwner" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('edit-member', member)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                编辑
              </button>
              <button 
                v-if="!isOwner(member)"
                @click="$emit('remove-member', member.userId)"
                class="text-red-600 hover:text-red-900"
              >
                移除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  isProjectOwner: {
    type: Boolean,
    default: false
  },
  ownerId: {
    type: [Number, String],
    default: ''
  }
})

defineEmits(['add-member', 'edit-member', 'remove-member'])

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('zh-CN')
  } catch (e) {
    return dateString
  }
}

function getRoleName(role: string): string {
  const roleMap: Record<string, string> = {
    owner: '所有者',
    admin: '管理员',
    editor: '编辑者',
    viewer: '查看者'
  }
  return roleMap[role] || role
}

function getRoleClass(role: string): string {
  const classMap: Record<string, string> = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-green-100 text-green-800'
  }
  return classMap[role] || 'bg-gray-100 text-gray-800'
}

function isOwner(member: any): boolean {
  return member.userId === props.ownerId || member.roles.includes('owner')
}
</script> 