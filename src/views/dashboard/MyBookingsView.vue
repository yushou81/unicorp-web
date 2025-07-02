<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 返回按钮 -->
      <router-link to="/dashboard/student" class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeft class="w-5 h-5 mr-1" />
        返回个人中心
      </router-link>
      
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 class="text-2xl font-bold text-blue-700 mb-6">我的设备预约申请</h1>
        
        <div v-if="loading" class="text-center text-gray-400 py-8">加载中...</div>
        <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>
        <div v-else-if="bookings.length === 0" class="text-center text-gray-500 py-8">暂无预约申请记录</div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">结束时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用目的</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-4 py-4">{{ booking.resourceTitle }}</td>
                <td class="px-4 py-4">{{ formatDateTime(booking.startTime) }}</td>
                <td class="px-4 py-4">{{ formatDateTime(booking.endTime) }}</td>
                <td class="px-4 py-4">{{ booking.purpose }}</td>
                <td class="px-4 py-4">
                  <span 
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="getStatusColor(booking.status)"
                  >
                    {{ getStatusText(booking.status) }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <Button 
                    v-if="booking.status === 'PENDING'" 
                    size="sm" 
                    variant="destructive" 
                    @click="cancelBooking(booking.id)"
                  >
                    取消申请
                  </Button>
                  <span v-else-if="booking.status === 'REJECTED'" class="text-sm text-gray-500">
                    {{ booking.rejectReason ? `拒绝原因: ${booking.rejectReason}` : '已拒绝' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { getMyEquipmentBookings, cancelEquipmentBooking } from '@/lib/api/resource'

// 设备预约数据
const bookings = ref<any[]>([])
const loading = ref(true)
const error = ref('')

// 获取所有设备预约
const fetchBookings = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMyEquipmentBookings()
    if (res.code === 200 && res.data) {
      bookings.value = res.data
    } else {
      error.value = '获取预约列表失败'
    }
  } catch (e: any) {
    error.value = e.message || '获取预约列表失败'
  } finally {
    loading.value = false
  }
}

// 取消预约
const cancelBooking = async (bookingId: number) => {
  try {
    await cancelEquipmentBooking(bookingId)
    alert('预约已取消')
    fetchBookings() // 重新加载列表
  } catch (e: any) {
    alert('取消失败: ' + (e.message || '未知错误'))
  }
}

// 格式化日期时间
const formatDateTime = (timeString: string) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'REJECTED': '已拒绝',
    'CANCELED': '已取消'
  }
  return statusMap[status] || status
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'CANCELED': 'bg-gray-100 text-gray-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchBookings()
})
</script> 