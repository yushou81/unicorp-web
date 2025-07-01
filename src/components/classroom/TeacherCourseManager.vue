<template>
  <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">我的全部课程</h2>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
      {{ error }}
    </div>
    
    <div v-else-if="courseList.length === 0" class="bg-gray-50 p-8 rounded-lg text-center">
      <p class="text-gray-500">暂无课程数据，点击右上角按钮创建新课程</p>
    </div>
    
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程名称</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程时间</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">企业导师</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程类型</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名人数</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="course in courseList" :key="course.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ course.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.mentorName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getCourseTypeText(course.courseType) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.enrolledCount }}/{{ course.maxStudents }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(course.status)">{{ getStatusText(course.status) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <div class="flex flex-col space-y-2">
                  <div class="flex space-x-2">
                    <button @click="$emit('edit', course)" class="text-blue-600 hover:text-blue-900">编辑</button>
                    <button @click="$emit('upload-resource', course.id)" class="text-green-600 hover:text-green-900">上传资源</button>
                    <button @click="$emit('delete', course.id)" class="text-red-600 hover:text-red-900">删除</button>
                  </div>
                  <div class="flex space-x-2">
                    <!-- 状态修改下拉菜单 -->
                    <div class="relative">
                      <button 
                        @click="toggleStatusMenu(course.id)" 
                        class="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        修改状态
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div 
                        v-if="openStatusMenuId === course.id"
                        class="absolute z-10 mt-1 bg-white shadow-lg rounded-md py-1 w-36 right-0"
                      >
                        <div 
                          v-for="status in availableStatuses" 
                          :key="status.value"
                          @click="updateCourseStatus(course.id, status.value)"
                          class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {{ status.label }}
                        </div>
                      </div>
                    </div>
                    <button @click="$emit('view-students', course.id)" class="text-purple-600 hover:text-purple-900">查看学生</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="px-6 py-4 flex justify-between items-center bg-gray-50">
        <div class="text-sm text-gray-500">
          共 {{ total }} 条记录
        </div>
        <div class="flex space-x-2">
          <button 
            @click="$emit('page-change', currentPage - 1)" 
            :disabled="currentPage <= 1"
            :class="[
              'px-3 py-1 rounded text-sm', 
              currentPage <= 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            上一页
          </button>
          <span class="px-3 py-1 text-sm text-gray-600">
            {{ currentPage }} / {{ Math.ceil(total / pageSize) || 1 }}
          </span>
          <button 
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage >= Math.ceil(total / pageSize)"
            :class="[
              'px-3 py-1 rounded text-sm', 
              currentPage >= Math.ceil(total / pageSize) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { 
  CourseStatus, 
  CourseType, 
  DualTeacherCourseVO,
  updateCourseStatus as apiUpdateCourseStatus 
} from '@/lib/api/classroom'

const props = defineProps<{
  courseList: DualTeacherCourseVO[]
  loading: boolean
  error: string
  currentPage: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'edit', course: DualTeacherCourseVO): void
  (e: 'delete', id: number): void
  (e: 'upload-resource', id: number): void
  (e: 'view-students', id: number): void
  (e: 'page-change', page: number): void
  (e: 'status-change', data: { id: number, status: CourseStatus }): void
}>()

// 状态修改相关
const openStatusMenuId = ref<number | null>(null)

// 可用的课程状态
const availableStatuses = [
  { label: '筹备中', value: CourseStatus.PLANNING },
  { label: '开放报名', value: CourseStatus.OPEN },
  { label: '进行中', value: CourseStatus.IN_PROGRESS },
  { label: '已结束', value: CourseStatus.COMPLETED },
  { label: '已取消', value: CourseStatus.CANCELLED }
]

// 切换状态菜单
function toggleStatusMenu(courseId: number) {
  if (openStatusMenuId.value === courseId) {
    openStatusMenuId.value = null
  } else {
    openStatusMenuId.value = courseId
  }
}

// 更新课程状态
async function updateCourseStatus(courseId: number, status: CourseStatus) {
  // 关闭菜单
  openStatusMenuId.value = null
  
  // 通知父组件更新状态
  emit('status-change', { id: courseId, status })
}

// 获取课程类型显示文本
function getCourseTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'online': '线上',
    'offline': '线下',
    'hybrid': '混合'
  }
  return typeMap[type] || '未知'
}

// 获取课程状态显示文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取课程状态样式类
function getStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'planning': 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800',
    'open': 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    'in_progress': 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    'completed': 'px-2 py-1 rounded text-xs bg-purple-100 text-purple-800',
    'cancelled': 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return classMap[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}
</script> 