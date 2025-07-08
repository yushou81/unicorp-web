<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <div class="container mx-auto px-4 py-10">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">双师课堂管理</h1>
        <button 
          @click="openCreateCourseDialog" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          创建新课程
        </button>
      </div>
      
      <!-- 使用课程管理组件 -->
      <TeacherCourseManager
        :course-list="courseList"
        :loading="courseLoading"
        :error="courseError"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalCourses"
        @edit="openEditCourseDialog"
        @delete="onDeleteCourse"
        @upload-resource="openResourceUploadDialog"
        @view-students="viewCourseStudents"
        @page-change="handlePageChange"
        @status-change="handleStatusChange"
      />
    </div>
    
    <!-- 课程创建/编辑对话框 -->
    <div v-if="showCourseDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">{{ isEditingCourse ? '编辑课程' : '创建新课程' }}</h2>
        <form @submit.prevent="saveCourse">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程标题</label>
            <input v-model="courseForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">课程描述</label>
            <textarea v-model="courseForm.description" rows="3" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
          </div>
          
          <!-- 企业导师搜索部分 -->
          <div class="mb-5 border-b pb-5">
            <label class="block text-gray-700 mb-1">企业导师</label>
            
            <div v-if="selectedMentor" class="flex items-center justify-between bg-blue-50 p-3 rounded mb-2">
              <div>
                <div class="font-semibold">{{ selectedMentor.name }}</div>
                <div class="text-xs text-gray-500">导师ID: {{ selectedMentor.id }}</div>
              </div>
              <button 
                type="button" 
                @click="clearSelectedMentor" 
                class="text-red-600 text-sm hover:text-red-800"
              >
                移除
              </button>
            </div>
            
            <div v-else>
              <div class="flex mb-2">
                <input 
                  v-model="mentorSearchKeyword" 
                  class="flex-1 px-3 py-2 border rounded-l" 
                  placeholder="输入导师邮箱或手机号查询" 
                />
                <button 
                  type="button" 
                  @click="searchMentor" 
                  :disabled="mentorSearching" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
                >
                  {{ mentorSearching ? '查询中...' : '查询' }}
                </button>
              </div>
              
              <div v-if="mentorSearchResults.length > 0" class="border rounded mt-2 max-h-40 overflow-y-auto">
                <div 
                  v-for="mentor in mentorSearchResults" 
                  :key="mentor.id"
                  class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                  @click="selectMentor(mentor)"
                >
                  <div class="font-medium">{{ mentor.nickname || mentor.account }}</div>
                  <div class="text-xs text-gray-500">
                    {{ mentor.email || '无邮箱' }} | {{ mentor.phone || '无手机号' }}
                  </div>
                </div>
              </div>
              
              <div v-if="!selectedMentor" class="text-xs text-gray-500 mt-1">
                必须选择一位企业导师进行双师课堂的创建
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程时间</label>
              <input v-model="courseForm.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">最大学生人数</label>
              <input v-model="courseForm.maxStudents" type="number" min="1" class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程地点</label>
              <input v-model="courseForm.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程类型</label>
              <select v-model="courseForm.courseType" class="w-full px-3 py-2 border rounded">
                <option value="online">线上</option>
                <option value="offline">线下</option>
                <option value="hybrid">混合</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="showCourseDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="savingCourse" class="px-4 py-1 rounded bg-blue-600 text-white">
              {{ savingCourse ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 资源上传对话框 -->
    <div v-if="showResourceDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">上传课程资源</h2>
        <form @submit.prevent="uploadCourseResource">
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源标题</label>
            <input v-model="resourceForm.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入资源标题" />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源描述</label>
            <textarea v-model="resourceForm.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入资源描述"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 mb-1">资源类型</label>
            <select v-model="resourceForm.resourceType" class="w-full px-3 py-2 border rounded">
              <option value="document">文档</option>
              <option value="video">视频</option>
              <option value="code">代码</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="mb-5">
            <label class="block text-gray-700 mb-1">选择文件</label>
            <input
              ref="resourceFileInput"
              type="file"
              @change="handleResourceFileChange"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showResourceDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
            <button type="submit" :disabled="uploadingResource" class="px-4 py-1 rounded bg-blue-600 text-white">
              {{ uploadingResource ? '上传中...' : '上传' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 查看学生对话框 -->
    <div v-if="showStudentsDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">已报名学生列表</h2>
          <button @click="showStudentsDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="loadingStudents" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="studentsError" class="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
          {{ studentsError }}
        </div>
        
        <div v-else-if="students.length === 0" class="bg-gray-50 p-8 rounded-lg text-center">
          <p class="text-gray-500">暂无学生报名</p>
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生姓名</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学号/邮箱</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名时间</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in students" :key="student.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ student.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ student.email || student.studentId }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ new Date(student.enrollTime).toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEnrollmentStatusClass(student.status)">
                    {{ getEnrollmentStatusText(student.status) }}
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
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import TeacherCourseManager from '@/components/classroom/TeacherCourseManager.vue'
import { searchUser } from '@/lib/api/auth'
import { 
  createCourse, 
  updateCourse,
  deleteCourse, 
  updateCourseStatus, 
  getTeacherCourses,
  CourseStatus,
  CourseType,
  DualTeacherCourseDTO,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  getCourseStudents,
  initializeCourseProgressForAllStudents
} from '@/lib/api/classroom'

const router = useRouter()

// 课程相关响应式数据
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const courseLoading = ref(false)
const courseError = ref('')

// 对话框控制
const showCourseDialog = ref(false)
const isEditingCourse = ref(false)
const currentCourseId = ref<number | null>(null)
const savingCourse = ref(false)

// 课程表单数据
const courseForm = ref<DualTeacherCourseDTO>({
  title: '',
  description: '',
  scheduledTime: '',
  maxStudents: 30,
  location: '',
  courseType: CourseType.HYBRID,
  mentorId: undefined
})

// 企业导师搜索相关
const mentorSearchKeyword = ref('')
const mentorSearching = ref(false)
const mentorSearchResults = ref<any[]>([])
const selectedMentor = ref<{id: number, name: string, role: string} | null>(null)

// 资源上传相关
const showResourceDialog = ref(false)
const resourceForm = ref<CourseResourceDTO>({
  courseId: 0,
  title: '',
  description: '',
  resourceType: 'document'
})
const resourceFile = ref<File | null>(null)
const resourceFileInput = ref<HTMLInputElement | null>(null)
const uploadingResource = ref(false)

// 学生查看相关
const showStudentsDialog = ref(false)
const currentCourseIdForStudents = ref<number | null>(null)
const students = ref<any[]>([])
const loadingStudents = ref(false)
const studentsError = ref('')

// 获取教师课程列表
async function fetchCourses() {
  courseLoading.value = true
  courseError.value = ''
  try {
    const response = await getTeacherCourses(currentPage.value, pageSize.value)
    if (response && response.data) {
      courseList.value = response.data.records
      totalCourses.value = response.data.total
    }
  } catch (error) {
    console.error('获取教师课程列表失败:', error)
    courseError.value = '获取课程列表失败，请稍后再试'
  } finally {
    courseLoading.value = false
  }
}

// 处理分页变化
function handlePageChange(page: number) {
  currentPage.value = page
  fetchCourses()
}

// 处理状态变更
async function handleStatusChange(data: { id: number, status: CourseStatus }) {
  try {
    await updateCourseStatus(data.id, data.status)
    alert('课程状态更新成功')
    fetchCourses() // 刷新列表
  } catch (error: any) {
    alert('更新课程状态失败: ' + (error.message || '未知错误'))
  }
}

// 搜索企业导师
async function searchMentor() {
  if (!mentorSearchKeyword.value.trim()) {
    alert('请输入企业导师的邮箱或手机号')
    return
  }
  
  mentorSearching.value = true
  try {
    const res = await searchUser(mentorSearchKeyword.value.trim()) as any
    const user = res.data
    
    if (user && (user.role === 'MENTOR' || user.role === 'mentor' || user.role === 'EN_ADMIN' || user.role === 'EN_TEACHER')) {
      mentorSearchResults.value = [user]
    } else if (user) {
      alert('搜索到的用户不是企业导师')
      mentorSearchResults.value = []
    } else {
      alert('未找到匹配的用户')
      mentorSearchResults.value = []
    }
  } catch (error) {
    console.error('搜索企业导师失败:', error)
    alert('搜索失败: ' + (error as any).message || '未知错误')
    mentorSearchResults.value = []
  } finally {
    mentorSearching.value = false
  }
}

// 选择企业导师
function selectMentor(mentor: any) {
  selectedMentor.value = {
    id: mentor.id,
    name: mentor.nickname || mentor.account || '未知导师',
    role: mentor.role
  }
  courseForm.value.mentorId = mentor.id
  mentorSearchResults.value = []
}

// 清除已选择的企业导师
function clearSelectedMentor() {
  selectedMentor.value = null
  courseForm.value.mentorId = undefined
}

// 打开创建课程对话框
function openCreateCourseDialog() {
  isEditingCourse.value = false
  currentCourseId.value = null
  resetCourseForm()
  showCourseDialog.value = true
}

// 打开编辑课程对话框
async function openEditCourseDialog(course: DualTeacherCourseVO) {
  isEditingCourse.value = true
  currentCourseId.value = course.id
  courseForm.value = {
    title: course.title,
    description: course.description,
    scheduledTime: course.scheduledTime,
    maxStudents: course.maxStudents,
    location: course.location,
    courseType: course.courseType as CourseType,
    mentorId: course.mentorId
  }
  
  // 如果有导师信息，则设置已选择导师
  if (course.mentorId && course.mentorName) {
    selectedMentor.value = {
      id: course.mentorId,
      name: course.mentorName,
      role: 'mentor'
    }
  } else {
    selectedMentor.value = null
  }
  
  showCourseDialog.value = true
}

// 保存课程
async function saveCourse() {
  // 验证导师选择
  if (!courseForm.value.mentorId) {
    alert('请选择一位企业导师')
    return
  }
  
  savingCourse.value = true
  try {
    let createdCourseId: number | null = null
    
    if (isEditingCourse.value && currentCourseId.value) {
      await updateCourse(currentCourseId.value, courseForm.value)
      alert('课程更新成功')
    } else {
      const createResponse = await createCourse(courseForm.value)
      if (createResponse.code === 200 && createResponse.data) {
        createdCourseId = createResponse.data.id
        alert('课程创建成功')
        
        // 如果是新创建的课程，批量初始化所有学生的学习进度
        if (createdCourseId) {
          try {
            await initializeCourseProgressForAllStudents(createdCourseId)
            console.log('批量初始化学生进度成功')
          } catch (initError: any) {
            console.warn('批量初始化学生进度失败:', initError)
            // 不阻止课程创建成功，只记录警告
          }
        }
      }
    }
    
    showCourseDialog.value = false
    resetCourseForm()
    await fetchCourses()
  } catch (error: any) {
    alert('保存课程失败: ' + (error.message || '未知错误'))
  } finally {
    savingCourse.value = false
  }
}

// 删除课程
async function onDeleteCourse(courseId: number) {
  if (confirm('确定要删除此课程吗？此操作不可恢复。')) {
    try {
      await deleteCourse(courseId)
      alert('课程删除成功')
      await fetchCourses()
    } catch (error: any) {
      alert('删除课程失败: ' + (error.message || '未知错误'))
    }
  }
}

// 重置课程表单
function resetCourseForm() {
  courseForm.value = {
    title: '',
    description: '',
    scheduledTime: '',
    maxStudents: 30,
    location: '',
    courseType: CourseType.HYBRID,
    mentorId: undefined
  }
  
  // 清空导师搜索相关状态
  mentorSearchKeyword.value = ''
  mentorSearchResults.value = []
  selectedMentor.value = null
}

// 资源上传相关方法
function openResourceUploadDialog(courseId: number) {
  resourceForm.value.courseId = courseId
  resourceForm.value.title = ''
  resourceForm.value.description = ''
  resourceForm.value.resourceType = 'document'
  resourceFile.value = null
  showResourceDialog.value = true
}

function handleResourceFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resourceFile.value = target.files[0]
  }
}

async function uploadCourseResource() {
  if (!resourceFile.value) {
    alert('请选择要上传的文件')
    return
  }
  
  uploadingResource.value = true
  try {
    const formData = new FormData()
    formData.append('file', resourceFile.value)
    formData.append('data', JSON.stringify(resourceForm.value))
    
    await uploadResource(formData)
    showResourceDialog.value = false
    alert('资源上传成功')
  } catch (error: any) {
    alert('资源上传失败: ' + (error.message || '未知错误'))
  } finally {
    uploadingResource.value = false
  }
}

// 查看课程学生
async function viewCourseStudents(courseId: number) {
  currentCourseIdForStudents.value = courseId
  showStudentsDialog.value = true
  loadingStudents.value = true
  studentsError.value = ''
  
  try {
    // 这里假设有一个API用于获取课程学生
    const response = await getCourseStudents(courseId)
    students.value = response.data || []
  } catch (error: any) {
    console.error('获取课程学生失败:', error)
    studentsError.value = error.message || '获取学生列表失败'
    students.value = []
  } finally {
    loadingStudents.value = false
  }
}

// 获取报名状态显示文本
function getEnrollmentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'enrolled': '已报名',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取报名状态样式类
function getEnrollmentStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'enrolled': 'px-2 py-1 rounded text-xs bg-green-100 text-green-800',
    'completed': 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800',
    'cancelled': 'px-2 py-1 rounded text-xs bg-red-100 text-red-800'
  }
  return classMap[status] || 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchCourses()
})
</script> 