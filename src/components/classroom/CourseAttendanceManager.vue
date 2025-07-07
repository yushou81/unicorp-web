<template>
  <div class="bg-white rounded-xl shadow p-6 mb-6">
    <!-- 标题区美化 -->
    <div class="flex items-center mb-6">
      <div class="w-1.5 h-6 bg-blue-500 rounded mr-3"></div>
      <h3 class="text-xl font-bold text-gray-900 tracking-wide">课程出勤管理</h3>
    </div>
    <!-- 操作区美化 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <input type="date" v-model="selectedDate" class="border rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-200" />
      <button @click="loadAttendance" class="px-4 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">查询</button>
      <button v-if="canManageAttendance" @click="showAddModal = true" class="px-4 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">录入出勤</button>
      <button @click="loadStudents" class="px-4 py-1 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200 transition">刷新学生</button>
      <span class="text-sm text-gray-600 ml-2">学生数量: {{ students.length }}</span>
      <span v-if="!canManageAttendance" class="text-sm text-orange-600 ml-2">（仅查看模式）</span>
    </div>
    <div v-if="loading" class="py-6 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    <div v-else>
      <!-- 空状态美化 -->
      <div v-if="displayAttendanceList.length === 0" class="flex flex-col items-center py-12 text-gray-400">
        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" /></svg>
        <span>暂无出勤数据</span>
      </div>
      <!-- 表格美化 -->
      <table v-else class="min-w-full rounded-lg overflow-hidden shadow border border-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">学生姓名</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">状态</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">备注</th>
            <th v-if="canManageAttendance" class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayAttendanceList" :key="item.studentId" class="hover:bg-blue-50 even:bg-gray-50 transition">
            <td class="px-4 py-2">{{ item.studentName }}</td>
            <td class="px-4 py-2">
              <span :class="statusClass(item.status)">{{ statusText(item.status) }}</span>
            </td>
            <td class="px-4 py-2">{{ item.remark || '-' }}</td>
            <td v-if="canManageAttendance" class="px-4 py-2 space-x-2">
              <button @click="editAttendance(item)" class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition" title="编辑">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2h2v-2h2v-2h-2v-2h-2v2H9v2z" /></svg>编辑
              </button>
              <button @click="deleteAttendanceRecord(item.id, item.status)" class="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition" title="删除">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 录入/编辑出勤弹窗 -->
    <div v-if="showAddModal || editingAttendance" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-medium">{{ editingAttendance ? '编辑出勤' : '录入出勤' }}</h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveAttendance">
          <!-- 单个学生录入模式 -->
          <div v-if="editingAttendance || !batchMode" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">学生</label>
                <select v-model="attendanceForm.studentId" class="w-full border rounded px-3 py-2" :disabled="!!editingAttendance" required>
                  <option value="">请选择学生</option>
                  <option v-for="stu in students" :key="stu.id" :value="stu.id">{{ stu.nickname || stu.name || stu.account }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">日期</label>
                <input type="date" v-model="attendanceForm.date" class="w-full border rounded px-3 py-2" required />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">状态</label>
                <select v-model="attendanceForm.status" class="w-full border rounded px-3 py-2" required>
                  <option value="present">出勤</option>
                  <option value="absent">缺勤</option>
                  <option value="late">迟到</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">备注</label>
                <input v-model="attendanceForm.remark" class="w-full border rounded px-3 py-2" placeholder="可选" />
              </div>
            </div>
          </div>
          
          <!-- 批量录入模式 -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <h5 class="text-md font-medium">批量录入 - {{ selectedDate }}</h5>
              <div class="flex space-x-2">
                <button type="button" @click="setAllStatus('present')" class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">全部出勤</button>
                <button type="button" @click="setAllStatus('absent')" class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">全部缺勤</button>
                <button type="button" @click="setAllStatus('late')" class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">全部迟到</button>
              </div>
            </div>
            
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">学生姓名</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">状态</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">备注</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3">{{ student.name }}</td>
                    <td class="px-4 py-3">
                      <select v-model="batchAttendance[student.id].status" class="border rounded px-2 py-1 text-sm">
                        <option value="present">出勤</option>
                        <option value="absent">缺勤</option>
                        <option value="late">迟到</option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="batchAttendance[student.id].remark" class="border rounded px-2 py-1 text-sm w-full" placeholder="可选" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-6 pt-4 border-t">
            <div v-if="!editingAttendance" class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="checkbox" v-model="batchMode" class="mr-2" />
                <span class="text-sm">批量录入模式</span>
              </label>
            </div>
            <div class="flex space-x-2">
              <button type="button" @click="closeModal" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">取消</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {
  getCourseAttendanceByDate,
  recordAttendance,
  updateAttendance,
  deleteAttendance,
  getCourseStudents,
  CourseAttendanceVO,
  CourseAttendanceDTO
} from '@/lib/api/classroom'

const props = defineProps({
  courseId: {
    type: Number,
    required: true
  },
  userRole: {
    type: String,
    default: ''
  }
})

const loading = ref(false)
const saving = ref(false)
const students = ref<any[]>([])
const attendanceList = ref<CourseAttendanceVO[]>([])
const selectedDate = ref<string>(new Date().toISOString().slice(0, 10))
const showAddModal = ref(false)
const editingAttendance = ref<CourseAttendanceVO | null>(null)
const batchMode = ref(false)

const attendanceForm = ref<CourseAttendanceDTO>({
  courseId: props.courseId,
  studentId: 0,
  date: selectedDate.value,
  status: 'present',
  remark: ''
})

// 批量录入数据
const batchAttendance = ref<Record<number, { status: string, remark: string }>>({})

// 权限控制
const canManageAttendance = computed(() => {
  const role = props.userRole?.toUpperCase()
  // 只有教师可以管理出勤，企业导师只能查看
  return role === 'TEACHER'
})



