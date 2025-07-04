<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <UserProfileInfo
          :avatar="userAvatar"
          :name="teacher.name"
          :role="'教师'"
          :organization="teacher.school || '未绑定'"
          :phone="teacher.phone"
          :email="teacher.email"
          :editable="true"
          :verified="teacher.verified"
          :onEdit="onEditProfileClick"
      />
      <DashboardTabs
          :tabs="[{ label: '我的课堂', value: 'my-courses' }]"
          :activeTab="activeTab"
          @change="activeTab = $event"
      />
      <div class="flex justify-end mt-8">
        <button @click="showCreateDialog = true" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow">
          创建双师课堂
        </button>
      </div>
      <div v-if="activeTab === 'my-courses'">
        <div class="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 class="text-xl font-semibold mb-4">我的双师课堂课程</h2>
          <div v-if="loadingCourses" class="text-center py-8 text-gray-400">加载中...</div>
          <div v-else-if="courses.length === 0" class="text-center py-8 text-gray-400">暂无课程</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">课程名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">人数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in courses" :key="course.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ course.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ new Date(course.scheduledTime).toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ courseTypeText(course.courseType) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ course.enrolledCount }}/{{ course.maxStudents }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select v-model="course.status" @change="onUpdateCourseStatus(course)" class="border rounded px-2 py-1">
                    <option value="planning">筹备中</option>
                    <option value="open">开放报名</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已结束</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <router-link :to="`/classroom/${course.id}`" class="text-green-600 hover:text-green-900">详情</router-link>
                  <button @click="openEditDialog(course)" class="text-blue-600 hover:text-blue-900">编辑</button>
                  <button @click="onDeleteCourse(course.id)" class="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="flex justify-end mt-4 space-x-2">
              <button :disabled="page === 1" @click="changePage(page-1)" class="px-3 py-1 rounded bg-gray-200 text-gray-700">上一页</button>
              <span class="px-2">第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
              <button :disabled="page === totalPages" @click="changePage(page+1)" class="px-3 py-1 rounded bg-gray-200 text-gray-700">下一页</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showCreateDialog || showEditDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" @click="closeDialog">×</button>
          <h2 class="text-xl font-bold mb-4">{{ showEditDialog ? '编辑课程' : '创建双师课堂课程' }}</h2>
          <form @submit.prevent="showEditDialog ? onUpdateCourse() : onCreateCourse()">
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程标题</label>
              <input v-model="form.title" required class="w-full px-3 py-2 border rounded" placeholder="请输入课程标题" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程描述</label>
              <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border rounded" placeholder="请输入课程描述"></textarea>
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程时间</label>
              <input v-model="form.scheduledTime" type="datetime-local" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">最大学生数</label>
              <input v-model.number="form.maxStudents" type="number" min="1" max="100" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程地点</label>
              <input v-model="form.location" class="w-full px-3 py-2 border rounded" placeholder="请输入课程地点" />
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">课程类型</label>
              <select v-model="form.courseType" class="w-full px-3 py-2 border rounded">
                <option value="online">线上课程</option>
                <option value="offline">线下课程</option>
                <option value="hybrid">混合课程</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="block text-gray-700 mb-1">企业导师</label>
              <div class="flex space-x-2">
                <input v-model="mentorSearchKeyword" class="flex-1 px-3 py-2 border rounded" placeholder="输入导师邮箱或手机号" />
                <button type="button" @click="searchMentor" class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">搜索</button>
              </div>
              <div v-if="mentorSearchResult" class="mt-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                <span>{{ mentorSearchResult.nickname || mentorSearchResult.email || mentorSearchResult.phone }}</span>
                <button type="button" @click="selectMentor(mentorSearchResult)" class="ml-2 px-2 py-1 bg-green-500 text-white rounded">选择</button>
              </div>
              <div v-if="selectedMentor" class="mt-2 p-2 bg-green-50 rounded flex items-center justify-between">
                <span>已选导师：{{ selectedMentor.nickname || selectedMentor.email || selectedMentor.phone }}</span>
                <button type="button" @click="clearSelectedMentor" class="ml-2 px-2 py-1 bg-red-500 text-white rounded">移除</button>
              </div>
            </div>
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="closeDialog" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
              <button type="submit" :disabled="loading" class="px-4 py-1 rounded bg-blue-600 text-white">
                {{ loading ? (showEditDialog ? '保存中...' : '创建中...') : (showEditDialog ? '保存' : '创建') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showDetailDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" @click="showDetailDialog = false">×</button>
          <h2 class="text-xl font-bold mb-4">课程详情</h2>
          <div v-if="detailLoading" class="text-center py-8 text-gray-400">加载中...</div>
          <div v-else-if="!detailCourse" class="text-center py-8 text-gray-400">未找到课程</div>
          <div v-else>
            <div class="mb-2"><b>课程名称：</b>{{ detailCourse.title }}</div>
            <div class="mb-2"><b>描述：</b>{{ detailCourse.description }}</div>
            <div class="mb-2"><b>时间：</b>{{ new Date(detailCourse.scheduledTime).toLocaleString() }}</div>
            <div class="mb-2"><b>类型：</b>{{ courseTypeText(detailCourse.courseType) }}</div>
            <div class="mb-2"><b>人数：</b>{{ detailCourse.enrolledCount }}/{{ detailCourse.maxStudents }}</div>
            <div class="mb-2"><b>状态：</b>{{ statusText(detailCourse.status) }}</div>
            <div class="mb-2"><b>企业导师：</b>{{ detailCourse.mentorName || '-' }}</div>
            <div class="mb-2"><b>企业名称：</b>{{ detailCourse.enterpriseName || '-' }}</div>
            <div class="mb-2"><b>地点：</b>{{ detailCourse.location || '-' }}</div>
            <div class="mb-2"><b>创建时间：</b>{{ new Date(detailCourse.createdAt).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getMe, searchUser } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'
import UserProfileInfo from '@/components/dashboard/UserProfileInfo.vue'
import DashboardTabs from '@/components/dashboard/DashboardTabs.vue'
import { createCourse, getTeacherCourses, updateCourse, deleteCourse, getCourseById, updateCourseStatus } from '@/lib/api/classroom'

const teacher = ref({
  avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  school: '加载中...',
  company: ''
})

const appStore = useAppStore()
const userInfo = computed(() => appStore.user as any || {})
const userAvatar = computed(() => (userInfo.value?.avatar as string) || 'https://randomuser.me/api/portraits/men/33.jpg')

async function fetchTeacherInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      teacher.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/33.jpg',
        name: userData.nickname || userData.account || '未知教师',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        school: userData.organizationName || '未绑定学校',
        company: ''
      }
    }
  } catch (e: any) {
    console.error('获取教师信息失败:', e)
  }
}

