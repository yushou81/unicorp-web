<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">账户管理</h2>
        <div class="flex items-center mb-4">
          <input v-model="search" type="text" placeholder="搜索用户名或身份" class="px-3 py-2 border rounded w-64 mr-4" />
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">身份</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-4 py-2 text-gray-700">{{ user.username }}</td>
                <td class="px-4 py-2 text-gray-700">{{ user.role }}</td>
                <td class="px-4 py-2">
                  <span :class="user.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded text-xs font-semibold">{{ user.status }}</span>
                </td>
                <td class="px-4 py-2">
                  <button @click="confirmDelete(user)" class="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700">删除用户</button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="4" class="text-center text-gray-400 py-4">暂无账户</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDeleteDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
      <h3 class="text-lg font-bold mb-4 text-red-600">确认删除</h3>
      <p class="mb-6">确定要删除用户 <span class="font-semibold">{{ userToDelete?.username }}</span> 吗？此操作不可恢复。</p>
      <div class="flex justify-end space-x-2">
        <button @click="cancelDelete" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
        <button @click="deleteUser" class="px-4 py-1 rounded bg-red-600 text-white">删除</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
const users = ref([
  { id: 1, username: 'admin', role: '平台管理员', status: '正常' },
  { id: 2, username: 'school_admin', role: '学校管理员', status: '正常' },
  { id: 3, username: 'company_admin', role: '企业管理员', status: '正常' },
  { id: 4, username: 'student01', role: '学生', status: '正常' },
  { id: 5, username: 'teacher01', role: '教师', status: '禁用' },
  // ...更多用户
])
const search = ref('')
const filteredUsers = computed(() => {
  if (!search.value) return users.value
  return users.value.filter(user =>
    user.username.includes(search.value) || user.role.includes(search.value)
  )
})
const showDeleteDialog = ref(false)
const userToDelete = ref(null)
function confirmDelete(user) {
  userToDelete.value = user
  showDeleteDialog.value = true
}
function deleteUser() {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    showDeleteDialog.value = false
    userToDelete.value = null
  }
}
function cancelDelete() {
  showDeleteDialog.value = false
  userToDelete.value = null
}
</script> 