// 初始化批量录入数据
const initBatchAttendance = () => {
  batchAttendance.value = {}
  students.value.forEach(student => {
    batchAttendance.value[student.id] = {
      status: 'present',
      remark: ''
    }
  })
}

// 设置所有学生状态
const setAllStatus = (status: string) => {
  Object.keys(batchAttendance.value).forEach(studentId => {
    batchAttendance.value[Number(studentId)].status = status
  })
}

const loadStudents = async () => {
  try {
    console.log('开始加载学生列表，课程ID:', props.courseId)
    const res = await getCourseStudents(props.courseId)
    console.log('学生列表API响应:', res)
    if (res.code === 200) {
      students.value = res.data || []
      console.log('设置学生列表:', students.value)
      initBatchAttendance()
    } else {
      console.error('获取学生列表失败:', res.message)
      students.value = []
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
    students.value = []
  }
}

const loadAttendance = async () => {
  loading.value = true
  try {
    const res = await getCourseAttendanceByDate(props.courseId, selectedDate.value)
    if (res.code === 200) {
      attendanceList.value = res.data || []
    } else {
      attendanceList.value = []
    }
  } catch (error) {
    console.error('加载出勤记录失败:', error)
    attendanceList.value = []
  } finally {
    loading.value = false
  }
}

const saveAttendance = async () => {
  if (editingAttendance.value) {
    // 编辑单个记录
    await saveSingleAttendance()
  } else if (batchMode.value) {
    // 批量保存
    await saveBatchAttendance()
  } else {
    // 保存单个记录
    await saveSingleAttendance()
  }
}

// 单个录入保存
const saveSingleAttendance = async () => {
  if (!attendanceForm.value.studentId || !attendanceForm.value.date) {
    alert('请填写完整信息')
    return
  }
  saving.value = true
  try {
    if (editingAttendance.value) {
      // 编辑模式，调用 updateAttendance
      await updateAttendance(
        editingAttendance.value.id,
        attendanceForm.value.status,
        attendanceForm.value.remark
      )
    } else {
      // 新增模式，调用批量格式API
      await recordAttendance({
        courseId: props.courseId,
        attendanceDate: attendanceForm.value.date,
        studentRecords: [
          {
            studentId: attendanceForm.value.studentId,
            status: attendanceForm.value.status,
            remark: attendanceForm.value.remark
          }
        ],
        remark: ''
      })
    }
    closeModal()
    await loadAttendance()
  } catch (error) {
    console.error('保存出勤记录失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 批量录入保存
const saveBatchAttendance = async () => {
  saving.value = true
  try {
    const studentRecords = students.value.map(stu => ({
      studentId: stu.id,
      status: batchAttendance.value[stu.id].status,
      remark: batchAttendance.value[stu.id].remark
    }))
    await recordAttendance({
      courseId: props.courseId,
      attendanceDate: selectedDate.value,
      studentRecords,
      remark: ''
    })
    closeModal()
    await loadAttendance()
  } catch (error) {
    console.error('批量保存出勤记录失败:', error)
    alert('批量保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 编辑方法调整
const editAttendance = (item) => {
  if (item.status === 'not_arrived') {
    // 新增模式，预填学生信息
    editingAttendance.value = null
    attendanceForm.value = {
      courseId: props.courseId,
      studentId: item.studentId,
      date: selectedDate.value,
      status: 'present',
      remark: ''
    }
    showAddModal.value = true
  } else {
    // 编辑模式
    editingAttendance.value = {
      id: item.id,
      courseId: props.courseId,
      studentId: item.studentId,
      date: selectedDate.value,
      status: item.status,
      remark: item.remark || ''
    }
    attendanceForm.value = { ...editingAttendance.value }
    showAddModal.value = true
  }
}

// 删除方法调整
const deleteAttendanceRecord = async (id, status) => {
  if (status === 'not_arrived' || !id) {
    alert('该学生无出勤记录，无需删除')
    return
  }
  if (!confirm('确定要删除该出勤记录吗？')) return
  loading.value = true
  try {
    await deleteAttendance(id)
    await loadAttendance()
  } catch (error) {
    console.error('删除出勤记录失败:', error)
    alert('删除失败，请重试')
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingAttendance.value = null
  batchMode.value = false
  attendanceForm.value = {
    courseId: props.courseId,
    studentId: 0,
    date: selectedDate.value,
    status: 'present',
    remark: ''
  }
  initBatchAttendance()
}

// 计算学生出勤展示列表
const attendanceMap = computed(() => {
  const map = new Map<number, CourseAttendanceVO>()
  attendanceList.value.forEach(item => {
    map.set(item.studentId, item)
  })
  return map
})

const displayAttendanceList = computed(() => {
  return students.value.map(stu => {
    const record = attendanceMap.value.get(stu.id)
    return {
      id: record ? record.id : undefined,
      studentId: stu.id,
      studentName: stu.nickname || stu.name || stu.account,
      status: record ? record.status : 'not_arrived',
      remark: record ? record.remark : ''
    }
  })
})

const statusText = (status: string) => {
  switch (status) {
    case 'present': return '出勤'
    case 'absent': return '缺勤'
    case 'late': return '迟到'
    case 'not_arrived': return '未到'
    default: return status
  }
}

// 状态标签美化
const statusClass = (status: string) => {
  switch (status) {
    case 'present': return 'inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium'
    case 'absent': return 'inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium'
    case 'late': return 'inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-medium'
    case 'not_arrived': return 'inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-xs font-medium'
    default: return 'inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium'
  }
}

onMounted(() => {
  loadStudents()
  loadAttendance()
})

watch(selectedDate, loadAttendance)
</script> 