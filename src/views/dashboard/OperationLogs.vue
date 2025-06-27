<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">操作日志</h2>
        <div class="flex items-center mb-4">
          <input v-model="search" type="text" placeholder="搜索用户或操作内容" class="px-3 py-2 border rounded w-64 mr-4" />
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作内容</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">结果</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="log in filteredLogs" :key="log.id">
                <td class="px-4 py-2 text-gray-700">{{ log.time }}</td>
                <td class="px-4 py-2 text-gray-700">{{ log.user }}</td>
                <td class="px-4 py-2 text-gray-700">{{ log.action }}</td>
                <td class="px-4 py-2">
                  <span :class="log.result === '成功' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded text-xs font-semibold">{{ log.result }}</span>
                </td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="4" class="text-center text-gray-400 py-4">暂无日志</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
          <span class="text-gray-600 text-sm">第 {{ page }} 页</span>
          <button @click="nextPage" :disabled="page * pageSize >= filteredLogs.length" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
const logs = ref([
  { id: 1, time: '2024-06-01 10:00', user: 'admin', action: '添加学校', result: '成功' },
  { id: 2, time: '2024-06-01 10:05', user: 'school_admin', action: '编辑学校信息', result: '成功' },
  { id: 3, time: '2024-06-01 10:10', user: 'company_admin', action: '发布职位', result: '失败' },
  { id: 4, time: '2024-06-01 10:15', user: 'admin', action: '重置用户密码', result: '成功' },
  // ...更多日志
])
const search = ref('')
const page = ref(1)
const pageSize = 10
const filteredLogs = computed(() => {
  let filtered = logs.value
  if (search.value) {
    filtered = filtered.filter(log =>
      log.user.includes(search.value) || log.action.includes(search.value)
    )
  }
  return filtered.slice((page.value - 1) * pageSize, page.value * pageSize)
})
function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value * pageSize < logs.value.length) page.value++
}
</script> 