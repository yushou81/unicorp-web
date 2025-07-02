<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">设备申请管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/dashboard/school" class="text-sm text-blue-600 hover:text-blue-800">返回仪表盘</router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-blue-700">设备申请列表</h2>
          </div>
          
          <div v-if="bookingLoading" class="text-center text-gray-400 py-8">加载中...</div>
          <div v-else-if="bookingError" class="text-center text-red-500 py-8">{{ bookingError }}</div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">申请时间</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">结束时间</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">用途</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="booking in bookings" :key="booking.id">
                  <td class="px-4 py-2">{{ booking.userName || booking.userEmail || '未知用户' }}</td>
                  <td class="px-4 py-2">{{ booking.resourceName || '未知设备' }}</td>
                  <td class="px-4 py-2">{{ formatDateTime(booking.createTime) }}</td>
                  <td class="px-4 py-2">{{ formatDateTime(booking.startTime) }}</td>
                  <td class="px-4 py-2">{{ formatDateTime(booking.endTime) }}</td>
                  <td class="px-4 py-2">
                    <span :title="booking.purpose" class="block truncate max-w-xs">
                      {{ booking.purpose || '无' }}
                    </span>
                  </td>
                  <td class="px-4 py-2">
                    <span 
                      class="px-2 py-1 text-xs rounded" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': booking.status === 'PENDING',
                        'bg-green-100 text-green-800': booking.status === 'APPROVED',
                        'bg-red-100 text-red-800': booking.status === 'REJECTED',
                        'bg-gray-100 text-gray-800': !['PENDING', 'APPROVED', 'REJECTED'].includes(booking.status)
                      }"
                    >
                      {{ getStatusText(booking.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-2 space-x-2">
                    <Button 
                      v-if="booking.status === 'PENDING'"
                      size="sm" 
                      variant="default" 
                      @click="openReviewDialog(booking.id, true)"
                    >
                      通过
                    </Button>
                    <Button 
                      v-if="booking.status === 'PENDING'"
                      size="sm" 
                      variant="destructive" 
                      @click="openReviewDialog(booking.id, false)"
                    >
                      拒绝
                    </Button>
                    <span v-else class="text-xs text-gray-500">{{ booking.status === 'APPROVED' ? '已通过' : '已拒绝' }}</span>
                  </td>
                </tr>
                <tr v-if="bookings.length === 0">
                  <td colspan="8" class="text-center text-gray-400 py-4">暂无设备申请记录</td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-end mt-4" v-if="bookingTotal > bookingSize">
              <button @click="bookingPage > 0 && (bookingPage--, fetchBookings())" :disabled="bookingPage === 0" class="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2">上一页</button>
              <span class="text-sm text-gray-500">第 {{ bookingPage + 1 }} 页 / 共 {{ Math.ceil(bookingTotal / bookingSize) }} 页</span>
              <button @click="(bookingPage + 1) * bookingSize < bookingTotal && (bookingPage++, fetchBookings())" :disabled="(bookingPage + 1) * bookingSize >= bookingTotal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2">下一页</button>
            </div>
          </div>
        </div>
        
        <!-- 筛选控制面板 -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">筛选条件</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">申请状态</label>
              <select 
                v-model="filterStatus" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                @change="resetPageAndFetch"
              >
                <option value="">全部状态</option>
                <option value="PENDING">待审核</option>
                <option value="APPROVED">已通过</option>
                <option value="REJECTED">已拒绝</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">每页显示</label>
              <select 
                v-model="bookingSize" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                @change="resetPageAndFetch"
              >
                <option :value="10">10条/页</option>
                <option :value="20">20条/页</option>
                <option :value="50">50条/页</option>
              </select>
            </div>
            <div class="flex items-end">
              <Button @click="resetPageAndFetch" class="px-4 py-2">刷新列表</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 审核对话框 -->
    <div v-if="showReviewDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ reviewApproved ? '通过申请' : '拒绝申请' }}</h2>
        <div v-if="!reviewApproved" class="mb-4">
          <label class="block text-gray-700 mb-1">拒绝原因</label>
          <textarea 
            v-model="reviewReason" 
            rows="3" 
            class="w-full px-3 py-2 border rounded" 
            placeholder="请输入拒绝原因（选填）"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button type="button" @click="showReviewDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
          <button 
            type="button" 
            @click="submitReview" 
            :disabled="reviewLoading" 
            class="px-4 py-1 rounded bg-blue-600 text-white"
          >
            {{ reviewLoading ? '处理中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEquipmentBookings, reviewEquipmentBooking } from '@/lib/api/resource'
import Button from '@/components/ui/Button.vue'

// 设备预约相关
const bookings = ref<any[]>([])
const bookingTotal = ref(0)
const bookingPage = ref(0)
const bookingSize = ref(10)
const bookingLoading = ref(false)
const bookingError = ref('')
const filterStatus = ref('PENDING') // 默认只显示待审核的申请

// 获取设备预约列表
async function fetchBookings() {
  bookingLoading.value = true
  bookingError.value = ''
  try {
    const res = await getEquipmentBookings({ 
      page: bookingPage.value, 
      size: bookingSize.value,
      status: filterStatus.value || undefined // 如果为空字符串则不传该参数
    })
    if (res.code === 200 && res.data) {
      bookings.value = res.data.records || []
      bookingTotal.value = res.data.total || bookings.value.length
    }
  } catch (e: any) {
    bookingError.value = e.message || '获取预约列表失败'
    bookings.value = []
  } finally {
    bookingLoading.value = false
  }
}

// 重置页码并获取数据
function resetPageAndFetch() {
  bookingPage.value = 0
  fetchBookings()
}

// 审核预约申请
const showReviewDialog = ref(false)
const reviewBookingId = ref<number | null>(null)
const reviewApproved = ref(true)
const reviewReason = ref('')
const reviewLoading = ref(false)

// 打开审核对话框
function openReviewDialog(bookingId: number, isApprove: boolean) {
  reviewBookingId.value = bookingId
  reviewApproved.value = isApprove
  reviewReason.value = ''
  showReviewDialog.value = true
}

// 提交审核结果
async function submitReview() {
  if (!reviewBookingId.value) return
  
  reviewLoading.value = true
  try {
    const reviewData = {
      bookingId: reviewBookingId.value,
      approved: reviewApproved.value,
      rejectReason: !reviewApproved.value ? reviewReason.value : undefined
    }
    
    await reviewEquipmentBooking(reviewData)
    
    showReviewDialog.value = false
    alert(`申请已${reviewApproved.value ? '通过' : '拒绝'}`)
    fetchBookings() // 重新加载预约列表
  } catch (e: any) {
    console.error('审核失败:', e)
    alert('审核失败: ' + (e.message || '未知错误'))
  } finally {
    reviewLoading.value = false
  }
}

// 格式化日期时间
function formatDateTime(dateTimeString: string) {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'REJECTED': '已拒绝',
    'CANCELED': '已取消',
    'COMPLETED': '已完成'
  }
  return statusMap[status] || status
}

onMounted(() => {
  fetchBookings()
})
</script> 