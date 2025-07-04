<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">评价数据导出</h3>
      <div class="flex space-x-2">
        <button
          @click="exportToCSV"
          :disabled="exporting"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting ? '导出中...' : '导出CSV' }}
        </button>
        <button
          @click="exportToExcel"
          :disabled="exporting"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ exporting ? '导出中...' : '导出Excel' }}
        </button>
      </div>
    </div>
    
    <!-- 导出选项 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
        <select
          v-model="exportOptions.dateRange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部时间</option>
          <option value="week">最近一周</option>
          <option value="month">最近一月</option>
          <option value="quarter">最近一季度</option>
          <option value="year">最近一年</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">评分范围</label>
        <select
          v-model="exportOptions.ratingRange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部评分</option>
          <option value="5">5星</option>
          <option value="4-5">4-5星</option>
          <option value="3-5">3-5星</option>
          <option value="1-2">1-2星</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">包含字段</label>
        <div class="space-y-1">
          <label class="flex items-center">
            <input
              v-model="exportOptions.includeStudentInfo"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">学生信息</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="exportOptions.includeTimestamp"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">时间戳</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- 导出统计 -->
    <div v-if="exportStats" class="bg-gray-50 rounded-lg p-3">
      <div class="text-sm text-gray-600">
        将导出 <span class="font-medium text-gray-900">{{ exportStats.count }}</span> 条评价记录
        <span v-if="exportStats.dateRange" class="ml-2">({{ exportStats.dateRange }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CourseRatingVO } from '@/lib/api/classroom'

const props = defineProps<{
  ratings: CourseRatingVO[]
  courseTitle: string
}>()

const exporting = ref(false)
const exportStats = ref<{ count: number; dateRange?: string } | null>(null)

const exportOptions = ref({
  dateRange: 'all',
  ratingRange: 'all',
  includeStudentInfo: true,
  includeTimestamp: true
})

// 根据选项过滤评价数据
const filteredRatings = computed(() => {
  let filtered = [...props.ratings]
  
  // 时间范围过滤
  if (exportOptions.value.dateRange !== 'all') {
    const now = new Date()
    let startDate: Date
    
    switch (exportOptions.value.dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }
    
    filtered = filtered.filter(rating => new Date(rating.createdAt) >= startDate)
  }
  
  // 评分范围过滤
  if (exportOptions.value.ratingRange !== 'all') {
    switch (exportOptions.value.ratingRange) {
      case '5':
        filtered = filtered.filter(rating => rating.rating === 5)
        break
      case '4-5':
        filtered = filtered.filter(rating => rating.rating >= 4)
        break
      case '3-5':
        filtered = filtered.filter(rating => rating.rating >= 3)
        break
      case '1-2':
        filtered = filtered.filter(rating => rating.rating <= 2)
        break
    }
  }
  
  return filtered
})

// 监听选项变化，更新统计信息
watch([exportOptions, filteredRatings], () => {
  updateExportStats()
}, { immediate: true })

// 更新导出统计
const updateExportStats = () => {
  const count = filteredRatings.value.length
  let dateRange = ''
  
  if (exportOptions.value.dateRange !== 'all') {
    const rangeTexts = {
      week: '最近一周',
      month: '最近一月',
      quarter: '最近一季度',
      year: '最近一年'
    }
    dateRange = rangeTexts[exportOptions.value.dateRange] || ''
  }
  
  exportStats.value = { count, dateRange }
}

// 导出为CSV
const exportToCSV = async () => {
  exporting.value = true
  try {
    const csvContent = generateCSV()
    downloadFile(csvContent, `${props.courseTitle}-评价数据.csv`, 'text/csv')
  } catch (error) {
    console.error('导出CSV失败:', error)
  } finally {
    exporting.value = false
  }
}

// 导出为Excel
const exportToExcel = async () => {
  exporting.value = true
  try {
    // 这里可以集成xlsx库来生成真正的Excel文件
    // 暂时使用CSV格式，但文件扩展名为xlsx
    const csvContent = generateCSV()
    downloadFile(csvContent, `${props.courseTitle}-评价数据.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  } catch (error) {
    console.error('导出Excel失败:', error)
  } finally {
    exporting.value = false
  }
}

// 生成CSV内容
const generateCSV = () => {
  const headers = ['评价ID', '评分', '评价内容']
  
  if (exportOptions.value.includeStudentInfo) {
    headers.splice(2, 0, '学生姓名')
  }
  
  if (exportOptions.value.includeTimestamp) {
    headers.push('评价时间')
  }
  
  const csvRows = [headers.join(',')]
  
  filteredRatings.value.forEach(rating => {
    const row = [
      rating.id.toString(),
      rating.rating.toString(),
      exportOptions.value.includeStudentInfo ? rating.studentName : '',
      `"${rating.content.replace(/"/g, '""')}"`, // 转义双引号
      exportOptions.value.includeTimestamp ? formatDate(rating.createdAt) : ''
    ].filter(Boolean) // 移除空值
    
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

// 下载文件
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 