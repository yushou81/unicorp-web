<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 使用通用导航栏组件 -->
    <Navbar />
    
    <div class="py-10">
      <div class="container mx-auto px-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex items-center mb-10">
          <img :src="mentor.avatar" class="w-20 h-20 rounded-full border-2 border-blue-200 mr-6" alt="avatar" />
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-2xl font-bold text-gray-900 mr-2">{{ mentor.name }}</span>
              <span v-if="mentor.verified" class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 ml-2">已认证</span>
            </div>
            <div class="text-gray-500 text-sm mb-1">{{ mentor.email }}</div>
            <div class="text-gray-500 text-sm">{{ mentor.phone }}</div>
            <div class="text-gray-500 text-sm mt-1">所属企业：{{ mentor.company || '未绑定' }}</div>
          </div>
          <button @click="onEditProfileClick" class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">编辑资料</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div v-for="(block, idx) in blocks" :key="idx" class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 flex flex-col mb-2">
            <div class="flex items-center mb-4">
              <component :is="block.icon" class="w-7 h-7 mr-2" :class="block.color" />
              <span class="font-semibold text-lg">{{ block.title }}</span>
            </div>
            <ul>
              <li v-for="item in block.data" :key="item.id || item" class="flex justify-between items-center mb-2 text-gray-700">
                <span>{{ item.label || item }}</span>
                <span v-if="item.extra" class="text-xs text-gray-400 ml-2">{{ item.extra }}</span>
              </li>
              <li v-if="block.data.length === 0" class="text-gray-400 text-sm">{{ block.empty }}</li>
            </ul>
            <div v-if="block.footer">
              <router-link :to="block.footer.link" class="text-blue-600 hover:underline text-xs font-medium mt-2">{{ block.footer.text }}</router-link>
            </div>
          </div>
        </div>
        
        <!-- 编辑个人资料对话框 -->
        <div v-if="showEditProfileDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">编辑个人资料</h2>
            <form @submit.prevent="onUpdateProfile">
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">昵称</label>
                <input v-model="editProfile.nickname" class="w-full px-3 py-2 border rounded" placeholder="请输入昵称" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">邮箱</label>
                <input v-model="editProfile.email" type="email" class="w-full px-3 py-2 border rounded" placeholder="请输入邮箱" />
              </div>
              <div class="mb-3">
                <label class="block text-gray-700 mb-1">手机号</label>
                <input v-model="editProfile.phone" class="w-full px-3 py-2 border rounded" placeholder="请输入手机号" />
              </div>
              <div class="flex justify-end space-x-2 mt-4">
                <button type="button" @click="showEditProfileDialog = false" class="px-4 py-1 rounded bg-gray-200 text-gray-700">取消</button>
                <button type="submit" :disabled="updateProfileLoading" class="px-4 py-1 rounded bg-blue-600 text-white">{{ updateProfileLoading ? '保存中...' : '保存' }}</button>
              </div>
            </form>
            <div class="mt-6 pt-4 border-t">
              <h3 class="text-lg font-semibold mb-3">修改密码</h3>
              <form @submit.prevent="onChangePassword">
                <div class="mb-3">
                  <label class="block text-gray-700 mb-1">原密码</label>
                  <input v-model="passwordChange.oldPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入原密码" />
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 mb-1">新密码</label>
                  <input v-model="passwordChange.newPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请输入新密码" />
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 mb-1">确认新密码</label>
                  <input v-model="passwordChange.confirmPassword" type="password" required class="w-full px-3 py-2 border rounded" placeholder="请再次输入新密码" />
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="submit" :disabled="changePasswordLoading" class="px-4 py-1 rounded bg-green-600 text-white">{{ changePasswordLoading ? '修改中...' : '修改密码' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 课程详情对话框 -->
    <div v-if="showCourseDetailsDialog && currentCourse" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">课程详情</h2>
          <button @click="showCourseDetailsDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold">{{ currentCourse.title }}</h3>
            <p class="text-gray-600 mt-1">{{ currentCourse.description }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">授课教师</p>
              <p>{{ currentCourse.teacherName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">企业导师</p>
              <p>{{ currentCourse.mentorName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程时间</p>
              <p>{{ formatDate(currentCourse.scheduledTime) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程地点</p>
              <p>{{ currentCourse.location || '未指定' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">课程类型</p>
              <p>{{ getCourseTypeText(currentCourse.courseType as CourseType) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">当前状态</p>
              <p>{{ getCourseStatusText(currentCourse.status as CourseStatus) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">已报名/最大人数</p>
              <p>{{ currentCourse.enrolledCount }}/{{ currentCourse.maxStudents }}</p>
            </div>
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button @click="openResourceUploadDialog(currentCourse.id)" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              上传资源
            </button>
            <button @click="showCourseDetailsDialog = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              关闭
            </button>
          </div>
        </div>
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
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserGroupIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpTrayIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getMe, updatePassword, updateUserInfo } from '@/lib/api/auth'
import Navbar from '@/components/layout/Navbar.vue'
// 导入双师课堂相关API
import { 
  getMentorCourses,
  updateCourse,
  CourseStatus,
  CourseType,
  DualTeacherCourseVO,
  CourseResourceDTO,
  uploadResource,
  deleteResource,
  getResourcesByCourseId
} from '@/lib/api/classroom'

const mentor = ref({
  avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
  name: '加载中...',
  email: '',
  phone: '',
  verified: false,
  company: '加载中...',
  school: ''
})

const students = [
  { id: 1, name: '李四', major: '计算机' },
  { id: 2, name: '王五', major: '人工智能' }
]
const projects = [
  { id: 1, title: 'AI创新项目', date: '2024-06-01' },
  { id: 2, title: '大数据分析', date: '2024-05-15' }
]
const resources = [
  { id: 1, title: '企业导师手册', date: '2024-06-20' }
]
const blocks = ref([
  {
    title: '双师课堂管理',
    icon: UserGroupIcon,
    color: 'text-blue-500',
    data: [],
    empty: '暂无课程',
    footer: { text: '管理课程', link: '/classroom' }
  },
  {
    title: '项目管理',
    icon: BriefcaseIcon,
    color: 'text-green-500',
    data: [
      { id: 1, label: 'AI创新项目', extra: '进行中' }
    ],
    empty: '暂无项目',
    footer: { text: '管理项目', link: '/project' }
  },
  {
    title: '学生成果查看',
    icon: AcademicCapIcon,
    color: 'text-indigo-500',
    data: [
      { id: 1, label: 'AI创新项目论文', extra: '李四' }
    ],
    empty: '暂无成果',
    footer: { text: '查看全部成果', link: '/achievements' }
  },
  {
    title: '资源上传',
    icon: ArrowUpTrayIcon,
    color: 'text-purple-500',
    data: [],
    empty: '暂无上传资源',
    footer: { text: '上传资源', link: '/resources' }
  },
  {
    title: '学校信息浏览',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部学校', link: '/school/list' }
  },
  {
    title: '企业信息浏览',
    icon: BuildingOffice2Icon,
    color: 'text-yellow-600',
    data: [],
    empty: '点击下方进入',
    footer: { text: '查看全部企业', link: '/company/list' }
  }
])

const router = useRouter()
const appStore = useAppStore()

const userInfo = computed(() => appStore.user as any || {})
const userAvatar = computed(() => (userInfo.value?.avatar as string) || 'https://randomuser.me/api/portraits/men/34.jpg')
const roleText = computed(() => {
  const role = userInfo.value?.role as string
  const roleMap: Record<string, string> = {
    'admin': '系统管理员',
    'SYSADMIN': '系统管理员',
    'schoolAdmin': '学校管理员',
    'SCH_ADMIN': '学校管理员',
    'companyAdmin': '企业管理员',
    'EN_ADMIN': '企业管理员',
    'teacher': '教师',
    'TEACHER': '教师',
    'mentor': '企业导师',
    'MENTOR': '企业导师',
    'student': '学生',
    'STUDENT': '学生'
  }
  return roleMap[role] || '未知角色'
})

// 添加课程相关响应式数据
const courseList = ref<DualTeacherCourseVO[]>([])
const totalCourses = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showCourseDetailsDialog = ref(false)
const currentCourse = ref<DualTeacherCourseVO | null>(null)

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

// 添加 fetchMentorInfo 函数
async function fetchMentorInfo() {
  try {
    const res = await getMe() as any
    const userData = res.data
    if (userData) {
      mentor.value = {
        avatar: userData.avatarUrl || 'https://randomuser.me/api/portraits/men/34.jpg',
        name: userData.nickname || userData.account || '未知导师',
        email: userData.email || '',
        phone: userData.phone || '',
        verified: userData.verified || false,
        company: userData.organizationName || '未绑定企业',
        school: ''
      }
    }
  } catch (e: any) {
    console.error('获取导师信息失败:', e)
    // 保持默认值
  }
}

// 添加获取导师参与的课程列表的方法
async function fetchMentorCourses() {
  try {
    const response = await getMentorCourses(currentPage.value, pageSize.value)
    if (response && response.data) {
      courseList.value = response.data.records
      totalCourses.value = response.data.total
      
      // 更新数据块中的课程信息
      const courseData = courseList.value.map(course => ({
        id: course.id,
        label: course.title,
        extra: new Date(course.scheduledTime).toLocaleDateString()
      }))
      
      // 更新blocks中的课程数据
      const courseBlockIndex = blocks.value.findIndex(block => block.title === '双师课堂管理')
      if (courseBlockIndex !== -1) {
        blocks.value[courseBlockIndex].data = courseData as any[] // 添加类型断言
      }
    }
  } catch (error) {
    console.error('获取导师课程列表失败:', error)
  }
}

// 查看课程详情
function viewCourseDetails(course: DualTeacherCourseVO) {
  currentCourse.value = course
  showCourseDetailsDialog.value = true
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
  } catch (error) {
    console.error('资源上传失败:', error)
    alert('资源上传失败: ' + (error as any).message || '未知错误')
  } finally {
    uploadingResource.value = false
  }
}

// 格式化日期显示
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取课程状态中文名称
function getCourseStatusText(status: CourseStatus) {
  const statusMap: Record<string, string> = {
    'planning': '筹备中',
    'open': '开放报名',
    'in_progress': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取课程类型中文名称
function getCourseTypeText(type: CourseType) {
  const typeMap: Record<string, string> = {
    'online': '线上',
    'offline': '线下',
    'hybrid': '混合'
  }
  return typeMap[type] || '未知类型'
}

onMounted(() => {
  fetchMentorInfo()
  fetchMentorCourses()
})

function onLogout() {
  appStore.logout()
  router.push('/login')
}

const showEditProfileDialog = ref(false)
const editProfile = ref({
  nickname: '',
  email: '',
  phone: ''
})
const passwordChange = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const updateProfileLoading = ref(false)
const changePasswordLoading = ref(false)

async function onUpdateProfile() {
  updateProfileLoading.value = true
  try {
    await updateUserInfo({
      nickname: editProfile.value.nickname,
      email: editProfile.value.email,
      phone: editProfile.value.phone
    })
    showEditProfileDialog.value = false
    await fetchMentorInfo() // 重新获取导师信息
    // 更新store中的用户信息
    const res = await getMe() as any
    if (res.data) {
      appStore.setUser(res.data)
    }
    alert('个人资料更新成功')
  } catch (e: any) {
    alert('更新失败：' + (e.message || '未知错误'))
  } finally {
    updateProfileLoading.value = false
  }
}

async function onChangePassword() {
  if (passwordChange.value.newPassword !== passwordChange.value.confirmPassword) {
    alert('新密码与确认密码不一致')
    return
  }
  
  changePasswordLoading.value = true
  try {
    await updatePassword({
      oldPassword: passwordChange.value.oldPassword,
      newPassword: passwordChange.value.newPassword,
      confirmPassword: passwordChange.value.confirmPassword
    })
    passwordChange.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    alert('密码修改成功')
  } catch (e: any) {
    alert('密码修改失败：' + (e.message || '未知错误'))
  } finally {
    changePasswordLoading.value = false
  }
}

// 当打开编辑对话框时，初始化表单数据
function openEditDialog() {
  editProfile.value = {
    nickname: userInfo.value?.nickname || userInfo.value?.account || '',
    email: userInfo.value?.email || '',
    phone: userInfo.value?.phone || ''
  }
  showEditProfileDialog.value = true
}

// 修改按钮点击事件
function onEditProfileClick() {
  openEditDialog()
}
</script> 