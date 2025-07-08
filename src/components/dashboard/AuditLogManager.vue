<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-blue-700">操作日志</h2>
    
    <!-- 统计信息卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ statistics.totalLogs || 0 }}</div>
        <div class="text-sm text-blue-500">总日志数</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ statistics.todayLogs || 0 }}</div>
        <div class="text-sm text-green-500">今日日志</div>
      </div>
    </div>
    <!-- 筛选结果统计 -->
    <div class="mb-4 text-gray-600 text-sm">
      筛选结果：<span class="font-bold text-blue-600">{{ logs.length }}</span> 条
    </div>

    <!-- 筛选条件 -->
    <div class="bg-gray-50 p-4 rounded-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input 
            v-model="filters.username" 
            type="text" 
            placeholder="输入用户名"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
          <input 
            v-model="filters.startTime" 
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
          <input 
            v-model="filters.endTime" 
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">操作结果</label>
          <select v-model="filters.result" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">全部</option>
            <option value="成功">成功</option>
            <option value="警告">警告</option>
            <option value="错误">错误</option>
            <option value="失败">失败</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4 space-x-2">
        <Button @click="resetFilters" variant="outline" size="sm">重置</Button>
        <Button @click="fetchLogs" :loading="loading" size="sm">查询</Button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div v-if="loading" class="text-center text-gray-400 py-8">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>
    <div v-else>
      <div v-if="logs.length === 0" class="text-gray-400 text-center py-8">暂无失败操作日志</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结果</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in pagedLogs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900 font-medium">
                {{ log.userName || '-' }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ formatTime(log.timestamp) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ log.ip || '-' }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="resultLabelColor(log.result)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ log.result || '-' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件 -->
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">每页显示:</span>
          <select 
            :value="pageSize" 
            @change="onPageSizeChange(Number($event.target.value))"
            class="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="text-sm text-gray-700">条</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页，总计 {{ totalLogs }} 条记录
          </span>
          <div class="flex space-x-1">
            <Button 
              @click="onPageChange(currentPage - 1)" 
              :disabled="currentPage <= 1"
              variant="outline" 
              size="sm"
            >
              上一页
            </Button>
            <Button 
              @click="onPageChange(currentPage + 1)" 
              :disabled="currentPage >= totalPages"
              variant="outline" 
              size="sm"
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import { getAuditLogs, getAuditLogStatistics } from '@/lib/api/admin'

// 响应式数据
const logs = ref<any[]>([])
const statistics = ref<any>({})
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalLogs = ref(0)
const totalPages = ref(0)

const filters = reactive({
  username: '',
  startTime: '',
  endTime: '',
  result: '' // ''=全部, '成功', '警告', '错误', '失败'
})

// 方法
async function fetchLogs() {
  loading.value = true
  error.value = ''
  try {
    // 全量拉取所有日志
    const params: any = {
      page: 1,
      size: 10000 // 假设不会超过1万条
    }
    if (filters.startTime) params.startTime = filters.startTime
    if (filters.endTime) params.endTime = filters.endTime
    const response = await getAuditLogs(params)
    if (response.data) {
      let filteredLogs = response.data.records || []
      if (filters.username) {
        filteredLogs = filteredLogs.filter(log =>
          log.userName && log.userName.toLowerCase().includes(filters.username.toLowerCase())
        )
      }
      if (filters.result) {
        filteredLogs = filteredLogs.filter(log => log.result === filters.result)
      }
      logs.value = filteredLogs
      totalLogs.value = filteredLogs.length
      totalPages.value = Math.ceil(filteredLogs.length / pageSize.value)
      currentPage.value = 1 // 每次筛选后回到第一页
    }
  } catch (e: any) {
    error.value = e.message || '获取日志失败'
  } finally {
    loading.value = false
  }
}

async function fetchStatistics() {
  try {
    const response = await getAuditLogStatistics()
    if (response.data) {
      statistics.value.totalLogs = response.data.totalLogs || 0
      statistics.value.todayLogs = response.data.todayLogs || 0
      // 下面两个字段由fetchLogs动态统计
      // statistics.value.successCount = response.data.successCount || 0
      // statistics.value.failureCount = response.data.failureCount || 0
    }
  } catch (e: any) {
    console.error('获取统计信息失败:', e)
  }
}

function resetFilters() {
  filters.username = ''
  filters.startTime = ''
  filters.endTime = ''
  filters.result = '' // 重置操作结果
  currentPage.value = 1
  fetchLogs()
}

function onPageChange(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchLogs()
  }
}

function onPageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchLogs()
}

function formatDate(dateTime: string) {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleDateString('zh-CN')
}

function formatTime(dateTime: string) {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleTimeString('zh-CN')
}

function resultLabelColor(result: string) {
  if (result === '成功') return 'bg-green-100 text-green-800'
  if (result === '警告') return 'bg-yellow-100 text-yellow-800'
  if (result === '错误' || result === '失败') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

// 分页显示筛选后的数据
const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return logs.value.slice(start, end)
})

onMounted(() => {
  fetchStatistics()
  fetchLogs()
})
</script> 