const activeTab = ref('my-courses')

// 课程列表相关
const courses = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const loadingCourses = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

async function fetchCourses() {
  loadingCourses.value = true
  try {
    const res = await getTeacherCourses(page.value, size.value)
    if (res && res.data) {
      courses.value = res.data.records
      total.value = res.data.total
    }
  } catch (e) {
    courses.value = []
    total.value = 0
  } finally {
    loadingCourses.value = false
  }
}

function changePage(newPage: number) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchCourses()
  }
}

function courseTypeText(type: string) {
  if (type === 'online') return '线上课程'
  if (type === 'offline') return '线下课程'
  if (type === 'hybrid') return '混合课程'
  return type
}
function statusText(status: string) {
  const map: Record<string, string> = {
    planning: '筹备中',
    open: '开放报名',
    in_progress: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  fetchTeacherInfo()
  fetchCourses()
})

function onEditProfileClick() {
  // 这里可以弹出编辑对话框或其他逻辑
}

// 创建/编辑课程相关
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingCourseId = ref<number|null>(null)
const loading = ref(false)
const mentorSearchKeyword = ref('')
const mentorSearchResult = ref(null)
const selectedMentor = ref(null)
const form = ref({
  title: '',
  description: '',
  scheduledTime: '',
  maxStudents: 30,
  location: '',
  courseType: 'hybrid',
  mentorId: ''
})

function openEditDialog(course: any) {
  showEditDialog.value = true
  showCreateDialog.value = false
  editingCourseId.value = course.id
  form.value = {
    title: course.title,
    description: course.description,
    scheduledTime: course.scheduledTime.slice(0, 16),
    maxStudents: course.maxStudents,
    location: course.location,
    courseType: course.courseType,
    mentorId: course.mentorId || ''
  }
  selectedMentor.value = course.mentorId ? { id: course.mentorId, nickname: course.mentorName } : null
}
function closeDialog() {
  showCreateDialog.value = false
  showEditDialog.value = false
  editingCourseId.value = null
  form.value = {
    title: '',
    description: '',
    scheduledTime: '',
    maxStudents: 30,
    location: '',
    courseType: 'hybrid',
    mentorId: ''
  }
}
async function onCreateCourse() {
  loading.value = true
  try {
    await createCourse(form.value)
    showCreateDialog.value = false
    form.value = {
      title: '',
      description: '',
      scheduledTime: '',
      maxStudents: 30,
      location: '',
      courseType: 'hybrid',
      mentorId: ''
    }
    fetchCourses()
    alert('课程创建成功')
  } catch (e: any) {
    alert('创建失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onUpdateCourse() {
  if (!editingCourseId.value) return
  loading.value = true
  try {
    await updateCourse(editingCourseId.value, form.value)
    showEditDialog.value = false
    editingCourseId.value = null
    fetchCourses()
    alert('课程更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onDeleteCourse(id: number) {
  if (!confirm('确定要删除此课程吗？此操作不可恢复。')) return
  loading.value = true
  try {
    await deleteCourse(id)
    fetchCourses()
    alert('课程已删除')
  } catch (e: any) {
    alert('删除失败：' + (e.message || '未知错误'))
  } finally {
    loading.value = false
  }
}
async function onUpdateCourseStatus(course) {
  try {
    await updateCourseStatus(course.id, course.status)
    fetchCourses()
    alert('课程状态已更新')
  } catch (e) {
    alert('更新课程状态失败：' + (e.message || '未知错误'))
    fetchCourses()
  }
}
// 课程详情相关
const showDetailDialog = ref(false)
const detailLoading = ref(false)
const detailCourse = ref<any>(null)
async function showCourseDetail(id: number) {
  showDetailDialog.value = true
  detailLoading.value = true
  detailCourse.value = null
  try {
    const res = await getCourseById(id)
    detailCourse.value = res.data
  } catch (e) {
    detailCourse.value = null
  } finally {
    detailLoading.value = false
  }
}
async function searchMentor() {
  if (!mentorSearchKeyword.value.trim()) {
    alert('请输入导师邮箱或手机号')
    return
  }
  try {
    const res = await searchUser(mentorSearchKeyword.value.trim())
    if (
      res.data &&
      (
        res.data.role === 'MENTOR' ||
        res.data.role === 'mentor' ||
        res.data.role === 'EN_TEACHER' ||
        res.data.role === 'en_teacher'
      )
    ) {
      mentorSearchResult.value = res.data
    } else {
      alert('该用户不是企业导师')
      mentorSearchResult.value = null
    }
  } catch (e) {
    alert('未找到该用户')
    mentorSearchResult.value = null
  }
}
function selectMentor(user) {
  selectedMentor.value = user
  form.value.mentorId = user.id
  mentorSearchResult.value = null
}
function clearSelectedMentor() {
  selectedMentor.value = null
  form.value.mentorId = ''
}
</script>
